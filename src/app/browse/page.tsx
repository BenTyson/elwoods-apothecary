'use client';

import { useState, useMemo } from 'react';
import { HerbCard } from '@/components/herbs/HerbCard';
import { Button } from '@/components/ui/Button';
import {
  getAllPlants,
  getBodySystems,
  getPreparationTypes,
  getActions,
  formatLabel,
} from '@/lib/data';
import { FilterState, BodySystem, PreparationType } from '@/types';

export default function BrowsePage() {
  const plants = getAllPlants();
  const bodySystems = getBodySystems();
  const preparations = getPreparationTypes();
  const actions = getActions();

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    bodySystems: [],
    preparations: [],
    conditions: [],
    actions: [],
  });

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter plants based on current filters
  const filteredPlants = useMemo(() => {
    let result = [...plants];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (plant) =>
          plant.commonName.toLowerCase().includes(searchLower) ||
          plant.latinName.toLowerCase().includes(searchLower) ||
          plant.otherNames?.some((name) =>
            name.toLowerCase().includes(searchLower)
          ) ||
          plant.actions.some((action) =>
            action.toLowerCase().includes(searchLower)
          )
      );
    }

    // Body systems filter
    if (filters.bodySystems.length > 0) {
      result = result.filter((plant) =>
        filters.bodySystems.some((system) =>
          plant.bodySystems.includes(system as BodySystem)
        )
      );
    }

    // Preparations filter
    if (filters.preparations.length > 0) {
      result = result.filter((plant) =>
        filters.preparations.some((prep) =>
          plant.preparations.includes(prep as PreparationType)
        )
      );
    }

    // Actions filter
    if (filters.actions.length > 0) {
      result = result.filter((plant) =>
        filters.actions.some((action) => plant.actions.includes(action))
      );
    }

    return result;
  }, [plants, filters]);

  const toggleFilter = (
    type: 'bodySystems' | 'preparations' | 'actions',
    value: string
  ) => {
    setFilters((prev) => {
      const currentValues = prev[type] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return {
        ...prev,
        [type]: newValues,
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      bodySystems: [],
      preparations: [],
      conditions: [],
      actions: [],
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.bodySystems.length > 0 ||
    filters.preparations.length > 0 ||
    filters.actions.length > 0;

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-semibold text-cream">
            The Herbarium
          </h1>
          <p className="mt-2 font-remedy text-xl text-gold">
            Explore our collection of medicinal plants and herbs
          </p>
        </div>

        <div className="flex gap-8">
          {/* Filter Sidebar - Desktop */}
          <aside className="hidden w-72 flex-shrink-0 lg:block">
            <div className="sticky top-24 rounded-xl border border-moss bg-deep-forest/90 p-6">
              <h2 className="mb-6 border-b border-moss pb-2 font-display text-lg font-semibold text-gold">
                Filter Herbs
              </h2>

              {/* Body Systems */}
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-sage">
                  Body Systems
                </h3>
                <div className="space-y-2">
                  {bodySystems.map((system) => (
                    <label
                      key={system.id}
                      className="flex cursor-pointer items-center gap-2 text-sm text-mist transition-colors hover:text-cream"
                    >
                      <input
                        type="checkbox"
                        checked={filters.bodySystems.includes(system.id)}
                        onChange={() => toggleFilter('bodySystems', system.id)}
                        className="h-4 w-4 rounded border-moss bg-forest-900 text-gold accent-gold focus:ring-gold"
                      />
                      {system.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* Preparation Types */}
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-sage">
                  Preparation Type
                </h3>
                <div className="space-y-2">
                  {preparations.slice(0, 6).map((prep) => (
                    <label
                      key={prep.id}
                      className="flex cursor-pointer items-center gap-2 text-sm text-mist transition-colors hover:text-cream"
                    >
                      <input
                        type="checkbox"
                        checked={filters.preparations.includes(prep.id)}
                        onChange={() => toggleFilter('preparations', prep.id)}
                        className="h-4 w-4 rounded border-moss bg-forest-900 text-gold accent-gold focus:ring-gold"
                      />
                      {prep.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* Herbal Actions */}
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-sage">
                  Herbal Actions
                </h3>
                <div className="space-y-2">
                  {actions.slice(0, 8).map((action) => (
                    <label
                      key={action.id}
                      className="flex cursor-pointer items-center gap-2 text-sm text-mist transition-colors hover:text-cream"
                    >
                      <input
                        type="checkbox"
                        checked={filters.actions.includes(action.id)}
                        onChange={() => toggleFilter('actions', action.id)}
                        className="h-4 w-4 rounded border-moss bg-forest-900 text-gold accent-gold focus:ring-gold"
                      />
                      {action.name}
                    </label>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <Button
                  variant="secondary"
                  onClick={clearFilters}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Controls */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Search */}
              <div className="relative flex-1 sm:max-w-md">
                <input
                  type="text"
                  placeholder="Search herbs by name, use, or action..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  className="w-full rounded-full border border-moss bg-deep-forest/80 py-3 pl-12 pr-4 text-cream placeholder-sage transition-all focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
                <svg
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sage"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-sage">
                  {filteredPlants.length} herb
                  {filteredPlants.length !== 1 ? 's' : ''} found
                </span>

                {/* Mobile filter toggle */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="rounded-lg border border-moss p-2 text-sage transition-colors hover:bg-moss/30 hover:text-cream lg:hidden"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="mb-6 flex flex-wrap gap-2">
                {filters.bodySystems.map((system) => (
                  <span
                    key={system}
                    className="inline-flex items-center gap-1 rounded-full bg-moss/30 px-3 py-1 text-sm text-cream"
                  >
                    {formatLabel(system)}
                    <button
                      onClick={() => toggleFilter('bodySystems', system)}
                      className="ml-1 hover:text-gold"
                    >
                      &times;
                    </button>
                  </span>
                ))}
                {filters.preparations.map((prep) => (
                  <span
                    key={prep}
                    className="inline-flex items-center gap-1 rounded-full bg-moss/30 px-3 py-1 text-sm text-cream"
                  >
                    {formatLabel(prep)}
                    <button
                      onClick={() => toggleFilter('preparations', prep)}
                      className="ml-1 hover:text-gold"
                    >
                      &times;
                    </button>
                  </span>
                ))}
                {filters.actions.map((action) => (
                  <span
                    key={action}
                    className="inline-flex items-center gap-1 rounded-full bg-moss/30 px-3 py-1 text-sm text-cream"
                  >
                    {formatLabel(action)}
                    <button
                      onClick={() => toggleFilter('actions', action)}
                      className="ml-1 hover:text-gold"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Herb Grid */}
            {filteredPlants.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredPlants.map((plant) => (
                  <HerbCard key={plant.id} plant={plant} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <p className="text-lg text-sage">
                  No herbs found matching your criteria.
                </p>
                <Button
                  variant="secondary"
                  onClick={clearFilters}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-deep-forest p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-gold">
                Filter Herbs
              </h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="text-sage hover:text-cream"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Same filter content as sidebar */}
            <div className="space-y-6">
              {/* Body Systems */}
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-sage">
                  Body Systems
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {bodySystems.map((system) => (
                    <label
                      key={system.id}
                      className="flex cursor-pointer items-center gap-2 text-sm text-mist"
                    >
                      <input
                        type="checkbox"
                        checked={filters.bodySystems.includes(system.id)}
                        onChange={() => toggleFilter('bodySystems', system.id)}
                        className="h-4 w-4 rounded border-moss bg-forest-900 text-gold accent-gold"
                      />
                      {system.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* Preparation Types */}
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-sage">
                  Preparation Type
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {preparations.slice(0, 6).map((prep) => (
                    <label
                      key={prep.id}
                      className="flex cursor-pointer items-center gap-2 text-sm text-mist"
                    >
                      <input
                        type="checkbox"
                        checked={filters.preparations.includes(prep.id)}
                        onChange={() => toggleFilter('preparations', prep.id)}
                        className="h-4 w-4 rounded border-moss bg-forest-900 text-gold accent-gold"
                      />
                      {prep.name}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              {hasActiveFilters && (
                <Button variant="secondary" onClick={clearFilters}>
                  Clear All
                </Button>
              )}
              <Button onClick={() => setShowMobileFilters(false)} className="flex-1">
                Show {filteredPlants.length} Results
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
