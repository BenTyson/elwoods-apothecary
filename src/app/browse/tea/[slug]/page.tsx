import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllTeas, getTeaById, formatLabel } from '@/lib/data';
import { Pill } from '@/components/ui/Pill';
import { Callout } from '@/components/ui/Callout';
import { Button } from '@/components/ui/Button';

export function generateStaticParams() {
  const teas = getAllTeas();
  return teas.map((tea) => ({
    slug: tea.id,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const tea = getTeaById(params.slug);
  if (!tea) {
    return { title: 'Tea Not Found' };
  }
  return {
    title: `${tea.name} | El Woods Apothecary`,
    description: tea.content.overview.substring(0, 160),
  };
}

function getTeaTypeVariant(teaType: string) {
  const mapping: Record<string, 'green' | 'amber' | 'purple' | 'rose' | 'orange' | 'blue' | 'default'> = {
    green: 'green',
    white: 'rose',
    oolong: 'amber',
    black: 'orange',
    dark: 'purple',
    blend: 'blue',
    yellow: 'amber',
  };
  return mapping[teaType] || 'default';
}

function getCaffeineLabel(level: string) {
  const labels: Record<string, string> = {
    'none': 'Caffeine Free',
    'very-low': 'Very Low',
    'low': 'Low',
    'moderate': 'Moderate',
    'high': 'High',
    'very-high': 'Very High',
  };
  return labels[level] || level;
}

export default function TeaPage({ params }: { params: { slug: string } }) {
  const tea = getTeaById(params.slug);

  if (!tea) {
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

        {/* Tea Header */}
        <header className="mb-12 border-b border-gray-700 pb-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Pill variant={getTeaTypeVariant(tea.teaType)}>
                {formatLabel(tea.teaType)} Tea
              </Pill>
              <span className="text-sm text-gray-400">
                {tea.origin.country}
              </span>
            </div>

            <h1 className="text-5xl font-bold text-gray-50">
              {tea.name}
            </h1>

            {tea.otherNames && tea.otherNames.length > 0 && (
              <p className="text-gray-400">
                Also known as: {tea.otherNames.join(', ')}
              </p>
            )}

            {tea.origin.region && (
              <p className="text-sm text-gray-400">
                {tea.origin.region}
              </p>
            )}
          </div>

          {/* Quick Info */}
          <div className="mt-8 grid grid-cols-2 gap-4 rounded-xl border border-gray-700 bg-gray-900 p-4 sm:grid-cols-4">
            <div className="text-center">
              <span className="block text-xs font-medium text-gray-400">
                Caffeine
              </span>
              <span className="mt-1 block text-gray-100">
                {getCaffeineLabel(tea.caffeine.level)}
              </span>
              {tea.caffeine.mgPerCup && (
                <span className="block text-xs text-gray-500">
                  {tea.caffeine.mgPerCup}
                </span>
              )}
            </div>
            <div className="text-center">
              <span className="block text-xs font-medium text-gray-400">
                Water Temp
              </span>
              <span className="mt-1 block text-sm text-gray-100">
                {tea.brewing.waterTemp}
              </span>
            </div>
            <div className="text-center">
              <span className="block text-xs font-medium text-gray-400">
                Steep Time
              </span>
              <span className="mt-1 block text-sm text-gray-100">
                {tea.brewing.steepTime}
              </span>
            </div>
            <div className="text-center">
              <span className="block text-xs font-medium text-gray-400">
                Leaf Ratio
              </span>
              <span className="mt-1 block text-sm text-gray-100">
                {tea.brewing.leafRatio}
              </span>
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
              {tea.content.overview}
            </p>
          </section>

          {/* History */}
          {tea.content.history && (
            <section>
              <h2 className="mb-4 border-b border-gray-700 pb-2 text-2xl font-semibold text-gray-100 md:text-3xl">
                History
              </h2>
              <p className="leading-relaxed text-gray-300">
                {tea.content.history}
              </p>
            </section>
          )}

          {/* Culture */}
          {tea.content.culture && (
            <section>
              <h2 className="mb-4 border-b border-gray-700 pb-2 text-2xl font-semibold text-gray-100 md:text-3xl">
                Culture
              </h2>
              <p className="leading-relaxed text-gray-300">
                {tea.content.culture}
              </p>
            </section>
          )}

          {/* Production & Processing */}
          {(tea.content.production || tea.processing.steps.length > 0) && (
            <section>
              <h2 className="mb-4 border-b border-gray-700 pb-2 text-2xl font-semibold text-gray-100 md:text-3xl">
                Production & Processing
              </h2>
              {tea.content.production && (
                <p className="mb-6 leading-relaxed text-gray-300">
                  {tea.content.production}
                </p>
              )}

              {tea.processing.steps.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-400">Processing Steps</h3>
                  <ol className="space-y-2">
                    {tea.processing.steps.map((step, i) => (
                      <li
                        key={i}
                        className="flex gap-3 rounded-lg border border-gray-700 bg-gray-900 px-4 py-3"
                      >
                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-800 text-xs font-medium text-gray-400">
                          {i + 1}
                        </span>
                        <span className="text-sm text-gray-300">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Oxidation: </span>
                  <span className="text-gray-200">{tea.processing.oxidationLevel}</span>
                </div>
                {tea.processing.roastLevel && tea.processing.roastLevel !== 'none' && (
                  <div>
                    <span className="text-gray-400">Roast: </span>
                    <span className="text-gray-200">{formatLabel(tea.processing.roastLevel)}</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Flavor & Aroma Profile */}
          <section>
            <h2 className="mb-4 border-b border-gray-700 pb-2 text-2xl font-semibold text-gray-100 md:text-3xl">
              Flavor & Aroma Profile
            </h2>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-400">Aroma</h3>
                <div className="flex flex-wrap gap-1">
                  {tea.profile.aroma.map((note) => (
                    <Pill key={note} variant="default">{note}</Pill>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-400">Flavor</h3>
                <div className="flex flex-wrap gap-1">
                  {tea.profile.flavor.map((note) => (
                    <Pill key={note} variant="default">{note}</Pill>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                <span className="block text-xs font-medium text-gray-400">Appearance</span>
                <span className="mt-1 block text-sm text-gray-300">{tea.profile.appearance}</span>
              </div>
              <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                <span className="block text-xs font-medium text-gray-400">Liquor Color</span>
                <span className="mt-1 block text-sm text-gray-300">{tea.profile.liquorColor}</span>
              </div>
              {tea.profile.mouthfeel && (
                <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                  <span className="block text-xs font-medium text-gray-400">Mouthfeel</span>
                  <span className="mt-1 block text-sm text-gray-300">{tea.profile.mouthfeel}</span>
                </div>
              )}
              {tea.profile.finish && (
                <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                  <span className="block text-xs font-medium text-gray-400">Finish</span>
                  <span className="mt-1 block text-sm text-gray-300">{tea.profile.finish}</span>
                </div>
              )}
            </div>
          </section>

          {/* Brewing */}
          <section>
            <h2 className="mb-4 border-b border-gray-700 pb-2 text-2xl font-semibold text-gray-100 md:text-3xl">
              Brewing Guide
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                <span className="block text-xs font-medium text-gray-400">Water Temperature</span>
                <span className="mt-1 block font-mono text-sm text-gray-100">{tea.brewing.waterTemp}</span>
              </div>
              <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                <span className="block text-xs font-medium text-gray-400">Steep Time</span>
                <span className="mt-1 block font-mono text-sm text-gray-100">{tea.brewing.steepTime}</span>
              </div>
              <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                <span className="block text-xs font-medium text-gray-400">Leaf Ratio</span>
                <span className="mt-1 block font-mono text-sm text-gray-100">{tea.brewing.leafRatio}</span>
              </div>
              {tea.brewing.resteeps !== undefined && (
                <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                  <span className="block text-xs font-medium text-gray-400">Re-steeps</span>
                  <span className="mt-1 block font-mono text-sm text-gray-100">
                    {tea.brewing.resteeps === 0 ? 'Not recommended' : `Up to ${tea.brewing.resteeps}`}
                  </span>
                </div>
              )}
            </div>

            {tea.brewing.notes && (
              <div className="mt-4 rounded-lg border border-gray-700 bg-gray-900 p-4">
                <span className="block text-xs font-medium text-gray-400">Brewing Notes</span>
                <p className="mt-1 text-sm text-gray-300">{tea.brewing.notes}</p>
              </div>
            )}

            {tea.brewing.gongfuStyle && (
              <div className="mt-6">
                <h3 className="mb-3 text-sm font-medium text-gray-400">Gongfu Style</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                    <span className="block text-xs font-medium text-gray-400">Water Temperature</span>
                    <span className="mt-1 block font-mono text-sm text-gray-100">{tea.brewing.gongfuStyle.waterTemp}</span>
                  </div>
                  <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                    <span className="block text-xs font-medium text-gray-400">Steep Time</span>
                    <span className="mt-1 block font-mono text-sm text-gray-100">{tea.brewing.gongfuStyle.steepTime}</span>
                  </div>
                  <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                    <span className="block text-xs font-medium text-gray-400">Leaf Ratio</span>
                    <span className="mt-1 block font-mono text-sm text-gray-100">{tea.brewing.gongfuStyle.leafRatio}</span>
                  </div>
                  {tea.brewing.gongfuStyle.resteeps !== undefined && (
                    <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                      <span className="block text-xs font-medium text-gray-400">Re-steeps</span>
                      <span className="mt-1 block font-mono text-sm text-gray-100">Up to {tea.brewing.gongfuStyle.resteeps}</span>
                    </div>
                  )}
                </div>
                {tea.brewing.gongfuStyle.notes && (
                  <div className="mt-4 rounded-lg border border-gray-700 bg-gray-900 p-4">
                    <span className="block text-xs font-medium text-gray-400">Gongfu Notes</span>
                    <p className="mt-1 text-sm text-gray-300">{tea.brewing.gongfuStyle.notes}</p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Caffeine & Energy */}
          <section>
            <h2 className="mb-4 border-b border-gray-700 pb-2 text-2xl font-semibold text-gray-100 md:text-3xl">
              Caffeine & Energy
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                <span className="block text-xs font-medium text-gray-400">Caffeine Level</span>
                <span className="mt-1 block text-lg font-semibold text-gray-100">{getCaffeineLabel(tea.caffeine.level)}</span>
                {tea.caffeine.mgPerCup && (
                  <span className="block text-sm text-gray-400">{tea.caffeine.mgPerCup}</span>
                )}
              </div>
              {tea.caffeine.lTheanine && (
                <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                  <span className="block text-xs font-medium text-gray-400">L-Theanine</span>
                  <span className="mt-1 block text-sm text-gray-300">{tea.caffeine.lTheanine}</span>
                </div>
              )}
            </div>
            {tea.caffeine.energyNotes && (
              <div className="mt-4 rounded-lg border border-gray-700 bg-gray-900 p-4">
                <span className="block text-xs font-medium text-gray-400">Energy Profile</span>
                <p className="mt-1 text-sm text-gray-300">{tea.caffeine.energyNotes}</p>
              </div>
            )}
          </section>

          {/* Health Benefits */}
          <section>
            <h2 className="mb-4 border-b border-gray-700 pb-2 text-2xl font-semibold text-gray-100 md:text-3xl">
              Health Benefits
            </h2>

            {tea.health.primaryBenefits.length > 0 && (
              <ul className="space-y-3">
                {tea.health.primaryBenefits.map((benefit, i) => (
                  <li
                    key={i}
                    className="flex gap-3 rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-gray-300"
                  >
                    <span className="mt-0.5 flex-shrink-0 text-accent-400">&#10003;</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            )}

            {tea.health.antioxidants && (
              <div className="mt-6 rounded-lg border border-gray-700 bg-gray-900 p-4">
                <span className="block text-xs font-medium text-gray-400">Antioxidant Profile</span>
                <p className="mt-1 text-sm text-gray-300">{tea.health.antioxidants}</p>
              </div>
            )}

            {tea.health.traditionalUses && (
              <div className="mt-4 rounded-lg border border-gray-700 bg-gray-900 p-4">
                <span className="block text-xs font-medium text-gray-400">Traditional Uses</span>
                <p className="mt-1 text-sm text-gray-300">{tea.health.traditionalUses}</p>
              </div>
            )}

            {tea.health.modernResearch && (
              <div className="mt-4 rounded-lg border border-gray-700 bg-gray-900 p-4">
                <span className="block text-xs font-medium text-gray-400">Modern Research</span>
                <p className="mt-1 text-sm text-gray-300">{tea.health.modernResearch}</p>
              </div>
            )}

            {tea.health.cautions && (
              <Callout variant="warning" title="Cautions" className="mt-6">
                <p>{tea.health.cautions}</p>
              </Callout>
            )}
          </section>

          {/* Grading */}
          {tea.grading && (
            <section>
              <h2 className="mb-4 border-b border-gray-700 pb-2 text-2xl font-semibold text-gray-100 md:text-3xl">
                Grading
              </h2>
              <div className="space-y-4">
                {tea.grading.system && (
                  <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                    <span className="block text-xs font-medium text-gray-400">Grading System</span>
                    <span className="mt-1 block text-sm text-gray-300">{tea.grading.system}</span>
                  </div>
                )}
                {tea.grading.grade && (
                  <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                    <span className="block text-xs font-medium text-gray-400">Grade</span>
                    <span className="mt-1 block text-sm text-gray-300">{tea.grading.grade}</span>
                  </div>
                )}
                {tea.grading.gradeExplanation && (
                  <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                    <span className="block text-xs font-medium text-gray-400">Grade Explanation</span>
                    <p className="mt-1 text-sm text-gray-300">{tea.grading.gradeExplanation}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Selection & Storage */}
          {(tea.content.selection || tea.content.storage) && (
            <section>
              {tea.content.selection && (
                <>
                  <h2 className="mb-4 border-b border-gray-700 pb-2 text-2xl font-semibold text-gray-100 md:text-3xl">
                    Selection Guide
                  </h2>
                  <p className="mb-8 leading-relaxed text-gray-300">
                    {tea.content.selection}
                  </p>
                </>
              )}
              {tea.content.storage && (
                <>
                  <h2 className="mb-4 border-b border-gray-700 pb-2 text-2xl font-semibold text-gray-100 md:text-3xl">
                    Storage
                  </h2>
                  <p className="leading-relaxed text-gray-300">
                    {tea.content.storage}
                  </p>
                </>
              )}
            </section>
          )}

          {/* Pairings */}
          {tea.content.pairings && (
            <section>
              <h2 className="mb-4 border-b border-gray-700 pb-2 text-2xl font-semibold text-gray-100 md:text-3xl">
                Food Pairings
              </h2>
              <p className="leading-relaxed text-gray-300">
                {tea.content.pairings}
              </p>
            </section>
          )}

          {/* Variations */}
          {tea.content.variations && (
            <section>
              <h2 className="mb-4 border-b border-gray-700 pb-2 text-2xl font-semibold text-gray-100 md:text-3xl">
                Variations
              </h2>
              <p className="leading-relaxed text-gray-300">
                {tea.content.variations}
              </p>
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
