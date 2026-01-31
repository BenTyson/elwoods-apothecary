// Server-only module for managing the gather queue
import fs from 'fs';
import path from 'path';
import {
  GatherContentType,
  GatherQueueItem,
  GatherQueueItemWithStatus,
  GatherItemStatus,
  DukePlantSummary,
} from '@/types/gather-queue';
import { slugify } from '@/lib/data';

const DATA_DIR = path.join(process.cwd(), 'src/data');
const QUEUE_FILE = path.join(DATA_DIR, 'gather-queue.json');
const STAGING_BASE = path.join(DATA_DIR, 'staging');

/**
 * Config map: content type -> plural directory name and main data file info
 */
const TYPE_CONFIG: Record<GatherContentType, { pluralDir: string; mainDataFile: string | null; mainDataKey: string | null }> = {
  plant: { pluralDir: 'plants', mainDataFile: 'plants.json', mainDataKey: 'plants' },
  condition: { pluralDir: 'conditions', mainDataFile: 'conditions.json', mainDataKey: 'conditions' },
  remedy: { pluralDir: 'remedies', mainDataFile: 'remedies.json', mainDataKey: 'remedies' },
  ingredient: { pluralDir: 'ingredients', mainDataFile: null, mainDataKey: null },
  preparation: { pluralDir: 'preparations', mainDataFile: null, mainDataKey: null },
  action: { pluralDir: 'actions', mainDataFile: null, mainDataKey: null },
  term: { pluralDir: 'glossary', mainDataFile: null, mainDataKey: null },
  tea: { pluralDir: 'teas', mainDataFile: 'teas.json', mainDataKey: 'teas' },
};

// Cache for main data IDs (per type)
let mainDataIdCache: Record<string, Set<string>> | null = null;

// Cache for staged IDs (per type) — includes basename, id field, and slugified latinName
let stagedIdCache: Record<string, Set<string>> | null = null;

/**
 * Load all main data IDs into a lookup cache
 */
function getMainDataIds(): Record<string, Set<string>> {
  if (mainDataIdCache) return mainDataIdCache;

  const cache: Record<string, Set<string>> = {};

  for (const [type, config] of Object.entries(TYPE_CONFIG)) {
    if (!config.mainDataFile || !config.mainDataKey) {
      cache[type] = new Set();
      continue;
    }

    const filePath = path.join(DATA_DIR, config.mainDataFile);
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);
        const items = data[config.mainDataKey] as { id: string }[];
        cache[type] = new Set(items.map(item => item.id));
      } else {
        cache[type] = new Set();
      }
    } catch (error) {
      console.error(`Error reading main data file ${config.mainDataFile}:`, error);
      cache[type] = new Set();
    }
  }

  mainDataIdCache = cache;
  return cache;
}

/**
 * Load all staged IDs into a lookup cache.
 * For each staged .json file, collects the file basename, the `id` field,
 * and slugify(latinName) so any ID scheme resolves correctly.
 */
function getStagedIds(): Record<string, Set<string>> {
  if (stagedIdCache) return stagedIdCache;

  const cache: Record<string, Set<string>> = {};

  for (const [type, config] of Object.entries(TYPE_CONFIG)) {
    const ids = new Set<string>();
    const dir = path.join(STAGING_BASE, config.pluralDir);

    try {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
        for (const file of files) {
          // Add the file basename (without .json)
          const basename = file.replace(/\.json$/, '');
          ids.add(basename);

          // Parse the file and extract additional identifiers
          try {
            const content = fs.readFileSync(path.join(dir, file), 'utf-8');
            const data = JSON.parse(content);
            if (data.id) ids.add(data.id);
            if (data.latinName) ids.add(slugify(data.latinName));
          } catch {
            // Skip files that can't be parsed
          }
        }
      }
    } catch (error) {
      console.error(`Error reading staging directory ${config.pluralDir}:`, error);
    }

    cache[type] = ids;
  }

  stagedIdCache = cache;
  return cache;
}

