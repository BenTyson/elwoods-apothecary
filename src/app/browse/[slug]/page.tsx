import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPlants, getPlantById, formatLabel } from '@/lib/data';
import { Pill, getSystemVariant } from '@/components/ui/Pill';
import { Callout } from '@/components/ui/Callout';
import { Button } from '@/components/ui/Button';

// Generate static params for all plants
export function generateStaticParams() {
  const plants = getAllPlants();
  return plants.map((plant) => ({
    slug: plant.id,
  }));
}

// Generate metadata for each plant
export function generateMetadata({ params }: { params: { slug: string } }) {
  const plant = getPlantById(params.slug);
  if (!plant) {
    return { title: 'Plant Not Found' };
  }
  return {
    title: `${plant.commonName} | El Woods Apothecary`,
    description: plant.content.overview.substring(0, 160),
  };
}

export default function PlantPage({ params }: { params: { slug: string } }) {
  const plant = getPlantById(params.slug);

  if (!plant) {
    notFound();
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Back link */}
        <Link
          href="/browse"
          className="mb-8 inline-flex items-center gap-2 text-sage transition-colors hover:text-gold"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 12H5M12 19l-7-7 7-7"
            />
          </svg>
          Back to Browse
        </Link>

        {/* Plant Header */}
        <header className="mb-12 border-b border-moss pb-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="font-display text-lg italic text-sage">
                {plant.latinName}
              </p>
              <h1 className="mt-1 font-display text-5xl font-semibold text-cream">
                {plant.commonName}
              </h1>
              {plant.otherNames && plant.otherNames.length > 0 && (
                <p className="mt-2 text-sage">
                  Also known as: {plant.otherNames.join(', ')}
                </p>
              )}
              <p className="mt-1 text-sm text-gold">{plant.family}</p>
            </div>

            {/* Botanical Illustration Placeholder */}
            <div className="flex h-48 w-40 flex-shrink-0 items-center justify-center rounded-lg border border-sepia bg-gradient-to-br from-parchment to-parchment-dark">
              <span className="font-remedy text-lg text-sepia">
                {plant.commonName}
              </span>
            </div>
          </div>

          {/* Quick Info */}
          <div className="mt-8 grid grid-cols-3 gap-4 rounded-xl border border-moss bg-forest-800/30 p-4">
            <div className="text-center">
              <span className="block text-xs font-semibold uppercase tracking-wider text-gold">
                Parts Used
              </span>
              <span className="mt-1 block capitalize text-cream">
                {plant.partsUsed.join(', ')}
              </span>
            </div>
            <div className="text-center">
              <span className="block text-xs font-semibold uppercase tracking-wider text-gold">
                Taste
              </span>
              <span className="mt-1 block text-cream">{plant.taste}</span>
            </div>
            <div className="text-center">
              <span className="block text-xs font-semibold uppercase tracking-wider text-gold">
                Energy
              </span>
              <span className="mt-1 block text-cream">{plant.energy}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-6 flex flex-wrap gap-6">
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-sage">
                Body Systems
              </h4>
              <div className="flex flex-wrap gap-1">
                {plant.bodySystems.map((system) => (
                  <Pill key={system} variant={getSystemVariant(system)}>
                    {formatLabel(system)}
                  </Pill>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-sage">
                Preparations
              </h4>
              <div className="flex flex-wrap gap-1">
                {plant.preparations.map((prep) => (
                  <Pill key={prep} variant="preparation">
                    {formatLabel(prep)}
                  </Pill>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Overview */}
          <section>
            <h2 className="mb-4 border-b border-gold/30 pb-2 font-display text-2xl font-semibold text-gold">
              Overview
            </h2>
            <p className="text-lg leading-relaxed text-mist">
              {plant.content.overview}
            </p>
          </section>

          {/* Traditional Uses */}
          <section>
            <h2 className="mb-4 border-b border-gold/30 pb-2 font-display text-2xl font-semibold text-gold">
              Traditional Uses
            </h2>
            <p className="leading-relaxed text-mist">
              {plant.content.traditionalUses}
            </p>
          </section>

          {/* Modern Research */}
          <section>
            <h2 className="mb-4 border-b border-gold/30 pb-2 font-display text-2xl font-semibold text-gold">
              Modern Research
            </h2>
            <p className="leading-relaxed text-mist">
              {plant.content.modernResearch}
            </p>
          </section>

          {/* How to Use */}
          <section>
            <h2 className="mb-4 border-b border-gold/30 pb-2 font-display text-2xl font-semibold text-gold">
              How to Use
            </h2>
            <p className="leading-relaxed text-mist">{plant.content.howToUse}</p>

            {/* Dosage Grid */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(plant.dosage).map(([type, dose]) => (
                <div
                  key={type}
                  className="rounded-lg border border-moss bg-forest-800/40 p-4"
                >
                  <span className="block text-xs font-semibold uppercase tracking-wider text-gold">
                    {formatLabel(type)}
                  </span>
                  <span className="mt-1 block text-sm text-cream">{dose}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Key Constituents */}
          {plant.constituents && plant.constituents.length > 0 && (
            <section>
              <h2 className="mb-4 border-b border-gold/30 pb-2 font-display text-2xl font-semibold text-gold">
                Key Constituents
              </h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {plant.constituents.map((constituent) => (
                  <li
                    key={constituent}
                    className="rounded-lg border-l-4 border-dried-herb bg-forest-800/30 px-4 py-2 text-mist"
                  >
                    {constituent}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Safety Information */}
          <section>
            <h2 className="mb-4 border-b border-gold/30 pb-2 font-display text-2xl font-semibold text-gold">
              Safety Information
            </h2>
            <p className="mb-6 text-mist">{plant.safety.generalSafety}</p>

            {plant.safety.contraindications.length > 0 && (
              <Callout variant="warning" title="Contraindications" className="mb-4">
                <ul className="ml-4 list-disc space-y-1">
                  {plant.safety.contraindications.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Callout>
            )}

            {plant.safety.drugInteractions.length > 0 && (
              <Callout variant="danger" title="Drug Interactions" className="mb-4">
                <ul className="ml-4 list-disc space-y-1">
                  {plant.safety.drugInteractions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Callout>
            )}

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {plant.safety.pregnancyNotes && (
                <Callout variant="info" title="Pregnancy">
                  <p>{plant.safety.pregnancyNotes}</p>
                </Callout>
              )}
              {plant.safety.nursingNotes && (
                <Callout variant="info" title="Nursing">
                  <p>{plant.safety.nursingNotes}</p>
                </Callout>
              )}
              {plant.safety.childrenNotes && (
                <Callout variant="info" title="Children">
                  <p>{plant.safety.childrenNotes}</p>
                </Callout>
              )}
            </div>
          </section>

          {/* Synergistic Combinations */}
          {plant.combinations && plant.combinations.length > 0 && (
            <section>
              <h2 className="mb-4 border-b border-gold/30 pb-2 font-display text-2xl font-semibold text-gold">
                Synergistic Combinations
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {plant.combinations.map((combo) => (
                  <Link
                    key={combo.herb}
                    href={`/browse/${combo.herb}`}
                    className="group rounded-lg border border-moss bg-forest-800/30 p-4 transition-all hover:border-gold hover:bg-forest-800/50"
                  >
                    <span className="font-display text-lg font-semibold text-gold transition-colors group-hover:text-amber">
                      {formatLabel(combo.herb)}
                    </span>
                    <p className="mt-1 text-sm text-sage">{combo.purpose}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Harvesting & Cultivation */}
          {(plant.content.harvesting || plant.content.cultivation) && (
            <section>
              {plant.content.harvesting && (
                <>
                  <h2 className="mb-4 border-b border-gold/30 pb-2 font-display text-2xl font-semibold text-gold">
                    Harvesting
                  </h2>
                  <p className="mb-8 leading-relaxed text-mist">
                    {plant.content.harvesting}
                  </p>
                </>
              )}
              {plant.content.cultivation && (
                <>
                  <h2 className="mb-4 border-b border-gold/30 pb-2 font-display text-2xl font-semibold text-gold">
                    Cultivation
                  </h2>
                  <p className="leading-relaxed text-mist">
                    {plant.content.cultivation}
                  </p>
                </>
              )}
            </section>
          )}
        </div>

        {/* Back to Browse */}
        <div className="mt-16 text-center">
          <Button href="/browse" variant="secondary">
            Back to Browse
          </Button>
        </div>
      </div>
    </div>
  );
}
