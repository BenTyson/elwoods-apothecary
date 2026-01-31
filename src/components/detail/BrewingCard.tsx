import { cn } from '@/lib/utils';
import type { BrewingParameters } from '@/types';

interface BrewingCardProps {
  brewing: BrewingParameters;
  className?: string;
}

function ThermometerIcon() {
  return (
    <svg className="h-5 w-5 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9V3m0 0L9.5 5.5M12 3l2.5 2.5M12 9a4 4 0 100 8 4 4 0 000-8z" />
      <circle cx="12" cy="15" r="2" fill="currentColor" />
    </svg>
  );
}

function TimerIcon() {
  return (
    <svg className="h-5 w-5 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <circle cx="12" cy="13" r="8" />
      <path strokeLinecap="round" d="M12 9v4l2.5 2.5M10 2h4" />
    </svg>
  );
}

function ScaleIcon() {
  return (
    <svg className="h-5 w-5 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12l4-4v8l-4-4zm14 0l4-4v8l-4-4z" />
    </svg>
  );
}

function ResteepIcon() {
  return (
    <svg className="h-5 w-5 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.49 9A9 9 0 005.64 5.64L4 4m16 16l-1.64-1.64A9 9 0 013.51 15" />
    </svg>
  );
}

function BrewingParams({ params, title }: { params: BrewingParameters; title?: string }) {
  return (
    <div className="rounded-xl border border-gray-700/50 bg-gray-900/50 p-5">
      {title && (
        <h4 className="mb-4 text-[11px] font-medium uppercase tracking-wider text-gray-500">
          {title}
        </h4>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-start gap-3">
          <ThermometerIcon />
          <div>
            <span className="block text-[11px] font-medium uppercase tracking-wider text-gray-500">Temperature</span>
            <span className="mt-0.5 block font-mono text-sm text-gray-100">{params.waterTemp}</span>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <TimerIcon />
          <div>
            <span className="block text-[11px] font-medium uppercase tracking-wider text-gray-500">Steep Time</span>
            <span className="mt-0.5 block font-mono text-sm text-gray-100">{params.steepTime}</span>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <ScaleIcon />
          <div>
            <span className="block text-[11px] font-medium uppercase tracking-wider text-gray-500">Leaf Ratio</span>
            <span className="mt-0.5 block font-mono text-sm text-gray-100">{params.leafRatio}</span>
          </div>
        </div>
        {params.resteeps !== undefined && (
          <div className="flex items-start gap-3">
            <ResteepIcon />
            <div>
              <span className="block text-[11px] font-medium uppercase tracking-wider text-gray-500">Re-steeps</span>
              <span className="mt-0.5 block font-mono text-sm text-gray-100">
                {params.resteeps === 0 ? 'Not recommended' : `Up to ${params.resteeps}`}
              </span>
            </div>
          </div>
        )}
      </div>
      {params.notes && (
        <p className="mt-4 border-t border-gray-700/30 pt-3 text-sm text-gray-400">
          {params.notes}
        </p>
      )}
    </div>
  );
}

export function BrewingCard({ brewing, className }: BrewingCardProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <BrewingParams params={brewing} title="Western Style" />
      {brewing.gongfuStyle && (
        <BrewingParams params={brewing.gongfuStyle} title="Gongfu Style" />
      )}
    </div>
  );
}
