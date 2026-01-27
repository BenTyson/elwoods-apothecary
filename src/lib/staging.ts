// Server-only module for reading staging files
import fs from 'fs';
import path from 'path';
import { StagedItemSummary, StagedItemDetail, StagedItemType } from '@/types/staging';
import { GatherMetadata } from '@/types';

const STAGING_BASE = path.join(process.cwd(), 'src/data/staging');

const TYPE_DIRECTORIES: Record<string, StagedItemType> = {
  plants: 'plant',
  conditions: 'condition',
  remedies: 'remedy',
};

/**
 * Scan all staging subdirectories and return summaries of staged items
 */
export function getAllStagedItems(): StagedItemSummary[] {
  const items: StagedItemSummary[] = [];

  // Check if staging directory exists
  if (!fs.existsSync(STAGING_BASE)) {
    return items;
  }

  // Iterate through type directories (plants, conditions, remedies)
  for (const [dirName, itemType] of Object.entries(TYPE_DIRECTORIES)) {
    const typePath = path.join(STAGING_BASE, dirName);

    if (!fs.existsSync(typePath)) {
      continue;
    }

    const files = fs.readdirSync(typePath).filter(f => f.endsWith('.json'));

    for (const file of files) {
      const filePath = path.join(typePath, file);
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);

        // Extract metadata and basic info
        const meta: GatherMetadata = data._meta || {
          gatheredAt: 'Unknown',
          sources: [],
          confidence: 'low',
          isUpdate: false,
        };

        // Get name from data - check common patterns
        const name = data.commonName || data.name || data.id || file.replace('.json', '');
        const id = data.id || file.replace('.json', '');

        items.push({
          id,
          name,
          type: itemType,
          filePath: `${dirName}/${file}`,
          meta,
        });
      } catch (error) {
        console.error(`Error reading staging file ${filePath}:`, error);
      }
    }
  }

  // Sort by gathered date, most recent first
  items.sort((a, b) => {
    const dateA = new Date(a.meta.gatheredAt);
    const dateB = new Date(b.meta.gatheredAt);
    return dateB.getTime() - dateA.getTime();
  });

  return items;
}

/**
 * Read and parse a single staged item by its file path
 */
export function getStagedItemByPath(relativePath: string): StagedItemDetail | null {
  const fullPath = path.join(STAGING_BASE, relativePath);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(fullPath, 'utf-8');
    const data = JSON.parse(content);

    // Determine type from path
    const dirName = relativePath.split('/')[0];
    const itemType = TYPE_DIRECTORIES[dirName] || 'plant';

    const meta: GatherMetadata = data._meta || {
      gatheredAt: 'Unknown',
      sources: [],
      confidence: 'low',
      isUpdate: false,
    };

    const name = data.commonName || data.name || data.id || relativePath.split('/').pop()?.replace('.json', '') || 'Unknown';
    const id = data.id || relativePath.split('/').pop()?.replace('.json', '') || 'unknown';

    // Remove _meta from data for display
    const displayData = { ...data };
    delete displayData._meta;

    return {
      id,
      name,
      type: itemType,
      filePath: relativePath,
      meta,
      data: displayData,
    };
  } catch (error) {
    console.error(`Error reading staged item ${relativePath}:`, error);
    return null;
  }
}
