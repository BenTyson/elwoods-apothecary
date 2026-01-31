import { cn } from '@/lib/utils';

interface DataCardProps {
  label: string;
  value: string;
  mono?: boolean;
  className?: string;
}

export function DataCard({ label, value, mono, className }: DataCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-gray-700/50 bg-gray-900/50 p-4',
        className
      )}
    >
      <span className="block text-[11px] font-medium uppercase tracking-wider text-gray-500">
        {label}
      </span>
      <span
        className={cn(
          'mt-1.5 block text-sm text-gray-200',
          mono && 'font-mono'
        )}
      >
        {value}
      </span>
    </div>
  );
}
