'use client';

import { useState, useMemo, useCallback } from 'react';
import type { DukePlantSummary } from '@/types/gather-queue';

interface DukePlantBrowserProps {
  plants: DukePlantSummary[];
  queuedSlugs: Set<string>;
  onAdd: (slug: string, latinName: string) => void;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const MAX_RESULTS = 50;

export function DukePlantBrowser({ plants, queuedSlugs, onAdd }: DukePlantBrowserProps) {
  const [search, setSearch] = useState('');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [debounced, setDebounced] = useState('');

  // Debounce search input
  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setActiveLetter(null);

    // Simple debounce using setTimeout
    const timer = setTimeout(() => {
      setDebounced(value);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Filter plants by search query or letter
  const { results, totalMatches } = useMemo(() => {
    let filtered: DukePlantSummary[];

    if (debounced) {
      const query = debounced.toLowerCase();
      filtered = plants.filter(p =>
        p.latinName.toLowerCase().includes(query) ||
        p.commonNames?.some(cn => cn.toLowerCase().includes(query)) ||
        p.family.toLowerCase().includes(query) ||
        p.slug.includes(query)
      );
    } else if (activeLetter) {
      filtered = plants.filter(p =>
        p.latinName.charAt(0).toUpperCase() === activeLetter
      );
    } else {
      filtered = [];
    }

    return {
      results: filtered.slice(0, MAX_RESULTS),
      totalMatches: filtered.length,
    };
  }, [plants, debounced, activeLetter]);

  const handleLetterClick = (letter: string) => {
    setSearch('');
    setDebounced('');
    setActiveLetter(letter === activeLetter ? null : letter);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-sage">
        Duke Phytochemical Reference
      </label>

      {/* Search input */}
      <input
        type="text"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search by Latin name, common name, or family..."
        className="w-full rounded-lg border border-moss bg-forest-900/50 px-3 py-2 text-sm text-cream placeholder-sage/50 outline-none transition-colors focus:border-amber"
      />

      {/* A-Z letter nav (shown when no search query) */}
      {!debounced && (
        <div className="flex flex-wrap gap-1">
          {ALPHABET.map(letter => (
            <button
              key={letter}
              onClick={() => handleLetterClick(letter)}
              className={
                activeLetter === letter
                  ? 'rounded px-2 py-1 text-xs font-medium border border-amber bg-amber/20 text-amber'
                  : 'rounded px-2 py-1 text-xs font-medium border border-moss/50 text-sage hover:border-sage hover:text-cream'
              }
            >
              {letter}
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      {(debounced || activeLetter) && (
        <p className="text-xs text-sage">
          {totalMatches === 0
            ? 'No matches found'
            : totalMatches <= MAX_RESULTS
              ? `${totalMatches} result${totalMatches !== 1 ? 's' : ''}`
              : `Showing ${MAX_RESULTS} of ${totalMatches} results`}
        </p>
      )}

      {/* Results list */}
      {results.length > 0 && (
        <div className="max-h-[400px] space-y-2 overflow-y-auto pr-1">
          {results.map(plant => {
            const isQueued = queuedSlugs.has(plant.slug);
            return (
              <div
                key={plant.slug}
                className="flex items-start justify-between gap-3 rounded-lg border border-moss/50 bg-forest-900/50 p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium italic text-cream">
                    {plant.latinName}
                  </p>
                  {plant.commonNames.length > 0 && (
                    <p className="mt-0.5 text-xs text-mist">
                      {plant.commonNames.join(', ')}
                    </p>
                  )}
                  <p className="mt-0.5 text-xs text-sage">
                    {plant.family} &middot; {plant.constituentCount} constituents
                  </p>
                </div>
                <button
                  onClick={() => onAdd(plant.slug, plant.latinName)}
                  disabled={isQueued}
                  className={
                    isQueued
                      ? 'flex-shrink-0 rounded-lg border border-moss/30 px-3 py-1 text-xs text-sage/50 cursor-not-allowed'
                      : 'flex-shrink-0 rounded-lg border border-moss bg-moss/30 px-3 py-1 text-xs font-medium text-cream transition-colors hover:border-amber hover:bg-amber/20 hover:text-amber'
                  }
                >
                  {isQueued ? 'Queued' : 'Add'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!debounced && !activeLetter && (
        <p className="py-4 text-center text-sm text-sage">
          Search or browse by letter to find plants in the Duke database
        </p>
      )}
    </div>
  );
}
