import { Pill } from '@/components/ui/Pill';
import type { GatherItemStatus } from '@/types/gather-queue';

interface StatusBadgeProps {
  status: GatherItemStatus;
}

const statusConfig: Record<GatherItemStatus, { label: string; className: string }> = {
  queued: {
    label: 'Queued',
    className: 'bg-moss/30 text-fern border-moss',
  },
  staged: {
    label: 'Staged',
    className: 'bg-amber/30 text-amber border-amber',
  },
  merged: {
    label: 'Merged',
    className: 'bg-fern/30 text-fern border-fern',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Pill className={config.className}>
      {config.label}
    </Pill>
  );
}
