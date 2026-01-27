// Gather Queue Types

export type GatherContentType =
  | 'plant'
  | 'condition'
  | 'remedy'
  | 'ingredient'
  | 'preparation'
  | 'action'
  | 'term'
  | 'tea';

export type GatherItemStatus = 'queued' | 'staged' | 'merged';

export interface GatherQueueItem {
  id: string;
  name: string;
  type: GatherContentType;
  addedAt: string;
  notes?: string;
  dukeRef?: string;
}

export interface GatherQueueItemWithStatus extends GatherQueueItem {
  status: GatherItemStatus;
}

export interface DukePlantSummary {
  slug: string;
  latinName: string;
  family: string;
  commonNames: string[];
  constituentCount: number;
}
