'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Browse', href: '/browse' },
  { name: 'Learn', href: '/learn' },
  { name: 'Tools', href: '/tools' },
  { name: 'Shop', href: '/shop' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-moss bg-deep-forest/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-3">
          <span className="font-display text-xl font-semibold tracking-wide text-cream transition-colors group-hover:text-gold">
            El Woods Apothecary
          </span>
        </Link>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-8">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`font-display text-lg tracking-wide transition-colors ${
                      isActive
                        ? 'border-b-2 border-gold pb-1 text-gold'
                        : 'text-mist hover:text-gold'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile menu button */}
        <button className="rounded-lg p-2 text-mist hover:bg-moss/30 hover:text-cream md:hidden">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
