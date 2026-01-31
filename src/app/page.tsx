import { Button } from '@/components/ui/Button';
import { HerbCard } from '@/components/herbs/HerbCard';
import { getFeaturedPlants } from '@/lib/data';

// Pillar data
const pillars = [
  {
    title: 'KNOW',
    subtitle: 'Information Repository',
    description:
      'A comprehensive database of herbal knowledge, from botanical profiles to traditional uses and modern research.',
    features: [
      'Plant & herb profiles with full monographs',
      'Remedy & recipe database',
      'Condition & ailment guides',
      'Multiple entry points for discovery',
    ],
    href: '/browse',
    cta: 'Browse Herbs',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 2L12 6M12 18L12 22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12L6 12M18 12L22 12M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
  {
    title: 'LEARN',
    subtitle: 'Educational Resource',
    description:
      'Layered depth that serves beginners and practitioners alike, from quick answers to comprehensive deep dives.',
    features: [
      'Quick answers in 30 seconds',
      'Understanding in 5-10 minutes',
      'Deep dives for serious students',
      'Workshops & preparation guides',
    ],
    href: '/learn',
    cta: 'Start Learning',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    title: 'USE',
    subtitle: 'Marketplace',
    description:
      'Curated herbal products from El Woods and local artisans - teas, tinctures, salves, and everything you need.',
    features: [
      'Herbal teas & blends',
      'Tinctures & extracts',
      'Salves, oils & body care',
      'Kits, books & tools',
    ],
    href: '/shop',
    cta: 'Coming Soon',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M9 2h6l1 7h-8l1-7z" />
        <path d="M8 9h8v2a6 6 0 0 1-8 0V9z" />
        <path d="M12 17v5" />
        <path d="M8 22h8" />
      </svg>
    ),
  },
];

export default function Home() {
  const featuredPlants = getFeaturedPlants();

  return (
    <>
      {/* Hero Section */}
      <section className="flex min-h-[85vh] flex-col items-center justify-center px-6 py-20">
        <div className="max-w-4xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-50 md:text-6xl lg:text-7xl">
            El Woods Apothecary
          </h1>

          <p className="mt-4 font-serif text-2xl italic text-gray-400 md:text-3xl">
            The forest provides.
          </p>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-gray-300 md:text-xl">
            Where ancient plant wisdom meets modern understanding. Explore our
            comprehensive herbal knowledge base, learn traditional preparation
            methods, and discover nature&apos;s remedies for everyday wellness.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/browse" size="lg">
              Explore the Herbarium
            </Button>
            <Button href="/learn" variant="secondary" size="lg">
              Start Learning
            </Button>
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-semibold text-gray-100 md:text-5xl">
              Three Pillars
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Knowledge, education, and application - working together to bring
              herbal wisdom into your daily life.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map((pillar) => (
              <article
                key={pillar.title}
                className="group rounded-xl border border-gray-700 bg-gray-900 p-8 transition-colors duration-150 hover:border-gray-600 hover:bg-gray-800"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-900/50 text-accent-400">
                  {pillar.icon}
                </div>

                <h3 className="text-xl font-semibold text-gray-100">
                  {pillar.title}
                </h3>
                <p className="mt-1 text-sm text-accent-400">
                  {pillar.subtitle}
                </p>

                <p className="mt-4 text-gray-300">{pillar.description}</p>

                <ul className="mt-6 space-y-2 text-left">
                  {pillar.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-gray-400"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-600" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Button href={pillar.href} variant="secondary" size="sm">
                    {pillar.cta}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Herbs Section */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-semibold text-gray-100 md:text-5xl">
              Featured in the Herbarium
            </h2>
            <p className="mt-2 text-lg text-gray-400">
              Begin your journey with these essential herbs
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPlants.map((plant) => (
              <HerbCard key={plant.id} plant={plant} featured />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
