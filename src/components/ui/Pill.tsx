import { cn } from '@/lib/utils';

type PillVariant =
  | 'purple'
  | 'amber'
  | 'blue'
  | 'rose'
  | 'orange'
  | 'green'
  | 'preparation'
  | 'confidence-high'
  | 'confidence-medium'
  | 'confidence-low'
  | 'default';

interface PillProps {
  children: React.ReactNode;
  variant?: PillVariant;
  className?: string;
}

const variantStyles: Record<PillVariant, string> = {
  purple: 'bg-cat-purple/15 text-cat-purple border-cat-purple/30',
  amber: 'bg-cat-amber/15 text-cat-amber border-cat-amber/30',
  blue: 'bg-cat-blue/15 text-cat-blue border-cat-blue/30',
  rose: 'bg-cat-rose/15 text-cat-rose border-cat-rose/30',
  orange: 'bg-cat-orange/15 text-cat-orange border-cat-orange/30',
  green: 'bg-cat-green/15 text-cat-green border-cat-green/30',
  preparation: 'bg-accent-500/15 text-accent-400 border-accent-500/30',
  'confidence-high': 'bg-status-success/15 text-status-success border-status-success/30',
  'confidence-medium': 'bg-status-warning/15 text-status-warning border-status-warning/30',
  'confidence-low': 'bg-status-danger/15 text-status-danger border-status-danger/30',
  default: 'bg-gray-800/50 text-gray-300 border-gray-700',
};

export function Pill({ children, variant = 'default', className }: PillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// Helper to map body system to pill variant
export function getSystemVariant(system: string): PillVariant {
  const mapping: Record<string, PillVariant> = {
    nervous: 'purple',
    digestive: 'amber',
    immune: 'blue',
    respiratory: 'blue',
    skin: 'green',
    cardiovascular: 'orange',
    musculoskeletal: 'orange',
    endocrine: 'green',
    reproductive: 'rose',
    urinary: 'blue',
  };
  return mapping[system] || 'default';
}

// Helper to map confidence level to pill variant
export function getConfidenceVariant(confidence: 'high' | 'medium' | 'low'): PillVariant {
  return `confidence-${confidence}` as PillVariant;
}
