import { notFound } from 'next/navigation';
import { getAllTeas, getTeaById, formatLabel } from '@/lib/data';
import { Pill } from '@/components/ui/Pill';
import { Callout } from '@/components/ui/Callout';
import { HeroPlaceholder } from '@/components/detail/HeroPlaceholder';
import { QuickInfoBar } from '@/components/detail/QuickInfoBar';
import { TableOfContents, type TOCItem } from '@/components/detail/TableOfContents';
import { MobileTOC } from '@/components/detail/MobileTOC';
import { ContentSection } from '@/components/detail/ContentSection';
import { ProseBlock } from '@/components/detail/ProseBlock';
import { DataCard } from '@/components/detail/DataCard';
import { OxidationMeter } from '@/components/detail/OxidationMeter';
import { CaffeineMeter } from '@/components/detail/CaffeineMeter';
import { ProcessingTimeline } from '@/components/detail/ProcessingTimeline';
import { BrewingCard } from '@/components/detail/BrewingCard';
import { FlavorProfile } from '@/components/detail/FlavorProfile';
import { ImageGalleryPlaceholder } from '@/components/detail/ImageGalleryPlaceholder';
import { RelatedTeas } from '@/components/detail/RelatedTeas';

export function generateStaticParams() {
  const teas = getAllTeas();
  return teas.map((tea) => ({ slug: tea.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tea = getTeaById(slug);
  if (!tea) return { title: 'Tea Not Found' };
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

export default async function TeaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tea = getTeaById(slug);
  if (!tea) notFound();

  // Build TOC items dynamically based on available data
  const tocItems: TOCItem[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'origin', label: 'Origin & Terroir' },
    { id: 'flavor', label: 'Flavor & Aroma' },
    { id: 'brewing', label: 'Brewing Guide' },
    { id: 'processing', label: 'Processing' },
    { id: 'caffeine', label: 'Caffeine & Energy' },
    { id: 'health', label: 'Health Benefits' },
  ];

  if (tea.content.history) tocItems.push({ id: 'history', label: 'History' });
  if (tea.content.culture) tocItems.push({ id: 'culture', label: 'Culture' });
  if (tea.grading) tocItems.push({ id: 'grading', label: 'Grading' });
  if (tea.content.selection || tea.content.storage) tocItems.push({ id: 'selection-storage', label: 'Selection & Storage' });
  if (tea.content.pairings) tocItems.push({ id: 'pairings', label: 'Pairings' });
  if (tea.content.variations) tocItems.push({ id: 'variations', label: 'Variations' });
  tocItems.push({ id: 'gallery', label: 'Gallery' });
  tocItems.push({ id: 'related', label: 'Related Teas' });

  const otherNamesStr = tea.otherNames && tea.otherNames.length > 0
    ? `Also known as: ${tea.otherNames.join(', ')}`
    : undefined;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <HeroPlaceholder
        variant="tea"
        name={tea.name}
        meta={otherNamesStr}
        pills={
          <>
            <Pill variant={getTeaTypeVariant(tea.teaType)}>
              {formatLabel(tea.teaType)} Tea
            </Pill>
            <span className="text-sm text-gray-400">{tea.origin.country}</span>
            {tea.origin.region && (
              <span className="text-sm text-gray-500">{tea.origin.region}</span>
            )}
          </>
        }
      />

      {/* Quick Info Bar */}
      <QuickInfoBar
        className="-mt-1"
        items={[
          { label: 'Caffeine', value: getCaffeineLabel(tea.caffeine.level), subValue: tea.caffeine.mgPerCup },
          { label: 'Water Temp', value: tea.brewing.waterTemp },
          { label: 'Steep Time', value: tea.brewing.steepTime },
          { label: 'Leaf Ratio', value: tea.brewing.leafRatio },
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
              <ProseBlock text={tea.content.overview} lead showPullQuote />
            </ContentSection>

            {/* 2. Origin & Terroir */}
            <ContentSection id="origin" title="Origin & Terroir">
              <div className="grid gap-3 sm:grid-cols-2">
                <DataCard label="Country" value={tea.origin.country} />
                {tea.origin.region && <DataCard label="Region" value={tea.origin.region} />}
                {tea.origin.terroir && <DataCard label="Terroir" value={tea.origin.terroir} />}
                {tea.origin.harvest && <DataCard label="Harvest" value={tea.origin.harvest} />}
              </div>
            </ContentSection>

            {/* 3. Flavor & Aroma */}
            <ContentSection id="flavor" title="Flavor & Aroma">
              <FlavorProfile profile={tea.profile} />
            </ContentSection>

            {/* 4. Brewing Guide */}
            <ContentSection id="brewing" title="Brewing Guide">
              <BrewingCard brewing={tea.brewing} />
            </ContentSection>

            {/* 5. Processing */}
            <ContentSection id="processing" title="Processing">
              <div className="space-y-6">
                {tea.content.production && (
                  <ProseBlock text={tea.content.production} />
                )}

                <OxidationMeter level={tea.processing.oxidationLevel} />

                {tea.processing.steps.length > 0 && (
                  <div>
                    <h3 className="mb-4 text-[11px] font-medium uppercase tracking-wider text-gray-500">
                      Processing Steps
                    </h3>
                    <ProcessingTimeline steps={tea.processing.steps} />
                  </div>
                )}

                {/* Roast & Aging data cards */}
                <div className="flex flex-wrap gap-3">
                  {tea.processing.roastLevel && tea.processing.roastLevel !== 'none' && (
                    <DataCard label="Roast Level" value={formatLabel(tea.processing.roastLevel)} />
                  )}
                  {tea.processing.aged && (
                    <DataCard label="Aged" value={tea.processing.agingNotes || 'Yes'} />
                  )}
                  {tea.processing.fermented && (
                    <DataCard label="Fermented" value="Microbial fermentation" />
                  )}
                </div>
              </div>
            </ContentSection>

            {/* 6. Caffeine & Energy */}
            <ContentSection id="caffeine" title="Caffeine & Energy">
              <div className="space-y-6">
                <CaffeineMeter level={tea.caffeine.level} />

                <div className="grid gap-3 sm:grid-cols-2">
                  {tea.caffeine.mgPerCup && (
                    <DataCard label="Caffeine per Cup" value={tea.caffeine.mgPerCup} mono />
                  )}
                  {tea.caffeine.lTheanine && (
                    <DataCard label="L-Theanine" value={tea.caffeine.lTheanine} />
                  )}
                </div>

                {tea.caffeine.energyNotes && (
                  <div className="rounded-lg border border-gray-700/50 bg-gray-900/50 p-4">
                    <span className="block text-[11px] font-medium uppercase tracking-wider text-gray-500">
                      Energy Profile
                    </span>
                    <p className="mt-1.5 text-sm text-gray-300">{tea.caffeine.energyNotes}</p>
                  </div>
                )}
              </div>
            </ContentSection>

            {/* 7. Health Benefits */}
            <ContentSection id="health" title="Health Benefits">
              <div className="space-y-6">
                {tea.health.primaryBenefits.length > 0 && (
                  <ul className="space-y-2">
                    {tea.health.primaryBenefits.map((benefit, i) => (
                      <li
                        key={i}
                        className="flex gap-3 rounded-lg border border-gray-700/50 bg-gray-900/50 px-4 py-3 text-sm text-gray-300"
                      >
                        <span className="mt-0.5 flex-shrink-0 text-accent-400">&#10003;</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                )}

                {tea.health.antioxidants && (
                  <ProseBlock text={tea.health.antioxidants} />
                )}

                {tea.health.modernResearch && (
                  <ProseBlock text={tea.health.modernResearch} />
                )}

                {tea.health.cautions && (
                  <Callout variant="warning" title="Cautions">
                    <p>{tea.health.cautions}</p>
                  </Callout>
                )}
              </div>
            </ContentSection>

            {/* 8. History (conditional) */}
            {tea.content.history && (
              <ContentSection id="history" title="History">
                <ProseBlock text={tea.content.history} showPullQuote />
              </ContentSection>
            )}

            {/* 9. Culture (conditional) */}
            {tea.content.culture && (
              <ContentSection id="culture" title="Culture">
                <ProseBlock text={tea.content.culture} showPullQuote />
              </ContentSection>
            )}

            {/* 10. Grading (conditional) */}
            {tea.grading && (
              <ContentSection id="grading" title="Grading">
                <div className="grid gap-3 sm:grid-cols-2">
                  {tea.grading.system && <DataCard label="Grading System" value={tea.grading.system} />}
                  {tea.grading.grade && <DataCard label="Grade" value={tea.grading.grade} />}
                </div>
                {tea.grading.gradeExplanation && (
                  <ProseBlock text={tea.grading.gradeExplanation} className="mt-4" />
                )}
              </ContentSection>
            )}

            {/* 11. Selection & Storage (conditional) */}
            {(tea.content.selection || tea.content.storage) && (
              <ContentSection id="selection-storage" title="Selection & Storage">
                <div className="space-y-6">
                  {tea.content.selection && <ProseBlock text={tea.content.selection} />}
                  {tea.content.storage && <ProseBlock text={tea.content.storage} />}
                </div>
              </ContentSection>
            )}

            {/* 12. Pairings (conditional) */}
            {tea.content.pairings && (
              <ContentSection id="pairings" title="Pairings">
                <ProseBlock text={tea.content.pairings} />
              </ContentSection>
            )}

            {/* 13. Variations (conditional) */}
            {tea.content.variations && (
              <ContentSection id="variations" title="Variations">
                <ProseBlock text={tea.content.variations} />
              </ContentSection>
            )}

            {/* 14. Gallery */}
            <ContentSection id="gallery" title="Gallery">
              <ImageGalleryPlaceholder
                labels={['Dry Leaf', 'Brewed Liquor', 'Tea Ware', 'Origin Region']}
              />
            </ContentSection>

            {/* 15. Related Teas */}
            <ContentSection id="related" title="Related Teas">
              <RelatedTeas currentTeaId={tea.id} />
            </ContentSection>
          </div>
        </div>
      </div>

      {/* Mobile TOC */}
      <MobileTOC items={tocItems} />
    </div>
  );
}
