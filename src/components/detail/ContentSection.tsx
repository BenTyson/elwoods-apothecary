import { cn } from '@/lib/utils';

interface ContentSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ContentSection({ id, title, children, className }: ContentSectionProps) {
  return (
    <section id={id} className={cn('scroll-mt-24', className)}>
      <h2 className="mb-6 text-2xl font-semibold text-gray-100 md:text-3xl">
        {title}
      </h2>
      {children}
    </section>
  );
}
