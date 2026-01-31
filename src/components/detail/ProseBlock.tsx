import { splitIntoParagraphs, extractPullQuote } from '@/lib/content-utils';
import { cn } from '@/lib/utils';

interface ProseBlockProps {
  text: string;
  lead?: boolean;
  showPullQuote?: boolean;
  className?: string;
}

export function ProseBlock({ text, lead, showPullQuote, className }: ProseBlockProps) {
  const paragraphs = splitIntoParagraphs(text);
  const pullQuote = showPullQuote ? extractPullQuote(text) : null;

  return (
    <div className={cn('space-y-4', className)}>
      {paragraphs.map((paragraph, i) => (
        <div key={i}>
          <p
            className={cn(
              'leading-relaxed text-gray-300',
              i === 0 && lead && 'text-lg text-gray-200'
            )}
          >
            {paragraph}
          </p>
          {/* Insert pull quote after first paragraph */}
          {i === 0 && pullQuote && (
            <blockquote className="my-8 border-l-2 border-accent-500/40 pl-6">
              <p className="font-serif text-xl italic leading-relaxed text-gray-200">
                {pullQuote}
              </p>
            </blockquote>
          )}
        </div>
      ))}
    </div>
  );
}
