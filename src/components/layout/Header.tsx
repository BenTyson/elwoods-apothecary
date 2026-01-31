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
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-3">
          <span className="text-base font-semibold tracking-wide text-gray-100 transition-colors group-hover:text-accent-400">
            El Woods Apothecary
          </span>
        </Link>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                      isActive
                        ? 'bg-gray-800 text-gray-100'
                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
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
        <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 md:hidden">
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
