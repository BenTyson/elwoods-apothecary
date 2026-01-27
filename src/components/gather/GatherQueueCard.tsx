'use client';

import { cn } from '@/lib/utils';
import { StatusBadge } from './StatusBadge';
import type { GatherQueueItemWithStatus } from '@/types/gather-queue';

interface GatherQueueCardProps {
  item: GatherQueueItemWithStatus;
  onRemove?: (id: string, type: string) => void;
}

export function GatherQueueCard({ item, onRemove }: GatherQueueCardProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border border-moss bg-deep-forest/80 p-4 transition-all duration-300',
        'hover:border-sage hover:shadow-lg hover:shadow-black/20'
      )}
    >
      {/* Top accent bar on hover */}
      <div className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-amber to-gold transition-transform duration-300 group-hover:scale-x-100" />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {/* Name */}
          <h3 className="font-display text-lg font-semibold text-cream">
            {item.name}
          </h3>

          {/* Metadata row */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={item.status} />
            <span className="text-xs text-mist">
              {item.addedAt}
            </span>
          </div>

          {/* Duke reference */}
          {item.dukeRef && (
            <p className="mt-2 text-xs italic text-sage">
              Duke ref: {item.dukeRef}
            </p>
          )}

          {/* Notes */}
          {item.notes && (
            <p className="mt-2 line-clamp-2 text-sm text-mist">
              {item.notes}
            </p>
          )}
        </div>

        {/* Remove button (only for queued items) */}
        {item.status === 'queued' && onRemove && (
          <button
            onClick={() => onRemove(item.id, item.type)}
            className="flex-shrink-0 rounded-lg border border-moss/50 px-2 py-1 text-xs text-sage transition-colors hover:border-womens hover:bg-womens/10 hover:text-womens"
            title="Remove from queue"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
