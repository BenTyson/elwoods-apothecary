interface SourceLinkProps {
  url: string;
}

function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

export function SourceLink({ url }: SourceLinkProps) {
  const domain = extractDomain(url);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-2 rounded-lg border border-moss/50 bg-forest-900/50 px-3 py-2 text-sm transition-colors hover:border-amber hover:bg-moss/20"
    >
      <svg
        className="h-4 w-4 flex-shrink-0 text-sage group-hover:text-amber"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
      <span className="truncate text-mist group-hover:text-cream">{domain}</span>
    </a>
  );
}
