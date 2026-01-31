import { getGatherQueue, getDukePlantIndex } from '@/lib/gather-queue';
import { GatherQueueClient } from './GatherQueueClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Gather Queue | El Woods Apothecary',
  description: 'Curate and track items across all content types for the gather workflow',
};

export default function GatherQueuePage() {
  const items = getGatherQueue();
  const dukePlants = getDukePlantIndex();

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-gray-100">
            Gather Queue
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Curate research targets across all content types
          </p>
        </div>

        {/* Client Component for interactivity */}
        <GatherQueueClient initialItems={items} dukePlants={dukePlants} />
      </div>
    </div>
  );
}
