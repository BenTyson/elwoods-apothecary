import { Button } from '@/components/ui/Button';

const categories = [
  'Herbal Teas & Blends',
  'Tinctures & Extracts',
  'Salves & Oils',
  'Kits & Bundles',
  'Books & Tools',
];

export default function ShopPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-20 text-center">
      <h1 className="font-display text-5xl font-semibold text-cream">Shop</h1>
      <p className="mt-4 font-remedy text-2xl text-gold">
        Marketplace Coming Soon
      </p>

      <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-mist">
        We&apos;re curating a collection of high-quality herbal products from El
        Woods and local artisans. From herbal teas to tinctures and salves,
        everything you need for your home apothecary.
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <span
            key={category}
            className="rounded-full border border-amber bg-amber/10 px-5 py-2 font-display text-gold"
          >
            {category}
          </span>
        ))}
      </div>

      <Button href="/browse" className="mt-10">
        Explore the Herbarium
      </Button>

      <p className="mt-6 text-sm text-sage">Products will range from $12-$85</p>
    </div>
  );
}
