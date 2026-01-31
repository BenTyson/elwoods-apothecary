import { Button } from '@/components/ui/Button';

const tools = [
  {
    name: 'Remedy Finder',
    description: 'Describe your symptoms and get personalized herb recommendations',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
  },
  {
    name: 'Interaction Checker',
    description: 'Check for contraindications between herbs and medications',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 2L12 22M2 12L22 12" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    name: 'Seasonal Guide',
    description: 'Discover which herbs to focus on each season',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    name: 'Remedy Journal',
    description: 'Track your herbal remedies and what works for you',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 2L12 6M12 18L12 22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07" />
      </svg>
    ),
  },
];

export default function ToolsPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-20 text-center">
      <h1 className="text-5xl font-semibold text-gray-100">Tools</h1>
      <p className="mt-4 text-2xl text-gray-400">
        Interactive Features Coming Soon
      </p>

      <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-gray-300">
        We&apos;re building powerful tools to help you navigate the world of
        herbal medicine - from finding the right remedy to tracking what works
        for you.
      </p>

      <div className="mx-auto mt-12 grid max-w-2xl gap-6 sm:grid-cols-2">
        {tools.map((tool) => (
          <div
            key={tool.name}
            className="rounded-xl border border-gray-700 bg-gray-900 p-6 text-center"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent-900/50 text-accent-400">
              {tool.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-100">
              {tool.name}
            </h3>
            <p className="mt-2 text-sm text-gray-400">{tool.description}</p>
          </div>
        ))}
      </div>

      <Button href="/browse" className="mt-10">
        Explore the Herbarium
      </Button>
    </div>
  );
}
