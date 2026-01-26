import { cn } from '@/lib/utils';

type CalloutVariant = 'warning' | 'danger' | 'info';

interface CalloutProps {
  variant: CalloutVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<
  CalloutVariant,
  { container: string; icon: string }
> = {
  warning: {
    container: 'bg-amber/15 border-amber border-l-4',
    icon: 'text-amber',
  },
  danger: {
    container: 'bg-womens/15 border-womens border-l-4',
    icon: 'text-womens',
  },
  info: {
    container: 'bg-respiratory/15 border-respiratory border-l-4',
    icon: 'text-respiratory',
  },
};

const icons: Record<CalloutVariant, React.ReactNode> = {
  warning: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2L1 21h22L12 2zm0 4l7.5 13h-15L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z" />
    </svg>
  ),
  danger: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 5h2v6h-2V7zm0 8h2v2h-2v-2z" />
    </svg>
  ),
  info: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  ),
};

export function Callout({
  variant,
  title,
  children,
  className,
}: CalloutProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        'relative rounded-lg border p-4 pl-12',
        styles.container,
        className
      )}
    >
      <span className={cn('absolute left-4 top-4', styles.icon)}>
        {icons[variant]}
      </span>
      {title && (
        <h4 className="mb-2 font-display text-base font-semibold">{title}</h4>
      )}
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}
