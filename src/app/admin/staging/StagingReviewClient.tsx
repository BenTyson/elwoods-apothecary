'use client';

import { useState, useMemo, useTransition } from 'react';
import { StagedItemSummary, StagedItemDetail, StagedItemType } from '@/types/staging';
import { StagedItemCard } from '@/components/staging/StagedItemCard';
import { StagedItemDetail as StagedItemDetailView } from '@/components/staging/StagedItemDetail';
import { fetchStagedItemDetail } from './actions';
import { cn } from '@/lib/utils';

interface StagingReviewClientProps {
  initialItems: StagedItemSummary[];
}

type FilterType = 'all' | StagedItemType;

const filterTabs: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'plant', label: 'Plants' },
  { value: 'condition', label: 'Conditions' },
  { value: 'remedy', label: 'Remedies' },
];

export function StagingReviewClient({ initialItems }: StagingReviewClientProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<StagedItemDetail | null>(null);
  const [isPending, startTransition] = useTransition();

  // Filter items by type
  const filteredItems = useMemo(() => {
    if (filter === 'all') {
      return initialItems;
    }
    return initialItems.filter(item => item.type === filter);
  }, [initialItems, filter]);

  // Handle item selection
  const handleItemSelect = (item: StagedItemSummary) => {
    if (selectedPath === item.filePath) {
      // Deselect if already selected
      setSelectedPath(null);
      setSelectedDetail(null);
      return;
    }

    setSelectedPath(item.filePath);
    startTransition(async () => {
      const detail = await fetchStagedItemDetail(item.filePath);
      setSelectedDetail(detail);
    });
  };

  // Count items by type for tab badges
  const typeCounts = useMemo(() => {
    const counts: Record<FilterType, number> = {
      all: initialItems.length,
      plant: 0,
      condition: 0,
      remedy: 0,
    };
    for (const item of initialItems) {
      counts[item.type]++;
    }
    return counts;
  }, [initialItems]);

  if (initialItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-gray-700 bg-gray-900 py-16">
        <svg
          className="h-16 w-16 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-4 text-xl text-gray-100">No Staged Data</h3>
        <p className="mt-2 text-center text-gray-300">
          Use the <code className="rounded bg-gray-800 px-2 py-0.5 font-mono text-sm">/gather</code> command
          <br />
          to collect research data for review.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filterTabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={cn(
              'flex items-center gap-2 whitespace-nowrap rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
              filter === tab.value
                ? 'border-accent-500 bg-accent-500/15 text-accent-400'
                : 'border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-600 hover:text-gray-100'
            )}
          >
            {tab.label}
            <span
              className={cn(
                'rounded-md px-2 py-0.5 text-xs',
                filter === tab.value ? 'bg-accent-500/20 text-accent-400' : 'bg-gray-800 text-gray-400'
              )}
            >
              {typeCounts[tab.value]}
            </span>
          </button>
        ))}
      </div>

      {/* Main Layout - List + Detail */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Item Cards - Scrollable List */}
        <div className="space-y-4">
          <div className="text-sm text-gray-400">
            {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} staged
          </div>
          <div className="max-h-[calc(100vh-320px)] space-y-3 overflow-y-auto pr-2">
            {filteredItems.map(item => (
              <StagedItemCard
                key={item.filePath}
                item={item}
                isSelected={selectedPath === item.filePath}
                onClick={() => handleItemSelect(item)}
              />
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-200px)]">
          {selectedDetail ? (
            <StagedItemDetailView item={selectedDetail} />
          ) : isPending ? (
            <div className="flex h-64 items-center justify-center rounded-xl border border-gray-700 bg-gray-900">
              <div className="flex items-center gap-3 text-gray-400">
                <svg
                  className="h-5 w-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Loading details...
              </div>
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-gray-700 bg-gray-900/50">
              <svg
                className="h-12 w-12 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <p className="mt-4 text-gray-400">Select an item to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
