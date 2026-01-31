'use client';

import { StagedItemSummary } from '@/types/staging';
import { Pill, getConfidenceVariant } from '@/components/ui/Pill';
import { cn } from '@/lib/utils';

interface StagedItemCardProps {
  item: StagedItemSummary;
  isSelected?: boolean;
  onClick?: () => void;
}

const typeLabels: Record<string, string> = {
  plant: 'Plant',
  condition: 'Condition',
  remedy: 'Remedy',
};

export function StagedItemCard({ item, isSelected, onClick }: StagedItemCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative w-full overflow-hidden rounded-xl border border-gray-700 bg-gray-900 p-4 text-left transition-colors duration-150',
        'hover:border-gray-600 hover:bg-gray-800',
        isSelected && 'border-accent-500 bg-accent-900/20'
      )}
    >
      {/* Type badge */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400">
          {typeLabels[item.type]}
        </span>
        <span className="text-xs text-gray-500">
          {item.meta.gatheredAt}
        </span>
      </div>

      {/* Name */}
      <h3 className="mt-2 text-xl font-semibold text-gray-100 transition-colors group-hover:text-accent-400">
        {item.name}
      </h3>

      {/* Confidence and update badge */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Pill variant={getConfidenceVariant(item.meta.confidence)}>
          {item.meta.confidence}
        </Pill>
        {item.meta.isUpdate && (
          <Pill variant="blue">Update</Pill>
        )}
      </div>

      {/* Notes preview */}
      {item.meta.notes && (
        <p className="mt-3 line-clamp-2 text-sm text-gray-300">
          {item.meta.notes}
        </p>
      )}

      {/* Sources count */}
      <div className="mt-3 text-xs text-gray-400">
        {item.meta.sources.length} source{item.meta.sources.length !== 1 ? 's' : ''}
      </div>
    </button>
  );
}
