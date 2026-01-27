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
        'group relative w-full overflow-hidden rounded-xl border border-moss bg-deep-forest/80 p-4 text-left transition-all duration-300',
        'hover:-translate-y-1 hover:border-amber hover:shadow-lg hover:shadow-black/20',
        isSelected && 'border-amber bg-amber/10'
      )}
    >
      {/* Top accent bar on hover */}
      <div className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-amber to-gold transition-transform duration-300 group-hover:scale-x-100" />

      {/* Type badge */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-sage">
          {typeLabels[item.type]}
        </span>
        <span className="text-xs text-mist">
          {item.meta.gatheredAt}
        </span>
      </div>

      {/* Name */}
      <h3 className="mt-2 font-display text-xl font-semibold text-cream transition-colors group-hover:text-gold">
        {item.name}
      </h3>

      {/* Confidence and update badge */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Pill variant={getConfidenceVariant(item.meta.confidence)}>
          {item.meta.confidence}
        </Pill>
        {item.meta.isUpdate && (
          <Pill variant="preparation">Update</Pill>
        )}
      </div>

      {/* Notes preview */}
      {item.meta.notes && (
        <p className="mt-3 line-clamp-2 text-sm text-mist">
          {item.meta.notes}
        </p>
      )}

      {/* Sources count */}
      <div className="mt-3 text-xs text-sage">
        {item.meta.sources.length} source{item.meta.sources.length !== 1 ? 's' : ''}
      </div>
    </button>
  );
}
