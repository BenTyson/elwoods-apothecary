import { Pill } from '@/components/ui/Pill';
import type { GatherItemStatus } from '@/types/gather-queue';

interface StatusBadgeProps {
  status: GatherItemStatus;
}

const statusConfig: Record<GatherItemStatus, { label: string; className: string }> = {
  queued: {
    label: 'Queued',
    className: 'bg-gray-800/50 text-gray-300 border-gray-700',
  },
  staged: {
    label: 'Staged',
    className: 'bg-status-warning/15 text-status-warning border-status-warning/30',
  },
  merged: {
    label: 'Merged',
    className: 'bg-status-success/15 text-status-success border-status-success/30',
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
