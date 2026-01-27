'use client';

import { useState, useMemo, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { GatherQueueCard } from '@/components/gather/GatherQueueCard';
import { ManualEntryForm } from '@/components/gather/ManualEntryForm';
import { DukePlantBrowser } from '@/components/gather/DukePlantBrowser';
import { addItemToQueue, removeItemFromQueue } from './actions';
import type {
  GatherContentType,
  GatherQueueItemWithStatus,
  DukePlantSummary,
} from '@/types/gather-queue';

interface GatherQueueClientProps {
  initialItems: GatherQueueItemWithStatus[];
  dukePlants: DukePlantSummary[];
}

const TABS: { value: GatherContentType; label: string }[] = [
  { value: 'plant', label: 'Plants' },
  { value: 'condition', label: 'Conditions' },
  { value: 'remedy', label: 'Remedies' },
  { value: 'ingredient', label: 'Ingredients' },
  { value: 'preparation', label: 'Preparations' },
  { value: 'action', label: 'Actions' },
  { value: 'term', label: 'Terms' },
  { value: 'tea', label: 'Teas' },
];

export function GatherQueueClient({ initialItems, dukePlants }: GatherQueueClientProps) {
  const [activeTab, setActiveTab] = useState<GatherContentType>('plant');
  const [items, setItems] = useState(initialItems);
  const [isPending, startTransition] = useTransition();

  // Items for the active tab
  const tabItems = useMemo(
    () => items.filter(item => item.type === activeTab),
    [items, activeTab]
  );

  // Count per tab
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const tab of TABS) {
      counts[tab.value] = items.filter(i => i.type === tab.value).length;
    }
    return counts;
  }, [items]);

  // Status summary for active tab
  const statusCounts = useMemo(() => {
    const queued = tabItems.filter(i => i.status === 'queued').length;
    const staged = tabItems.filter(i => i.status === 'staged').length;
    const merged = tabItems.filter(i => i.status === 'merged').length;
    return { queued, staged, merged };
  }, [tabItems]);

  // Set of existing IDs for the active tab (for deduplication)
  const existingIds = useMemo(
    () => new Set(tabItems.map(i => i.id)),
    [tabItems]
  );

  // Set of duke slugs already queued (for plant tab)
  const queuedDukeSlugs = useMemo(
    () => new Set(
      items
        .filter(i => i.type === 'plant' && i.dukeRef)
        .map(i => i.dukeRef!)
    ),
    [items]
  );

  const handleAddItem = (id: string, name: string, type: GatherContentType, dukeRef?: string) => {
    // Optimistic update
    const newItem: GatherQueueItemWithStatus = {
      id,
      name,
      type,
      addedAt: new Date().toISOString().split('T')[0],
      status: 'queued',
      ...(dukeRef && { dukeRef }),
    };
    setItems(prev => [...prev, newItem]);

    startTransition(async () => {
      const result = await addItemToQueue(id, name, type, dukeRef);
      if (!result.success) {
        // Revert optimistic update
        setItems(prev => prev.filter(i => !(i.id === id && i.type === type)));
      }
    });
  };

  const handleRemoveItem = (id: string, type: string) => {
    // Optimistic update
    setItems(prev => prev.filter(i => !(i.id === id && i.type === type)));

    startTransition(async () => {
      const result = await removeItemFromQueue(id, type as GatherContentType);
      if (!result.success) {
        // Revert: re-fetch would be needed, but for now just log
        console.error('Failed to remove item:', result.error);
      }
    });
  };

  const handleAddPlant = (slug: string, latinName: string) => {
    // Use the slug as both ID and dukeRef for plants from Duke
    handleAddItem(slug, latinName, 'plant', slug);
  };

  const handleManualAdd = (id: string, name: string, type: GatherContentType) => {
    handleAddItem(id, name, type);
  };

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              'flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors',
              activeTab === tab.value
                ? 'border-amber bg-amber/20 text-amber'
                : 'border-moss bg-deep-forest/80 text-mist hover:border-sage hover:text-cream'
            )}
          >
            {tab.label}
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-xs',
                activeTab === tab.value
                  ? 'bg-amber/30 text-amber'
                  : 'bg-moss/50 text-sage'
              )}
            >
              {tabCounts[tab.value]}
            </span>
          </button>
        ))}
      </div>

      {/* Status summary */}
      {tabItems.length > 0 && (
        <div className="text-sm text-sage">
          {statusCounts.queued} queued, {statusCounts.staged} staged, {statusCounts.merged} merged
        </div>
      )}

      {/* Main content area */}
      <div className={cn(
        'grid gap-6',
        activeTab === 'plant' ? 'lg:grid-cols-2' : 'lg:grid-cols-2'
      )}>
        {/* Left: Entry form / Duke browser */}
        <div className="rounded-xl border border-moss bg-deep-forest/80 p-5">
          {activeTab === 'plant' ? (
            <DukePlantBrowser
              plants={dukePlants}
              queuedSlugs={queuedDukeSlugs}
              onAdd={handleAddPlant}
            />
          ) : (
            <ManualEntryForm
              type={activeTab}
              existingIds={existingIds}
              onAdd={handleManualAdd}
            />
          )}
        </div>

        {/* Right: Queue list */}
        <div>
          {tabItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-moss bg-deep-forest/80 py-12">
              <svg
                className="mb-4 h-12 w-12 text-moss"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
              <p className="font-display text-lg text-cream">No items yet</p>
              <p className="mt-1 text-sm text-sage">
                {activeTab === 'plant'
                  ? 'Search the Duke reference to add plants'
                  : 'Use the form above to add items'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-sage">
                {tabItems.length} item{tabItems.length !== 1 ? 's' : ''}
              </div>
              <div className="max-h-[calc(100vh-320px)] space-y-3 overflow-y-auto pr-1">
                {tabItems.map(item => (
                  <GatherQueueCard
                    key={`${item.type}-${item.id}`}
                    item={item}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pending indicator */}
      {isPending && (
        <div className="fixed bottom-4 right-4 rounded-lg border border-moss bg-deep-forest/95 px-4 py-2 text-sm text-sage shadow-lg">
          Saving...
        </div>
      )}
    </div>
  );
}
