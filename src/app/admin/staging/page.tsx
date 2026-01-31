import { getAllStagedItems } from '@/lib/staging';
import { StagingReviewClient } from './StagingReviewClient';

export const metadata = {
  title: 'Staged Data Review | El Woods Apothecary',
  description: 'Review gathered research data before merging into the database',
};

export default function StagingReviewPage() {
  const items = getAllStagedItems();

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-gray-100">
            Staged Data Review
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Research data pending review before merging into the database
          </p>
        </div>

        {/* Client Component for interactivity */}
        <StagingReviewClient initialItems={items} />
      </div>
    </div>
  );
}
