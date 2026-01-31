'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface TOCItem {
  id: string;
  label: string;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first section that is intersecting
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0,
      }
    );

    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [items]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="hidden lg:block">
      <div className="sticky top-24 space-y-1">
        <span className="mb-3 block text-[11px] font-medium uppercase tracking-wider text-gray-500">
          On this page
        </span>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={cn(
              'block w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors',
              activeId === item.id
                ? 'bg-accent-900/40 text-accent-400'
                : 'text-gray-500 hover:text-gray-300'
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
