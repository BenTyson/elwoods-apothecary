'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { StatusBadge } from './StatusBadge';
import type { GatherQueueItemWithStatus } from '@/types/gather-queue';

interface GatherQueueCardProps {
  item: GatherQueueItemWithStatus;
  onRemove?: (id: string, type: string) => void;
}

export function GatherQueueCard({ item, onRemove }: GatherQueueCardProps) {
  const [copied, setCopied] = useState(false);

  const gatherCommand = `/gather ${item.type} ${item.name}`;

  const handleCopyCommand = async () => {
    try {
      await navigator.clipboard.writeText(gatherCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy command:', err);
    }
  };

  return (
    <div
      onClick={handleCopyCommand}
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded-xl border border-moss bg-deep-forest/80 p-4 transition-all duration-300',
        'hover:border-sage hover:shadow-lg hover:shadow-black/20',
        copied && 'border-fern bg-fern/10'
      )}
    >
      {/* Top accent bar on hover */}
      <div className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-amber to-gold transition-transform duration-300 group-hover:scale-x-100" />

      {/* Copied indicator */}
      {copied && (
        <div className="absolute inset-x-0 top-0 flex items-center justify-center bg-fern/90 py-1.5 text-xs font-medium text-cream">
          <svg className="mr-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Copied: <code className="ml-1 font-mono">{gatherCommand}</code>
        </div>
      )}

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

          {/* Command hint on hover */}
          <p className="mt-2 max-h-0 overflow-hidden text-xs font-mono text-sage opacity-0 transition-all duration-200 group-hover:max-h-6 group-hover:opacity-100">
            {gatherCommand}
          </p>
        </div>

        {/* Remove button (only for queued items) */}
        {item.status === 'queued' && onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(item.id, item.type);
            }}
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