/**
 * Compute the status of a queue item based on filesystem state
 */
function computeItemStatus(item: GatherQueueItem): GatherItemStatus {
  const mainIds = getMainDataIds();

  // Check if merged into main data
  if (mainIds[item.type]?.has(item.id)) {
    return 'merged';
  }

  // Check if staged (using index that maps multiple ID schemes)
  const stagedIds = getStagedIds();
  if (stagedIds[item.type]?.has(item.id)) {
    return 'staged';
  }

  return 'queued';
}

/**
 * Read the raw queue file
 */
function readQueueFile(): GatherQueueItem[] {
  try {
    if (!fs.existsSync(QUEUE_FILE)) {
      return [];
    }
    const content = fs.readFileSync(QUEUE_FILE, 'utf-8');
    const data = JSON.parse(content);
    return data.items || [];
  } catch (error) {
    console.error('Error reading gather queue:', error);
    return [];
  }
}

/**
 * Write items to the queue file
 */
function writeQueueFile(items: GatherQueueItem[]): void {
  const data = { items };
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

/**
 * Get all gather queue items with computed statuses
 */
export function getGatherQueue(): GatherQueueItemWithStatus[] {
  // Reset caches on each read to pick up filesystem changes
  mainDataIdCache = null;
  stagedIdCache = null;

  const items = readQueueFile();
  return items.map(item => ({
    ...item,
    status: computeItemStatus(item),
  }));
}

/**
 * Get gather queue items filtered by type
 */
export function getGatherQueueByType(type: GatherContentType): GatherQueueItemWithStatus[] {
  return getGatherQueue().filter(item => item.type === type);
}

/**
 * Add an item to the gather queue (with deduplication)
 */
export function addToGatherQueue(item: GatherQueueItem): { success: boolean; error?: string } {
  const items = readQueueFile();

  // Check for duplicates (same id + type)
  const exists = items.some(existing => existing.id === item.id && existing.type === item.type);
  if (exists) {
    return { success: false, error: `Item "${item.id}" of type "${item.type}" already in queue` };
  }

  items.push(item);
  writeQueueFile(items);
  return { success: true };
}

/**
 * Remove an item from the gather queue
 */
export function removeFromGatherQueue(id: string, type: GatherContentType): { success: boolean; error?: string } {
  const items = readQueueFile();
  const filtered = items.filter(item => !(item.id === id && item.type === type));

  if (filtered.length === items.length) {
    return { success: false, error: `Item "${id}" of type "${type}" not found in queue` };
  }

  writeQueueFile(filtered);
  return { success: true };
}

// Cache for Duke plant index
let dukePlantIndexCache: DukePlantSummary[] | null = null;

/**
 * Get a lightweight index of all Duke plant entries
 */
export function getDukePlantIndex(): DukePlantSummary[] {
  if (dukePlantIndexCache) return dukePlantIndexCache;

  const dukePath = path.join(DATA_DIR, 'reference', 'duke-plants.json');
  try {
    const content = fs.readFileSync(dukePath, 'utf-8');
    const data = JSON.parse(content) as Record<string, {
      latinName: string;
      family: string;
      commonNames: string[];
      constituents: Record<string, string[]>;
    }>;

    const summaries: DukePlantSummary[] = Object.entries(data).map(([slug, plant]) => ({
      slug,
      latinName: plant.latinName || slug,
      family: plant.family || '',
      commonNames: plant.commonNames || [],
      constituentCount: plant.constituents
        ? Object.values(plant.constituents).reduce((sum, arr) => sum + arr.length, 0)
        : 0,
    }));

    // Sort alphabetically by latin name
    summaries.sort((a, b) => a.latinName.localeCompare(b.latinName));

    dukePlantIndexCache = summaries;
    return summaries;
  } catch (error) {
    console.error('Error reading Duke plant index:', error);
    return [];
  }
}

/**
 * Get the plural directory name for a content type
 */
export function getPluralDir(type: GatherContentType): string {
  return TYPE_CONFIG[type].pluralDir;
}
