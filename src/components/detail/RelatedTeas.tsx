import { TeaCard } from '@/components/teas/TeaCard';
import { getRelatedTeas } from '@/lib/data';

interface RelatedTeasProps {
  currentTeaId: string;
}

export function RelatedTeas({ currentTeaId }: RelatedTeasProps) {
  const related = getRelatedTeas(currentTeaId, 3);

  if (related.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {related.map((tea) => (
        <TeaCard key={tea.id} tea={tea} />
      ))}
    </div>
  );
}
