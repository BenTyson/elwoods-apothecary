import { cn } from '@/lib/utils';

interface ProcessingTimelineProps {
  steps: string[];
  className?: string;
}

export function ProcessingTimeline({ steps, className }: ProcessingTimelineProps) {
  return (
    <div className={cn('relative', className)}>
      {/* Gradient line */}
      <div
        className="absolute bottom-4 left-[11px] top-4 w-px"
        style={{
          background: 'linear-gradient(to bottom, var(--accent-500), var(--cat-amber), var(--gray-700))',
        }}
      />

      <ol className="relative space-y-4">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-4 pl-0">
            {/* Dot */}
            <div className="relative z-10 flex h-6 w-6 flex-shrink-0 items-center justify-center">
              <div
                className={cn(
                  'h-2.5 w-2.5 rounded-full',
                  i === 0
                    ? 'bg-accent-400'
                    : i === steps.length - 1
                      ? 'bg-gray-500'
                      : 'bg-accent-500/60'
                )}
              />
            </div>
            {/* Content */}
            <div className="rounded-lg border border-gray-700/50 bg-gray-900/50 px-4 py-2.5 text-sm text-gray-300">
              <span className="mr-2 font-mono text-[11px] text-gray-500">
                {String(i + 1).padStart(2, '0')}
              </span>
              {step}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
