// El Woods Apothecary - Data Access Layer

import { Plant, Tea, Categories, Condition, Remedy, FilterState } from '@/types';

import plantsData from '@/data/plants.json';
import categoriesData from '@/data/categories.json';
import conditionsData from '@/data/conditions.json';
import remediesData from '@/data/remedies.json';
import teasData from '@/data/teas.json';

// Type assertions for imported JSON (cast through unknown for strict TS)
const plants = plantsData.plants as unknown as Plant[];
const categories = categoriesData as unknown as Categories;
const conditions = conditionsData.conditions as unknown as Condition[];
const remedies = remediesData.remedies as unknown as Remedy[];
const teas = teasData.teas as unknown as Tea[];

// Plant functions
export function getAllPlants(): Plant[] {
  return plants;
}

export function getPlantById(id: string): Plant | undefined {
  return plants.find((plant) => plant.id === id);
}

export function getPlantBySlug(slug: string): Plant | undefined {
  return plants.find(
    (plant) =>
      plant.id === slug ||
      plant.commonName.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
  );
}

export function getFeaturedPlants(): Plant[] {
  return plants.filter((plant) => plant.featured);
}

export function searchPlants(query: string): Plant[] {
  const searchLower = query.toLowerCase();
  return plants.filter(
    (plant) =>
      plant.commonName.toLowerCase().includes(searchLower) ||
      plant.latinName.toLowerCase().includes(searchLower) ||
      plant.otherNames?.some((name) =>
        name.toLowerCase().includes(searchLower)
      ) ||
      plant.actions.some((action) =>
        action.toLowerCase().includes(searchLower)
      ) ||
      plant.conditions.some((condition) =>
        condition.toLowerCase().includes(searchLower)
      )
  );
}

export function filterPlants(filters: FilterState): Plant[] {
  let filtered = [...plants];

  // Search filter
  if (filters.search) {
    filtered = searchPlants(filters.search);
  }

  // Body systems filter
  if (filters.bodySystems.length > 0) {
    filtered = filtered.filter((plant) =>
      filters.bodySystems.some((system) => plant.bodySystems.includes(system))
    );
  }

  // Preparations filter
  if (filters.preparations.length > 0) {
    filtered = filtered.filter((plant) =>
      filters.preparations.some((prep) => plant.preparations.includes(prep))
    );
  }

  // Conditions filter
  if (filters.conditions.length > 0) {
    filtered = filtered.filter((plant) =>
      filters.conditions.some((condition) =>
        plant.conditions.includes(condition)
      )
    );
  }

  // Actions filter
  if (filters.actions.length > 0) {
    filtered = filtered.filter((plant) =>
      filters.actions.some((action) => plant.actions.includes(action))
    );
  }

  return filtered;
}

export function getPlantsByBodySystem(system: string): Plant[] {
  return plants.filter((plant) =>
    plant.bodySystems.includes(system as Plant['bodySystems'][number])
  );
}

export function getPlantsByCondition(condition: string): Plant[] {
  return plants.filter((plant) => plant.conditions.includes(condition));
}

export function getPlantsByPreparation(preparation: string): Plant[] {
  return plants.filter((plant) =>
    plant.preparations.includes(preparation as Plant['preparations'][number])
  );
}

// Category functions
export function getCategories(): Categories {
  return categories;
}

export function getBodySystems() {
  return categories.bodySystems;
}

export function getPreparationTypes() {
  return categories.preparationTypes;
}

export function getActions() {
  return categories.actions;
}

export function getTraditions() {
  return categories.traditions;
}

export function getSeasons() {
  return categories.seasons;
}

// Condition functions
export function getAllConditions(): Condition[] {
  return conditions;
}

export function getConditionById(id: string): Condition | undefined {
  return conditions.find((condition) => condition.id === id);
}

export function getConditionsByCategory(category: string): Condition[] {
  return conditions.filter((condition) => condition.category === category);
}

// Remedy functions
export function getAllRemedies(): Remedy[] {
  return remedies;
}

export function getRemedyById(id: string): Remedy | undefined {
  return remedies.find((remedy) => remedy.id === id);
}

export function getRemediesByHerb(herbId: string): Remedy[] {
  return remedies.filter((remedy) => remedy.herbs.includes(herbId));
}

export function getRemediesByCondition(conditionId: string): Remedy[] {
  return remedies.filter((remedy) => remedy.conditions.includes(conditionId));
}

// Tea functions
export function getAllTeas(): Tea[] {
  return teas;
}

export function getTeaById(id: string): Tea | undefined {
  return teas.find((tea) => tea.id === id);
}

export function searchTeas(query: string): Tea[] {
  const searchLower = query.toLowerCase();
  return teas.filter(
    (tea) =>
      tea.name.toLowerCase().includes(searchLower) ||
      tea.otherNames?.some((name) =>
        name.toLowerCase().includes(searchLower)
      ) ||
      tea.teaType.toLowerCase().includes(searchLower) ||
      tea.origin.country.toLowerCase().includes(searchLower)
  );
}

// Related item functions
export function getRelatedTeas(currentId: string, limit = 3): Tea[] {
  const current = getTeaById(currentId);
  if (!current) return [];

  const others = teas.filter((t) => t.id !== currentId);

  // Score by matching teaType first, then origin country
  const scored = others.map((tea) => {
    let score = 0;
    if (tea.teaType === current.teaType) score += 2;
    if (tea.origin.country === current.origin.country) score += 1;
    return { tea, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.tea);
}

export function getRelatedPlants(currentId: string, limit = 3): Plant[] {
  const current = getPlantById(currentId);
  if (!current) return [];

  const others = plants.filter((p) => p.id !== currentId);

  // Score by shared bodySystems + actions
  const scored = others.map((plant) => {
    let score = 0;
    for (const system of plant.bodySystems) {
      if (current.bodySystems.includes(system)) score += 2;
    }
    for (const action of plant.actions) {
      if (current.actions.includes(action)) score += 1;
    }
    return { plant, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.plant);
}

// Utility functions
export function formatLabel(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-');
}
