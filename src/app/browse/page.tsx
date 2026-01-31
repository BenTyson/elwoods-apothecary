'use client';

import { useState, useMemo } from 'react';
import { HerbCard } from '@/components/herbs/HerbCard';
import { TeaCard } from '@/components/teas/TeaCard';
import { Button } from '@/components/ui/Button';
import {
  getAllPlants,
  getAllTeas,
  getBodySystems,
  getPreparationTypes,
  getActions,
  formatLabel,
} from '@/lib/data';
import { FilterState, BodySystem, PreparationType, TeaType } from '@/types';

type BrowseTab = 'herbs' | 'teas';

interface TeaFilterState {
  search: string;
  teaTypes: TeaType[];
  caffeineLevels: string[];
}

const TEA_TYPES: { id: TeaType; label: string }[] = [
  { id: 'black', label: 'Black' },
  { id: 'green', label: 'Green' },
  { id: 'oolong', label: 'Oolong' },
  { id: 'white', label: 'White' },
  { id: 'dark', label: 'Pu-erh / Dark' },
  { id: 'blend', label: 'Blend' },
];

const CAFFEINE_LEVELS = [
  { id: 'none', label: 'None' },
  { id: 'low', label: 'Low' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'high', label: 'High' },
];

export default function BrowsePage() {
  const plants = getAllPlants();
  const allTeas = getAllTeas();
  const bodySystems = getBodySystems();
  const preparations = getPreparationTypes();
  const actions = getActions();

  const [activeTab, setActiveTab] = useState<BrowseTab>('herbs');

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    bodySystems: [],
    preparations: [],
    conditions: [],
    actions: [],
  });

  const [teaFilters, setTeaFilters] = useState<TeaFilterState>({
    search: '',
    teaTypes: [],
    caffeineLevels: [],
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

  // Filter teas based on current tea filters
  const filteredTeas = useMemo(() => {
    let result = [...allTeas];

    if (teaFilters.search) {
      const searchLower = teaFilters.search.toLowerCase();
      result = result.filter(
        (tea) =>
          tea.name.toLowerCase().includes(searchLower) ||
          tea.otherNames?.some((name) =>
            name.toLowerCase().includes(searchLower)
          ) ||
          tea.origin.country.toLowerCase().includes(searchLower)
      );
    }

    if (teaFilters.teaTypes.length > 0) {
      result = result.filter((tea) =>
        teaFilters.teaTypes.includes(tea.teaType)
      );
    }

    if (teaFilters.caffeineLevels.length > 0) {
      result = result.filter((tea) =>
        teaFilters.caffeineLevels.includes(tea.caffeine.level)
      );
    }

    return result;
  }, [allTeas, teaFilters]);

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

  const toggleTeaFilter = (
    type: 'teaTypes' | 'caffeineLevels',
    value: string
  ) => {
    setTeaFilters((prev) => {
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

  const clearTeaFilters = () => {
    setTeaFilters({
      search: '',
      teaTypes: [],
      caffeineLevels: [],
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.bodySystems.length > 0 ||
    filters.preparations.length > 0 ||
    filters.actions.length > 0;

  const hasActiveTeaFilters =
    teaFilters.search ||
    teaFilters.teaTypes.length > 0 ||
    teaFilters.caffeineLevels.length > 0;

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-gray-100 md:text-5xl">
            The Herbarium
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Explore our collection of medicinal plants, herbs, and teas
          </p>
        </div>

        {/* Tab Bar */}
        <div className="mb-8 flex gap-1 rounded-lg border border-gray-700 bg-gray-900 p-1 sm:w-fit">
          <button
            onClick={() => setActiveTab('herbs')}
            className={`rounded-md px-6 py-2 text-sm font-medium transition-colors ${
              activeTab === 'herbs'
                ? 'bg-gray-800 text-gray-100'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Herbs
            <span className="ml-2 text-xs text-gray-500">
              {plants.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('teas')}
            className={`rounded-md px-6 py-2 text-sm font-medium transition-colors ${
              activeTab === 'teas'
                ? 'bg-gray-800 text-gray-100'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Teas
            <span className="ml-2 text-xs text-gray-500">
              {allTeas.length}
            </span>
          </button>
        </div>

        <div className="flex gap-8">
          {/* Filter Sidebar - Desktop */}
          <aside className="hidden w-72 flex-shrink-0 lg:block">
            <div className="sticky top-24 rounded-xl border border-gray-700 bg-gray-900 p-6">
              {activeTab === 'herbs' ? (
                <>
                  <h2 className="mb-6 border-b border-gray-700 pb-2 text-sm font-semibold text-gray-100">
                    Filter Herbs
                  </h2>

                  {/* Body Systems */}
                  <div className="mb-6">
                    <h3 className="mb-3 text-xs font-medium text-gray-400">
                      Body Systems
                    </h3>
                    <div className="space-y-2">
                      {bodySystems.map((system) => (
                        <label
                          key={system.id}
                          className="flex cursor-pointer items-center gap-2 text-sm text-gray-300 transition-colors hover:text-gray-100"
                        >
                          <input
                            type="checkbox"
                            checked={filters.bodySystems.includes(system.id)}
                            onChange={() => toggleFilter('bodySystems', system.id)}
                            className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-accent-500 accent-accent-500 focus:ring-accent-500"
                          />
                          {system.name}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Preparation Types */}
                  <div className="mb-6">
                    <h3 className="mb-3 text-xs font-medium text-gray-400">
                      Preparation Type
                    </h3>
                    <div className="space-y-2">
                      {preparations.slice(0, 6).map((prep) => (
                        <label
                          key={prep.id}
                          className="flex cursor-pointer items-center gap-2 text-sm text-gray-300 transition-colors hover:text-gray-100"
                        >
                          <input
                            type="checkbox"
                            checked={filters.preparations.includes(prep.id)}
                            onChange={() => toggleFilter('preparations', prep.id)}
                            className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-accent-500 accent-accent-500 focus:ring-accent-500"
                          />
                          {prep.name}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Herbal Actions */}
                  <div className="mb-6">
                    <h3 className="mb-3 text-xs font-medium text-gray-400">
                      Herbal Actions
                    </h3>
                    <div className="space-y-2">
                      {actions.slice(0, 8).map((action) => (
                        <label
                          key={action.id}
                          className="flex cursor-pointer items-center gap-2 text-sm text-gray-300 transition-colors hover:text-gray-100"
                        >
                          <input
                            type="checkbox"
                            checked={filters.actions.includes(action.id)}
                            onChange={() => toggleFilter('actions', action.id)}
                            className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-accent-500 accent-accent-500 focus:ring-accent-500"
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
                </>
              ) : (
                <>
                  <h2 className="mb-6 border-b border-gray-700 pb-2 text-sm font-semibold text-gray-100">
                    Filter Teas
                  </h2>

                  {/* Tea Type */}
                  <div className="mb-6">
                    <h3 className="mb-3 text-xs font-medium text-gray-400">
                      Tea Type
                    </h3>
                    <div className="space-y-2">
                      {TEA_TYPES.map((type) => (
                        <label
                          key={type.id}
                          className="flex cursor-pointer items-center gap-2 text-sm text-gray-300 transition-colors hover:text-gray-100"
                        >
                          <input
                            type="checkbox"
                            checked={teaFilters.teaTypes.includes(type.id)}
                            onChange={() => toggleTeaFilter('teaTypes', type.id)}
                            className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-accent-500 accent-accent-500 focus:ring-accent-500"
                          />
                          {type.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Caffeine Level */}
                  <div className="mb-6">
                    <h3 className="mb-3 text-xs font-medium text-gray-400">
                      Caffeine Level
                    </h3>
                    <div className="space-y-2">
                      {CAFFEINE_LEVELS.map((level) => (
                        <label
                          key={level.id}
                          className="flex cursor-pointer items-center gap-2 text-sm text-gray-300 transition-colors hover:text-gray-100"
                        >
                          <input
                            type="checkbox"
                            checked={teaFilters.caffeineLevels.includes(level.id)}
                            onChange={() => toggleTeaFilter('caffeineLevels', level.id)}
                            className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-accent-500 accent-accent-500 focus:ring-accent-500"
                          />
                          {level.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  {hasActiveTeaFilters && (
                    <Button
                      variant="secondary"
                      onClick={clearTeaFilters}
                      className="w-full"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'herbs' ? (
              <>
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
                      className="w-full rounded-lg border border-gray-700 bg-gray-900 py-3 pl-12 pr-4 text-gray-100 placeholder-gray-500 transition-colors focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
                    />
                    <svg
                      className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">
                      {filteredPlants.length} herb
                      {filteredPlants.length !== 1 ? 's' : ''} found
                    </span>

                    {/* Mobile filter toggle */}
                    <button
                      onClick={() => setShowMobileFilters(true)}
                      className="rounded-lg border border-gray-700 p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-gray-200 lg:hidden"
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
                        className="inline-flex items-center gap-1 rounded-md bg-gray-800 px-3 py-1 text-sm text-gray-200"
                      >
                        {formatLabel(system)}
                        <button
                          onClick={() => toggleFilter('bodySystems', system)}
                          className="ml-1 text-gray-400 hover:text-gray-100"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                    {filters.preparations.map((prep) => (
                      <span
                        key={prep}
                        className="inline-flex items-center gap-1 rounded-md bg-gray-800 px-3 py-1 text-sm text-gray-200"
                      >
                        {formatLabel(prep)}
                        <button
                          onClick={() => toggleFilter('preparations', prep)}
                          className="ml-1 text-gray-400 hover:text-gray-100"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                    {filters.actions.map((action) => (
                      <span
                        key={action}
                        className="inline-flex items-center gap-1 rounded-md bg-gray-800 px-3 py-1 text-sm text-gray-200"
                      >
                        {formatLabel(action)}
                        <button
                          onClick={() => toggleFilter('actions', action)}
                          className="ml-1 text-gray-400 hover:text-gray-100"
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
                    <p className="text-lg text-gray-400">
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
              </>
            ) : (
              <>
                {/* Tea Search and Controls */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative flex-1 sm:max-w-md">
                    <input
                      type="text"
                      placeholder="Search teas by name, origin, or type..."
                      value={teaFilters.search}
                      onChange={(e) =>
                        setTeaFilters((prev) => ({ ...prev, search: e.target.value }))
                      }
                      className="w-full rounded-lg border border-gray-700 bg-gray-900 py-3 pl-12 pr-4 text-gray-100 placeholder-gray-500 transition-colors focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
                    />
                    <svg
                      className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">
                      {filteredTeas.length} tea
                      {filteredTeas.length !== 1 ? 's' : ''} found
                    </span>

                    <button
                      onClick={() => setShowMobileFilters(true)}
                      className="rounded-lg border border-gray-700 p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-gray-200 lg:hidden"
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

                {/* Active Tea Filters */}
                {hasActiveTeaFilters && (
                  <div className="mb-6 flex flex-wrap gap-2">
                    {teaFilters.teaTypes.map((type) => (
                      <span
                        key={type}
                        className="inline-flex items-center gap-1 rounded-md bg-gray-800 px-3 py-1 text-sm text-gray-200"
                      >
                        {formatLabel(type)}
                        <button
                          onClick={() => toggleTeaFilter('teaTypes', type)}
                          className="ml-1 text-gray-400 hover:text-gray-100"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                    {teaFilters.caffeineLevels.map((level) => (
                      <span
                        key={level}
                        className="inline-flex items-center gap-1 rounded-md bg-gray-800 px-3 py-1 text-sm text-gray-200"
                      >
                        {formatLabel(level)} caffeine
                        <button
                          onClick={() => toggleTeaFilter('caffeineLevels', level)}
                          className="ml-1 text-gray-400 hover:text-gray-100"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Tea Grid */}
                {filteredTeas.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredTeas.map((tea) => (
                      <TeaCard key={tea.id} tea={tea} />
                    ))}
                  </div>
                ) : (
                  <div className="py-16 text-center">
                    <p className="text-lg text-gray-400">
                      No teas found matching your criteria.
                    </p>
                    <Button
                      variant="secondary"
                      onClick={clearTeaFilters}
                      className="mt-4"
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </>
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
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-gray-900 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-100">
                {activeTab === 'herbs' ? 'Filter Herbs' : 'Filter Teas'}
              </h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="text-gray-400 hover:text-gray-100"
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

            {activeTab === 'herbs' ? (
              <div className="space-y-6">
                {/* Body Systems */}
                <div>
                  <h3 className="mb-3 text-xs font-medium text-gray-400">
                    Body Systems
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {bodySystems.map((system) => (
                      <label
                        key={system.id}
                        className="flex cursor-pointer items-center gap-2 text-sm text-gray-300"
                      >
                        <input
                          type="checkbox"
                          checked={filters.bodySystems.includes(system.id)}
                          onChange={() => toggleFilter('bodySystems', system.id)}
                          className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-accent-500 accent-accent-500"
                        />
                        {system.name}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Preparation Types */}
                <div>
                  <h3 className="mb-3 text-xs font-medium text-gray-400">
                    Preparation Type
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {preparations.slice(0, 6).map((prep) => (
                      <label
                        key={prep.id}
                        className="flex cursor-pointer items-center gap-2 text-sm text-gray-300"
                      >
                        <input
                          type="checkbox"
                          checked={filters.preparations.includes(prep.id)}
                          onChange={() => toggleFilter('preparations', prep.id)}
                          className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-accent-500 accent-accent-500"
                        />
                        {prep.name}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Tea Type */}
                <div>
                  <h3 className="mb-3 text-xs font-medium text-gray-400">
                    Tea Type
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {TEA_TYPES.map((type) => (
                      <label
                        key={type.id}
                        className="flex cursor-pointer items-center gap-2 text-sm text-gray-300"
                      >
                        <input
                          type="checkbox"
                          checked={teaFilters.teaTypes.includes(type.id)}
                          onChange={() => toggleTeaFilter('teaTypes', type.id)}
                          className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-accent-500 accent-accent-500"
                        />
                        {type.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Caffeine Level */}
                <div>
                  <h3 className="mb-3 text-xs font-medium text-gray-400">
                    Caffeine Level
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {CAFFEINE_LEVELS.map((level) => (
                      <label
                        key={level.id}
                        className="flex cursor-pointer items-center gap-2 text-sm text-gray-300"
                      >
                        <input
                          type="checkbox"
                          checked={teaFilters.caffeineLevels.includes(level.id)}
                          onChange={() => toggleTeaFilter('caffeineLevels', level.id)}
                          className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-accent-500 accent-accent-500"
                        />
                        {level.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-4">
              {activeTab === 'herbs' ? (
                <>
                  {hasActiveFilters && (
                    <Button variant="secondary" onClick={clearFilters}>
                      Clear All
                    </Button>
                  )}
                  <Button onClick={() => setShowMobileFilters(false)} className="flex-1">
                    Show {filteredPlants.length} Results
                  </Button>
                </>
              ) : (
                <>
                  {hasActiveTeaFilters && (
                    <Button variant="secondary" onClick={clearTeaFilters}>
                      Clear All
                    </Button>
                  )}
                  <Button onClick={() => setShowMobileFilters(false)} className="flex-1">
                    Show {filteredTeas.length} Results
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
