import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPlants, getPlantById, formatLabel } from '@/lib/data';
import { Pill, getSystemVariant } from '@/components/ui/Pill';
import { Callout } from '@/components/ui/Callout';
import { HeroPlaceholder } from '@/components/detail/HeroPlaceholder';
import { QuickInfoBar } from '@/components/detail/QuickInfoBar';
import { TableOfContents, type TOCItem } from '@/components/detail/TableOfContents';
import { MobileTOC } from '@/components/detail/MobileTOC';
import { ContentSection } from '@/components/detail/ContentSection';
import { ProseBlock } from '@/components/detail/ProseBlock';
import { DataCard } from '@/components/detail/DataCard';
import { ImageGalleryPlaceholder } from '@/components/detail/ImageGalleryPlaceholder';
import { RelatedPlants } from '@/components/detail/RelatedPlants';

export function generateStaticParams() {
  const plants = getAllPlants();
  return plants.map((plant) => ({ slug: plant.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const plant = getPlantById(slug);
  if (!plant) return { title: 'Plant Not Found' };
  return {
    title: `${plant.commonName} | El Woods Apothecary`,
    description: plant.content.overview.substring(0, 160),
  };
}

export default async function PlantPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const plant = getPlantById(slug);
  if (!plant) notFound();

  // Build TOC items dynamically
  const tocItems: TOCItem[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'actions-systems', label: 'Actions & Body Systems' },
    { id: 'traditional', label: 'Traditional Uses' },
    { id: 'research', label: 'Modern Research' },
    { id: 'how-to-use', label: 'How to Use' },
  ];

  if (plant.constituents && plant.constituents.length > 0) {
    tocItems.push({ id: 'constituents', label: 'Key Constituents' });
  }
  tocItems.push({ id: 'safety', label: 'Safety' });
  if (plant.combinations && plant.combinations.length > 0) {
    tocItems.push({ id: 'combinations', label: 'Synergistic Combinations' });
  }
  if (plant.content.harvesting || plant.content.cultivation) {
    tocItems.push({ id: 'harvesting', label: 'Harvesting & Cultivation' });
  }
  if (plant.content.history) {
    tocItems.push({ id: 'history', label: 'History' });
  }
  if (plant.content.nativeRange || plant.content.taxonomy || plant.content.morphology) {
    tocItems.push({ id: 'botanical', label: 'Botanical Details' });
  }
  tocItems.push({ id: 'gallery', label: 'Gallery' });
  tocItems.push({ id: 'related', label: 'Related Plants' });

  const otherNamesStr = plant.otherNames && plant.otherNames.length > 0
    ? `Also known as: ${plant.otherNames.join(', ')}`
    : undefined;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <HeroPlaceholder
        variant="plant"
        name={plant.commonName}
        subtitle={plant.latinName}
        meta={otherNamesStr}
        pills={
          <span className="text-sm text-accent-400">{plant.family}</span>
        }
      />

      {/* Quick Info Bar */}
      <QuickInfoBar
        className="-mt-1"
        items={[
          { label: 'Parts Used', value: plant.partsUsed.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(', ') },
          { label: 'Taste', value: plant.taste },
          { label: 'Energy', value: plant.energy },
        ]}
      />

      {/* Main content with sidebar TOC */}
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex gap-12">
          {/* Sidebar TOC */}
          <aside className="w-48 flex-shrink-0">
            <TableOfContents items={tocItems} />
          </aside>

          {/* Content column */}
          <div className="min-w-0 flex-1 space-y-16">
            {/* 1. Overview */}
            <ContentSection id="overview" title="Overview">
              <ProseBlock text={plant.content.overview} lead showPullQuote />
            </ContentSection>

            {/* 2. Actions & Body Systems */}
            <ContentSection id="actions-systems" title="Actions & Body Systems">
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-[11px] font-medium uppercase tracking-wider text-gray-500">
                    Body Systems
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {plant.bodySystems.map((system) => (
                      <Pill key={system} variant={getSystemVariant(system)}>
                        {formatLabel(system)}
                      </Pill>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-[11px] font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {plant.actions.map((action) => (
                      <Pill key={action} variant="preparation">
                        {formatLabel(action)}
                      </Pill>
                    ))}
                  </div>
                </div>

                {plant.conditions.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-[11px] font-medium uppercase tracking-wider text-gray-500">
                      Conditions
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {plant.conditions.map((condition) => (
                        <Pill key={condition} variant="default">
                          {formatLabel(condition)}
                        </Pill>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ContentSection>

            {/* 3. Traditional Uses */}
            <ContentSection id="traditional" title="Traditional Uses">
              <ProseBlock text={plant.content.traditionalUses} showPullQuote />
            </ContentSection>

            {/* 4. Modern Research */}
            <ContentSection id="research" title="Modern Research">
              <ProseBlock text={plant.content.modernResearch} showPullQuote />
            </ContentSection>

            {/* 5. How to Use */}
            <ContentSection id="how-to-use" title="How to Use">
              <div className="space-y-6">
                <ProseBlock text={plant.content.howToUse} />

                {/* Dosage Grid */}
                {Object.keys(plant.dosage).length > 0 && (
                  <div>
                    <h3 className="mb-3 text-[11px] font-medium uppercase tracking-wider text-gray-500">
                      Dosage
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {Object.entries(plant.dosage).map(([type, dose]) => (
                        <DataCard key={type} label={formatLabel(type)} value={dose} mono />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ContentSection>

            {/* 6. Key Constituents (conditional) */}
            {plant.constituents && plant.constituents.length > 0 && (
              <ContentSection id="constituents" title="Key Constituents">
                <ul className="grid gap-2 sm:grid-cols-2">
                  {plant.constituents.map((constituent) => (
                    <li
                      key={constituent}
                      className="rounded-lg border border-gray-700/50 bg-gray-900/50 px-4 py-2.5 text-sm text-gray-300"
                    >
                      {constituent}
                    </li>
                  ))}
                </ul>
              </ContentSection>
            )}

            {/* 7. Safety */}
            <ContentSection id="safety" title="Safety">
              <div className="space-y-6">
                <p className="text-sm leading-relaxed text-gray-300">
                  {plant.safety.generalSafety}
                </p>

                {plant.safety.contraindications.length > 0 && (
                  <Callout variant="warning" title="Contraindications">
                    <ul className="ml-4 list-disc space-y-1">
                      {plant.safety.contraindications.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </Callout>
                )}

                {plant.safety.drugInteractions.length > 0 && (
                  <Callout variant="danger" title="Drug Interactions">
                    <ul className="ml-4 list-disc space-y-1">
                      {plant.safety.drugInteractions.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </Callout>
                )}

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
              </div>
            </ContentSection>

            {/* 8. Synergistic Combinations (conditional) */}
            {plant.combinations && plant.combinations.length > 0 && (
              <ContentSection id="combinations" title="Synergistic Combinations">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {plant.combinations.map((combo) => (
                    <Link
                      key={combo.herb}
                      href={`/browse/${combo.herb}`}
                      className="group rounded-xl border border-gray-700/50 bg-gray-900/50 p-4 transition-colors hover:border-gray-600 hover:bg-gray-800/50"
                    >
                      <span className="text-lg font-semibold text-accent-400 transition-colors group-hover:text-accent-300">
                        {formatLabel(combo.herb)}
                      </span>
                      <p className="mt-1 text-sm text-gray-400">{combo.purpose}</p>
                    </Link>
                  ))}
                </div>
              </ContentSection>
            )}

            {/* 9. Harvesting & Cultivation (conditional) */}
            {(plant.content.harvesting || plant.content.cultivation) && (
              <ContentSection id="harvesting" title="Harvesting & Cultivation">
                <div className="space-y-6">
                  {plant.content.harvesting && <ProseBlock text={plant.content.harvesting} />}
                  {plant.content.cultivation && <ProseBlock text={plant.content.cultivation} />}
                </div>
              </ContentSection>
            )}

            {/* 10. History (conditional) */}
            {plant.content.history && (
              <ContentSection id="history" title="History">
                <ProseBlock text={plant.content.history} showPullQuote />
              </ContentSection>
            )}

            {/* 11. Botanical Details (conditional) */}
            {(plant.content.nativeRange || plant.content.taxonomy || plant.content.morphology) && (
              <ContentSection id="botanical" title="Botanical Details">
                <div className="space-y-6">
                  {plant.content.nativeRange && (
                    <div>
                      <h3 className="mb-2 text-[11px] font-medium uppercase tracking-wider text-gray-500">
                        Native Range
                      </h3>
                      <ProseBlock text={plant.content.nativeRange} />
                    </div>
                  )}
                  {plant.content.taxonomy && (
                    <div>
                      <h3 className="mb-2 text-[11px] font-medium uppercase tracking-wider text-gray-500">
                        Taxonomy
                      </h3>
                      <ProseBlock text={plant.content.taxonomy} />
                    </div>
                  )}
                  {plant.content.morphology && (
                    <div>
                      <h3 className="mb-2 text-[11px] font-medium uppercase tracking-wider text-gray-500">
                        Morphology
                      </h3>
                      <ProseBlock text={plant.content.morphology} />
                    </div>
                  )}
                </div>
              </ContentSection>
            )}

            {/* 12. Gallery */}
            <ContentSection id="gallery" title="Gallery">
              <ImageGalleryPlaceholder
                labels={['Fresh Plant', 'Dried Herb', 'Preparation', 'Growing Habitat']}
              />
            </ContentSection>

            {/* 13. Related Plants */}
            <ContentSection id="related" title="Related Plants">
              <RelatedPlants currentPlantId={plant.id} />
            </ContentSection>
          </div>
        </div>
      </div>

      {/* Mobile TOC */}
      <MobileTOC items={tocItems} />
    </div>
  );
}
