'use server';

import { getStagedItemByPath } from '@/lib/staging';
import { StagedItemDetail } from '@/types/staging';

export async function fetchStagedItemDetail(filePath: string): Promise<StagedItemDetail | null> {
  return getStagedItemByPath(filePath);
}
