import { cn } from '@/lib/utils';

interface OxidationMeterProps {
  level: string;
  className?: string;
}

function parseOxidationPercent(level: string): number {
  // Handle ranges like "60-80%", single values like "15%", or text like "Minimal (0-5%)"
  const match = level.match(/(\d+)\s*[-–]\s*(\d+)|(\d+)\s*%/);
  if (match) {
    if (match[1] && match[2]) {
      return (parseInt(match[1]) + parseInt(match[2])) / 2;
    }
    if (match[3]) {
      return parseInt(match[3]);
    }
  }
  // Fallback based on common text descriptions
  const lower = level.toLowerCase();
  if (lower.includes('minimal') || lower.includes('none')) return 5;
  if (lower.includes('light') || lower.includes('partial')) return 30;
  if (lower.includes('full') || lower.includes('complete')) return 100;
  return 50;
}

export function OxidationMeter({ level, className }: OxidationMeterProps) {
  const percent = parseOxidationPercent(level);

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
          Oxidation Level
        </span>
        <span className="font-mono text-sm text-gray-300">{level}</span>
      </div>
      <div className="relative h-2.5 overflow-hidden rounded-full bg-gray-800">
        {/* Gradient track */}
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${percent}%`,
            background: `linear-gradient(to right, var(--accent-500), var(--cat-amber))`,
          }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-gray-600">
        <span>Unoxidized</span>
        <span>Fully oxidized</span>
      </div>
    </div>
  );
}
