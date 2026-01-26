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
          'group relative overflow-hidden rounded-xl border border-moss bg-deep-forest/80 p-6 transition-all duration-300',
          'hover:-translate-y-1 hover:border-amber hover:shadow-lg hover:shadow-black/20',
          featured &&
            'border-amber bg-gradient-to-br from-amber/10 to-deep-forest/90',
          className
        )}
      >
        {/* Top accent bar on hover */}
        <div className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-amber to-gold transition-transform duration-300 group-hover:scale-x-100" />

        {/* Latin name */}
        <p className="font-display text-sm italic text-sage">
          {plant.latinName}
        </p>

        {/* Common name */}
        <h3 className="mt-1 font-display text-2xl font-semibold text-cream transition-colors group-hover:text-gold">
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
        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-mist">
          {plant.content.overview}
        </p>

        {/* Learn more indicator */}
        <div className="mt-4 flex items-center gap-1 text-sm font-medium text-gold opacity-0 transition-opacity group-hover:opacity-100">
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
