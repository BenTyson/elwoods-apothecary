'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { TOCItem } from './TableOfContents';

interface MobileTOCProps {
  items: TOCItem[];
}

export function MobileTOC({ items }: MobileTOCProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
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

  const activeLabel = items.find((item) => item.id === activeId)?.label || items[0]?.label || '';

  const handleClick = (id: string) => {
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 lg:hidden">
      {/* Expanded menu */}
      {isOpen && (
        <div className="mb-2 w-64 overflow-hidden rounded-xl border border-gray-700 bg-gray-900/95 shadow-2xl backdrop-blur-sm">
          <div className="max-h-72 overflow-y-auto p-2">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                className={cn(
                  'block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
                  activeId === item.id
                    ? 'bg-accent-900/40 text-accent-400'
                    : 'text-gray-400 hover:text-gray-200'
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pill button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-gray-700 bg-gray-900/95 px-4 py-2.5 shadow-2xl backdrop-blur-sm transition-colors hover:border-gray-600"
      >
        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span className="max-w-[160px] truncate text-sm text-gray-300">
          {activeLabel}
        </span>
        <svg
          className={cn(
            'h-3 w-3 text-gray-500 transition-transform',
            isOpen && 'rotate-180'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
}
