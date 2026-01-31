import Link from 'next/link';
import { Tea } from '@/types';
import { Pill } from '@/components/ui/Pill';
import { cn } from '@/lib/utils';
import { formatLabel } from '@/lib/data';

interface TeaCardProps {
  tea: Tea;
  className?: string;
}

function getTeaTypeVariant(teaType: string) {
  const mapping: Record<string, 'green' | 'amber' | 'purple' | 'rose' | 'orange' | 'blue' | 'default'> = {
    green: 'green',
    white: 'rose',
    oolong: 'amber',
    black: 'orange',
    dark: 'purple',
    blend: 'blue',
    yellow: 'amber',
  };
  return mapping[teaType] || 'default';
}

function getCaffeineLabel(level: string) {
  const labels: Record<string, string> = {
    'none': 'Caffeine Free',
    'very-low': 'Very Low Caffeine',
    'low': 'Low Caffeine',
    'moderate': 'Moderate Caffeine',
    'high': 'High Caffeine',
    'very-high': 'Very High Caffeine',
  };
  return labels[level] || level;
}

export function TeaCard({ tea, className }: TeaCardProps) {
  return (
    <Link href={`/browse/tea/${tea.id}`}>
      <article
        className={cn(
          'group relative overflow-hidden rounded-xl border border-gray-700 bg-gray-900 p-6 transition-colors duration-150',
          'hover:border-gray-600 hover:bg-gray-800',
          className
        )}
      >
        {/* Tea type + origin */}
        <div className="flex items-center gap-2">
          <Pill variant={getTeaTypeVariant(tea.teaType)}>
            {formatLabel(tea.teaType)}
          </Pill>
          <span className="text-sm text-gray-400">
            {tea.origin.country}
          </span>
        </div>

        {/* Tea name */}
        <h3 className="mt-2 text-2xl font-semibold text-gray-100 transition-colors group-hover:text-accent-400">
          {tea.name}
        </h3>

        {/* Caffeine level */}
        <div className="mt-3">
          <Pill variant="default">
            {getCaffeineLabel(tea.caffeine.level)}
          </Pill>
        </div>

        {/* Overview excerpt */}
        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-gray-300">
          {tea.content.overview}
        </p>

        {/* Learn more indicator */}
        <div className="mt-4 flex items-center gap-1 text-sm font-medium text-accent-400 opacity-0 transition-opacity group-hover:opacity-100">
          <span>Learn more</span>
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </article>
    </Link>
  );
}
