import { Button } from '@/components/ui/Button';

export default function LearnPage() {
  const upcomingContent = [
    'Getting Started Guide',
    'Preparation Methods (tinctures, teas, salves)',
    'Safety & Interactions',
    'Articles & Deep Dives',
    'Workshops & Courses',
  ];

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-20 text-center">
      <h1 className="text-5xl font-semibold text-gray-100">Learn</h1>
      <p className="mt-4 text-2xl text-gray-400">
        Educational Resources Coming Soon
      </p>

      <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-gray-300">
        We&apos;re developing comprehensive educational content to help you on
        your herbal journey - from quick answers for beginners to deep dives for
        serious students.
      </p>

      <ul className="mx-auto mt-8 max-w-md space-y-3">
        {upcomingContent.map((item) => (
          <li
            key={item}
            className="flex items-center gap-3 border-b border-gray-800 pb-3 text-gray-400"
          >
            <span className="h-2 w-2 rounded-full bg-gray-600" />
            {item}
          </li>
        ))}
      </ul>

      <Button href="/browse" className="mt-10">
        Explore the Herbarium
      </Button>
    </div>
  );
}
