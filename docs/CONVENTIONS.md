# Conventions

> See also: [INDEX.md](./INDEX.md) | [COMPONENTS.md](./COMPONENTS.md)

## Naming

| Type | Convention | Example |
|------|------------|---------|
| Files (TSX) | PascalCase | `HerbCard.tsx` |
| Files (utils) | camelCase | `data.ts` |
| Components | PascalCase | `export function HerbCard()` |
| Interfaces | PascalCase | `interface Plant {}` |
| Functions | camelCase | `getAllPlants()` |
| Variables | camelCase | `const plantData` |
| CSS classes | Tailwind atomic | `bg-moss text-cream` |
| Union values | kebab-case | `'nervous' \| 'digestive'` |

## Imports

```typescript
// Path alias (preferred)
import { Button } from '@/components';
import { getAllPlants } from '@/lib/data';
import type { Plant } from '@/types';

// Relative only within same directory
import { helper } from './helper';
```

## TypeScript

- **Strict mode enabled** - no implicit any
- **Interfaces over types** for objects
- **Union types** for constrained strings
- **Type imports** with `import type`

```typescript
// Good
interface Props {
  plant: Plant;
  featured?: boolean;
}

// Avoid
type Props = { plant: any; }
```

## Components

### Structure

```typescript
interface ComponentProps {
  // required props first
  required: string;
  // optional props after
  optional?: boolean;
  // always include className for customization
  className?: string;
}

export function Component({ required, optional, className }: ComponentProps) {
  return (
    <div className={cn('base-classes', className)}>
      {/* content */}
    </div>
  );
}
```

### Class Merging

Always use `cn()` for combining classes:

```typescript
import { cn } from '@/lib/utils';

className={cn(
  'base-styles',
  variant === 'primary' && 'primary-styles',
  className
)}
```

## Styling

### Design Tokens

Use CSS variables from `globals.css`:

```css
/* In globals.css */
--color-moss: #2d5a3d;
--color-cream: #faf8f3;

/* In components */
className="bg-moss text-cream"
```

### Responsive

Mobile-first with breakpoints:

```typescript
className="text-sm md:text-base lg:text-lg"
```

## Data Access

- **Never** fetch data directly in components
- **Always** use functions from `src/lib/data.ts`
- **Type assertions** through `unknown` in barrel files

```typescript
// In src/data/plants/index.ts (barrel file)
import chamomile from './chamomile.json';
export const plants: Plant[] = [chamomile as unknown as Plant, ...];

// In src/lib/data.ts
import { plants } from '@/data/plants';

// In components
import { getAllPlants } from '@/lib/data';
const plants = getAllPlants();
```

## File Organization

```
src/
├── app/              # Only page files
├── components/
│   ├── ui/           # Generic reusable
│   ├── layout/       # Header, Footer
│   ├── herbs/        # Herb domain-specific
│   ├── teas/         # Tea domain-specific
│   ├── staging/      # Admin staging review
│   ├── gather/       # Admin gather queue
│   └── index.ts      # Barrel exports
├── lib/              # Utilities, data access
├── types/            # TypeScript only
└── data/             # Content data (file-per-entry)
    ├── teas/         # {id}.json entries + index.ts barrel
    ├── plants/       # {id}.json entries + index.ts barrel
    ├── reference/    # Generated reference data
    └── ...           # conditions/, remedies/, ingredients/, etc.
scripts/              # Build utilities (Node.js)
```

## Git

- Commit messages: imperative mood ("Add feature" not "Added feature")
- One feature per commit
- Run `npm run lint` before committing
