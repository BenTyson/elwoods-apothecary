import { cn } from '@/lib/utils';

interface QuickInfoItem {
  label: string;
  value: string;
  subValue?: string;
}

interface QuickInfoBarProps {
  items: QuickInfoItem[];
  className?: string;
}

export function QuickInfoBar({ items, className }: QuickInfoBarProps) {
  return (
    <div
      className={cn(
        'mx-auto max-w-5xl px-6',
        className
      )}
    >
      <div className={cn(
        'grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-gray-700/50 bg-gray-700/50',
        items.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-4'
      )}>
        {items.map((item) => (
          <div key={item.label} className="bg-gray-900/80 px-4 py-4 text-center">
            <span className="block text-[11px] font-medium uppercase tracking-wider text-gray-500">
              {item.label}
            </span>
            <span className="mt-1 block text-sm font-medium text-gray-100">
              {item.value}
            </span>
            {item.subValue && (
              <span className="block text-[11px] text-gray-500">{item.subValue}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
