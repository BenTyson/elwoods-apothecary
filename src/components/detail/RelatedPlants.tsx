import { HerbCard } from '@/components/herbs/HerbCard';
import { getRelatedPlants } from '@/lib/data';

interface RelatedPlantsProps {
  currentPlantId: string;
}

export function RelatedPlants({ currentPlantId }: RelatedPlantsProps) {
  const related = getRelatedPlants(currentPlantId, 3);

  if (related.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {related.map((plant) => (
        <HerbCard key={plant.id} plant={plant} />
      ))}
    </div>
  );
}
