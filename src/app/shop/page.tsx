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
      <h1 className="text-5xl font-semibold text-gray-100">Shop</h1>
      <p className="mt-4 text-2xl text-gray-400">
        Marketplace Coming Soon
      </p>

      <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-gray-300">
        We&apos;re curating a collection of high-quality herbal products from El
        Woods and local artisans. From herbal teas to tinctures and salves,
        everything you need for your home apothecary.
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <span
            key={category}
            className="rounded-md border border-gray-700 bg-gray-900 px-5 py-2 text-gray-200"
          >
            {category}
          </span>
        ))}
      </div>

      <Button href="/browse" className="mt-10">
        Explore the Herbarium
      </Button>

      <p className="mt-6 text-sm text-gray-500">Products will range from $12-$85</p>
    </div>
  );
}
