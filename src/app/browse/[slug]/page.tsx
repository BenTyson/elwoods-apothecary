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
          className="mb-8 inline-flex items-center gap-2 text-gray-400 transition-colors hover:text-accent-400"
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
        <header className="mb-12 border-b border-gray-700 pb-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="font-serif text-lg italic text-gray-400">
                {plant.latinName}
              </p>
              <h1 className="mt-1 text-5xl font-bold text-gray-50">
                {plant.commonName}
              </h1>
              {plant.otherNames && plant.otherNames.length > 0 && (
                <p className="mt-2 text-gray-400">
                  Also known as: {plant.otherNames.join(', ')}
                </p>
              )}
              <p className="mt-1 text-sm text-accent-400">{plant.family}</p>
            </div>

            {/* Botanical Illustration Placeholder */}
            <div className="flex h-48 w-40 flex-shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800">
              <span className="font-serif text-lg italic text-gray-500">
                {plant.commonName}
              </span>
            </div>
          </div>

          {/* Quick Info */}
          <div className="mt-8 grid grid-cols-3 gap-4 rounded-xl border border-gray-700 bg-gray-900 p-4">
            <div className="text-center">
              <span className="block text-xs font-medium text-gray-400">
                Parts Used
              </span>
              <span className="mt-1 block capitalize text-gray-100">
                {plant.partsUsed.join(', ')}
              </span>
            </div>
            <div className="text-center">
              <span className="block text-xs font-medium text-gray-400">
                Taste
              </span>
              <span className="mt-1 block text-gray-100">{plant.taste}</span>
            </div>
            <div className="text-center">
              <span className="block text-xs font-medium text-gray-400">
                Energy
              </span>
              <span className="mt-1 block text-gray-100">{plant.energy}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-6 flex flex-wrap gap-6">
            <div>
              <h4 className="mb-2 text-xs font-medium text-gray-400">
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
              <h4 className="mb-2 text-xs font-medium text-gray-400">
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
            <h2 className="mb-4 border-b border-gray-700 pb-2 text-2xl font-semibold text-gray-100 md:text-3xl">
              Overview
            </h2>
            <p className="text-lg leading-relaxed text-gray-300">
              {plant.content.overview}
            </p>
          </section>

          {/* Traditional Uses */}
          <section>
            <h2 className="mb-4 border-b border-gray-700 pb-2 text-2xl font-semibold text-gray-100 md:text-3xl">
              Traditional Uses
            </h2>
            <p className="leading-relaxed text-gray-300">
              {plant.content.traditionalUses}
            </p>
          </section>

          {/* Modern Research */}
          <section>
            <h2 className="mb-4 border-b border-gray-700 pb-2 text-2xl font-semibold text-gray-100 md:text-3xl">
              Modern Research
            </h2>
            <p className="leading-relaxed text-gray-300">
              {plant.content.modernResearch}
            </p>
          </section>

          {/* How to Use */}
          <section>
            <h2 className="mb-4 border-b border-gray-700 pb-2 text-2xl font-semibold text-gray-100 md:text-3xl">
              How to Use
            </h2>
            <p className="leading-relaxed text-gray-300">{plant.content.howToUse}</p>

            {/* Dosage Grid */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(plant.dosage).map(([type, dose]) => (
                <div
                  key={type}
                  className="rounded-lg border border-gray-700 bg-gray-900 p-4"
                >
                  <span className="block text-xs font-medium text-gray-400">
                    {formatLabel(type)}
                  </span>
                  <span className="mt-1 block font-mono text-sm text-gray-100">{dose}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Key Constituents */}
          {plant.constituents && plant.constituents.length > 0 && (
            <section>
              <h2 className="mb-4 border-b border-gray-700 pb-2 text-2xl font-semibold text-gray-100 md:text-3xl">
                Key Constituents
              </h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {plant.constituents.map((constituent) => (
                  <li
                    key={constituent}
                    className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-gray-300"
                  >
                    {constituent}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Safety Information */}
          <section>
            <h2 className="mb-4 border-b border-gray-700 pb-2 text-2xl font-semibold text-gray-100 md:text-3xl">
              Safety Information
            </h2>
            <p className="mb-6 text-gray-300">{plant.safety.generalSafety}</p>

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
              <h2 className="mb-4 border-b border-gray-700 pb-2 text-2xl font-semibold text-gray-100 md:text-3xl">
                Synergistic Combinations
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {plant.combinations.map((combo) => (
                  <Link
                    key={combo.herb}
                    href={`/browse/${combo.herb}`}
                    className="group rounded-lg border border-gray-700 bg-gray-900 p-4 transition-colors hover:border-gray-600 hover:bg-gray-800"
                  >
                    <span className="text-lg font-semibold text-accent-400 transition-colors group-hover:text-accent-300">
                      {formatLabel(combo.herb)}
                    </span>
                    <p className="mt-1 text-sm text-gray-400">{combo.purpose}</p>
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
                  <h2 className="mb-4 border-b border-gray-700 pb-2 text-2xl font-semibold text-gray-100 md:text-3xl">
                    Harvesting
                  </h2>
                  <p className="mb-8 leading-relaxed text-gray-300">
                    {plant.content.harvesting}
                  </p>
                </>
              )}
              {plant.content.cultivation && (
                <>
                  <h2 className="mb-4 border-b border-gray-700 pb-2 text-2xl font-semibold text-gray-100 md:text-3xl">
                    Cultivation
                  </h2>
                  <p className="leading-relaxed text-gray-300">
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
