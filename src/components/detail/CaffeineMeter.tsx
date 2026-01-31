import { cn } from '@/lib/utils';

interface CaffeineMeterProps {
  level: 'none' | 'very-low' | 'low' | 'moderate' | 'high' | 'very-high';
  className?: string;
}

const levelToSegments: Record<string, number> = {
  'none': 0,
  'very-low': 1,
  'low': 2,
  'moderate': 3,
  'high': 4,
  'very-high': 5,
};

const levelLabels: Record<string, string> = {
  'none': 'Caffeine Free',
  'very-low': 'Very Low',
  'low': 'Low',
  'moderate': 'Moderate',
  'high': 'High',
  'very-high': 'Very High',
};

export function CaffeineMeter({ level, className }: CaffeineMeterProps) {
  const filled = levelToSegments[level] ?? 0;
  const totalSegments = 6;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
          Caffeine Level
        </span>
        <span className="text-sm font-medium text-gray-200">
          {levelLabels[level] || level}
        </span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: totalSegments }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-2.5 flex-1 rounded-sm transition-colors',
              i < filled ? 'bg-accent-500' : 'bg-gray-800'
            )}
          />
        ))}
      </div>
    </div>
  );
}
