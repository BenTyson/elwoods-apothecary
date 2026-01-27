import { cn } from '@/lib/utils';

type PillVariant =
  | 'calming'
  | 'digestive'
  | 'immune'
  | 'respiratory'
  | 'skin'
  | 'adaptogen'
  | 'womens'
  | 'anti-inflammatory'
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
  calming: 'bg-calming/20 text-calming-light border-calming',
  digestive: 'bg-digestive/20 text-digestive border-digestive-dark',
  immune: 'bg-immune/30 text-immune-light border-immune',
  respiratory: 'bg-respiratory/20 text-respiratory-light border-respiratory',
  skin: 'bg-skin/20 text-skin border-skin-dark',
  adaptogen: 'bg-adaptogen/20 text-earth border-adaptogen',
  womens: 'bg-womens/20 text-womens border-womens',
  'anti-inflammatory':
    'bg-anti-inflammatory/20 text-anti-inflammatory border-anti-inflammatory',
  preparation: 'bg-moss/30 text-fern border-moss',
  'confidence-high': 'bg-fern/30 text-fern border-fern',
  'confidence-medium': 'bg-amber/30 text-amber border-amber',
  'confidence-low': 'bg-womens/30 text-womens border-womens',
  default: 'bg-forest-800/50 text-mist border-moss',
};

export function Pill({ children, variant = 'default', className }: PillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium uppercase tracking-wider',
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
    nervous: 'calming',
    digestive: 'digestive',
    immune: 'immune',
    respiratory: 'respiratory',
    skin: 'skin',
    cardiovascular: 'anti-inflammatory',
    musculoskeletal: 'anti-inflammatory',
    endocrine: 'adaptogen',
    reproductive: 'womens',
    urinary: 'respiratory',
  };
  return mapping[system] || 'default';
}

// Helper to map confidence level to pill variant
export function getConfidenceVariant(confidence: 'high' | 'medium' | 'low'): PillVariant {
  return `confidence-${confidence}` as PillVariant;
}
