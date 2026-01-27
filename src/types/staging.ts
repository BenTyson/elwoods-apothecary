// Staging Review Types
import { GatherMetadata } from './index';

export type StagedItemType = 'plant' | 'condition' | 'remedy';

export interface StagedItemSummary {
  id: string;
  name: string;
  type: StagedItemType;
  filePath: string;
  meta: GatherMetadata;
}

export interface StagedItemDetail extends StagedItemSummary {
  data: Record<string, unknown>;
}
