import { cn } from '@/lib/utils';

interface ImageGalleryPlaceholderProps {
  labels: string[];
  className?: string;
}

export function ImageGalleryPlaceholder({ labels, className }: ImageGalleryPlaceholderProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-3 sm:grid-cols-4', className)}>
      {labels.map((label) => (
        <div
          key={label}
          className="flex aspect-square flex-col items-center justify-center rounded-xl border border-dashed border-gray-700/50 bg-gray-900/30"
        >
          <svg
            className="mb-2 h-8 w-8 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1}
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <span className="px-2 text-center text-[11px] font-medium uppercase tracking-wider text-gray-600">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
