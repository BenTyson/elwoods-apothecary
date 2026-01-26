import { Button } from '@/components/ui/Button';
import { HerbCard } from '@/components/herbs/HerbCard';
import { getFeaturedPlants } from '@/lib/data';

// Pillar data
const pillars = [
  {
    title: 'KNOW',
    subtitle: 'Information Repository',
    description:
      'A beautifully designed database of herbal knowledge, from botanical profiles to traditional uses and modern research.',
    features: [
      'Plant & herb profiles with full monographs',
      'Remedy & recipe database',
      'Condition & ailment guides',
      'Multiple entry points for discovery',
    ],
    href: '/browse',
    cta: 'Browse Herbs',
    icon: (
      <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth={1.5}>
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
      <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth={1.5}>
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
      <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth={1.5}>
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
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 py-20">
        {/* Background radial gradients */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[30%] top-[20%] h-[500px] w-[500px] rounded-full bg-amber/10 blur-3xl" />
          <div className="absolute bottom-[20%] right-[30%] h-[400px] w-[400px] rounded-full bg-moss/20 blur-3xl" />
        </div>

        {/* Decorative botanical corners would go here */}

        <div className="relative z-10 max-w-4xl text-center">
          {/* Apothecary Emblem */}
          <div className="mx-auto mb-8 h-28 w-28">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              {/* Mortar base */}
              <path
                d="M25 70 Q20 70 20 65 L20 55 Q20 45 35 45 L65 45 Q80 45 80 55 L80 65 Q80 70 75 70 Z"
                fill="none"
                stroke="#c49a3d"
                strokeWidth="2"
              />
              {/* Pestle */}
              <path
                d="M50 30 L50 55"
                stroke="#c49a3d"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <ellipse
                cx="50"
                cy="28"
                rx="8"
                ry="4"
                fill="none"
                stroke="#c49a3d"
                strokeWidth="2"
              />
              {/* Decorative leaves */}
              <path
                d="M30 40 Q20 30 25 20 Q30 30 35 35"
                fill="none"
                stroke="#8fb996"
                strokeWidth="1.5"
              />
              <path
                d="M70 40 Q80 30 75 20 Q70 30 65 35"
                fill="none"
                stroke="#8fb996"
                strokeWidth="1.5"
              />
              {/* Berries */}
              <circle cx="25" cy="20" r="3" fill="#4a3b5c" />
              <circle cx="75" cy="20" r="3" fill="#4a3b5c" />
              {/* Stars */}
              <circle cx="15" cy="50" r="1.5" fill="#c49a3d" />
              <circle cx="85" cy="50" r="1.5" fill="#c49a3d" />
              <circle cx="50" cy="15" r="2" fill="#c49a3d" />
            </svg>
          </div>

          <h1 className="font-display text-5xl font-semibold tracking-wide text-cream md:text-6xl lg:text-7xl">
            El Woods Apothecary
          </h1>

          <p className="mt-4 font-remedy text-2xl italic text-gold md:text-3xl">
            &ldquo;The forest provides.&rdquo;
          </p>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-mist md:text-xl">
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
      <section className="bg-gradient-to-b from-forest-950 to-deep-forest px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="font-display text-4xl font-semibold text-cream">
              Three Pillars of the Apothecary
            </h2>
            <p className="mt-4 text-lg text-sage">
              Knowledge, education, and application - working together to bring
              herbal wisdom into your daily life.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {pillars.map((pillar) => (
              <article
                key={pillar.title}
                className="group relative overflow-hidden rounded-2xl border border-moss bg-deep-forest/60 p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:border-amber hover:shadow-xl"
              >
                {/* Top accent */}
                <div className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-amber to-gold transition-transform duration-300 group-hover:scale-x-100" />

                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-amber bg-amber/10 text-gold">
                  {pillar.icon}
                </div>

                <h3 className="font-display text-2xl font-semibold text-cream">
                  {pillar.title}
                </h3>
                <p className="mt-1 font-remedy text-lg text-gold">
                  {pillar.subtitle}
                </p>

                <p className="mt-4 text-mist">{pillar.description}</p>

                <ul className="mt-6 space-y-2 text-left">
                  {pillar.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-sage"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-dried-herb" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Button href={pillar.href} variant="secondary">
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
            <h2 className="font-display text-4xl font-semibold text-cream">
              Featured in the Herbarium
            </h2>
            <p className="mt-2 font-remedy text-xl text-gold">
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

      {/* Quote Section */}
      <section className="bg-gradient-to-br from-amber/10 to-deep-forest/90 px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <blockquote className="font-display text-2xl italic leading-relaxed text-cream md:text-3xl">
            &ldquo;The art of healing comes from nature, not from the physician.
            Therefore the physician must start from nature, with an open
            mind.&rdquo;
          </blockquote>
          <cite className="mt-6 block font-remedy text-lg not-italic text-gold">
            - Paracelsus
          </cite>
        </div>
      </section>
    </>
  );
}
