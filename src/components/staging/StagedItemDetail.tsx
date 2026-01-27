import { StagedItemDetail as StagedItemDetailType } from '@/types/staging';
import { Pill, getConfidenceVariant } from '@/components/ui/Pill';
import { SourceLink } from './SourceLink';

interface StagedItemDetailProps {
  item: StagedItemDetailType;
}

const typeLabels: Record<string, string> = {
  plant: 'Plant',
  condition: 'Condition',
  remedy: 'Remedy',
};

export function StagedItemDetail({ item }: StagedItemDetailProps) {
  return (
    <div className="h-full overflow-y-auto rounded-xl border border-moss bg-deep-forest/90 p-6">
      {/* Header */}
      <div className="border-b border-moss pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-sage">
            {typeLabels[item.type]}
          </span>
          {item.meta.isUpdate && (
            <Pill variant="preparation">Update</Pill>
          )}
        </div>
        <h2 className="mt-2 font-display text-2xl font-semibold text-cream">
          {item.name}
        </h2>
        <p className="mt-1 text-sm text-sage">
          {item.filePath}
        </p>
      </div>

      {/* Metadata Section */}
      <div className="mt-6 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gold">
          Metadata
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-sage">Gathered</p>
            <p className="text-sm text-cream">{item.meta.gatheredAt}</p>
          </div>
          <div>
            <p className="text-xs text-sage">Confidence</p>
            <div className="mt-1">
              <Pill variant={getConfidenceVariant(item.meta.confidence)}>
                {item.meta.confidence}
              </Pill>
            </div>
          </div>
        </div>

        {item.meta.notes && (
          <div>
            <p className="text-xs text-sage">Notes</p>
            <p className="mt-1 rounded-lg bg-forest-900/50 p-3 text-sm text-mist">
              {item.meta.notes}
            </p>
          </div>
        )}
      </div>

      {/* Sources Section */}
      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold">
          Sources ({item.meta.sources.length})
        </h3>
        <div className="space-y-2">
          {item.meta.sources.map((source, idx) => (
            <SourceLink key={idx} url={source} />
          ))}
        </div>
      </div>

      {/* Data Preview Section */}
      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold">
          Data Preview
        </h3>
        <pre className="max-h-96 overflow-auto rounded-lg bg-forest-900/80 p-4 text-xs text-mist">
          {JSON.stringify(item.data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
