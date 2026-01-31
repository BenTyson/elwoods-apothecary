import Link from 'next/link';
import { Plant } from '@/types';
import { Pill, getSystemVariant } from '@/components/ui/Pill';
import { formatLabel } from '@/lib/data';
import { cn } from '@/lib/utils';

interface HerbCardProps {
  plant: Plant;
  featured?: boolean;
  className?: string;
}

export function HerbCard({ plant, featured, className }: HerbCardProps) {
  return (
    <Link href={`/browse/${plant.id}`}>
      <article
        className={cn(
          'group relative overflow-hidden rounded-xl border border-gray-700 bg-gray-900 p-6 transition-colors duration-150',
          'hover:border-gray-600 hover:bg-gray-800',
          featured && 'border-accent-500/30 bg-accent-900/20',
          className
        )}
      >
        {/* Latin name */}
        <p className="font-serif text-sm italic text-gray-400">
          {plant.latinName}
        </p>

        {/* Common name */}
        <h3 className="mt-1 text-2xl font-semibold text-gray-100 transition-colors group-hover:text-accent-400">
          {plant.commonName}
        </h3>

        {/* Body system pills */}
        <div className="mt-3 flex flex-wrap gap-1">
          {plant.bodySystems.slice(0, 3).map((system) => (
            <Pill key={system} variant={getSystemVariant(system)}>
              {formatLabel(system)}
            </Pill>
          ))}
        </div>

        {/* Overview excerpt */}
        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-gray-300">
          {plant.content.overview}
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
