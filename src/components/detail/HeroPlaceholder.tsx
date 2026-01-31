import Link from 'next/link';
import { cn } from '@/lib/utils';

interface HeroPlaceholderProps {
  variant: 'tea' | 'plant';
  name: string;
  subtitle?: string;
  pills?: React.ReactNode;
  meta?: string;
  className?: string;
}

function TeaCupSVG() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="h-48 w-48 md:h-64 md:w-64"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Cup body */}
      <path d="M50 80 Q50 140 70 155 Q85 165 100 165 Q115 165 130 155 Q150 140 150 80" className="text-gray-700" />
      {/* Cup rim */}
      <ellipse cx="100" cy="80" rx="50" ry="12" className="text-gray-700" />
      {/* Handle */}
      <path d="M150 95 Q175 95 175 115 Q175 135 150 135" className="text-gray-700" />
      {/* Steam lines */}
      <path d="M80 65 Q78 50 82 35" className="text-gray-700/60" />
      <path d="M100 60 Q98 42 102 25" className="text-gray-700/60" />
      <path d="M120 65 Q118 50 122 35" className="text-gray-700/60" />
      {/* Saucer */}
      <ellipse cx="100" cy="170" rx="60" ry="10" className="text-gray-700" />
    </svg>
  );
}

function BotanicalLeafSVG() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="h-48 w-48 md:h-64 md:w-64"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Main stem */}
      <path d="M100 180 Q100 100 95 40" className="text-gray-700" />
      {/* Main leaf shape */}
      <path d="M95 40 Q60 50 50 80 Q45 110 70 130 Q85 140 100 135 Q115 140 130 130 Q155 110 150 80 Q140 50 95 40" className="text-gray-700" />
      {/* Center vein */}
      <path d="M95 45 Q97 90 100 130" className="text-gray-700/60" />
      {/* Side veins */}
      <path d="M97 60 Q75 65 60 80" className="text-gray-700/40" />
      <path d="M97 60 Q120 65 140 80" className="text-gray-700/40" />
      <path d="M98 80 Q78 90 65 105" className="text-gray-700/40" />
      <path d="M98 80 Q118 90 135 105" className="text-gray-700/40" />
      <path d="M99 100 Q82 110 75 125" className="text-gray-700/40" />
      <path d="M99 100 Q116 110 125 125" className="text-gray-700/40" />
      {/* Small leaves on stem */}
      <path d="M100 155 Q85 150 80 160 Q85 165 100 155" className="text-gray-700/40" />
      <path d="M100 165 Q115 160 120 170 Q115 175 100 165" className="text-gray-700/40" />
    </svg>
  );
}

export function HeroPlaceholder({
  variant,
  name,
  subtitle,
  pills,
  meta,
  className,
}: HeroPlaceholderProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/95 to-gray-950" />
      <div className="absolute inset-0 bg-gradient-to-r from-accent-900/20 via-transparent to-accent-900/10" />

      <div className="relative mx-auto max-w-5xl px-6 pb-12 pt-8">
        {/* Back link */}
        <Link
          href="/browse"
          className="mb-8 inline-flex items-center gap-2 text-gray-400 transition-colors hover:text-accent-400"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Browse
        </Link>

        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          {/* Text content */}
          <div className="flex-1">
            {pills && <div className="mb-4 flex flex-wrap items-center gap-2">{pills}</div>}
            <h1 className="text-4xl font-bold text-gray-50 md:text-5xl">{name}</h1>
            {subtitle && (
              <p className="mt-2 font-serif text-lg italic text-gray-400">{subtitle}</p>
            )}
            {meta && (
              <p className="mt-2 text-sm text-gray-400">{meta}</p>
            )}
          </div>

          {/* SVG art placeholder */}
          <div className="flex-shrink-0 opacity-40">
            {variant === 'tea' ? <TeaCupSVG /> : <BotanicalLeafSVG />}
          </div>
        </div>
      </div>
    </div>
  );
}
