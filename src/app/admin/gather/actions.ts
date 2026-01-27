'use server';

import { revalidatePath } from 'next/cache';
import { addToGatherQueue, removeFromGatherQueue } from '@/lib/gather-queue';
import type { GatherContentType } from '@/types/gather-queue';

export async function addItemToQueue(
  id: string,
  name: string,
  type: GatherContentType,
  dukeRef?: string,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  const item = {
    id,
    name,
    type,
    addedAt: new Date().toISOString().split('T')[0],
    ...(dukeRef && { dukeRef }),
    ...(notes && { notes }),
  };

  const result = addToGatherQueue(item);
  revalidatePath('/admin/gather');
  return result;
}

export async function removeItemFromQueue(
  id: string,
  type: GatherContentType
): Promise<{ success: boolean; error?: string }> {
  const result = removeFromGatherQueue(id, type);
  revalidatePath('/admin/gather');
  return result;
}
