# Architecture

> See also: [INDEX.md](./INDEX.md) | [DATA.md](./DATA.md) | [ROUTES.md](./ROUTES.md)

## System Design

```
┌─────────────────────────────────────────────────┐
│                   Next.js App                    │
├─────────────────────────────────────────────────┤
│  App Router (src/app/)                          │
│  ├── Server Components (default)                │
│  └── Client Components ('use client')           │
├─────────────────────────────────────────────────┤
│  Data Layer (src/lib/data.ts)                   │
│  └── JSON imports with type assertions          │
├─────────────────────────────────────────────────┤
│  Static Data (src/data/*.json)                  │
│  └── plants, categories, conditions, remedies   │
└─────────────────────────────────────────────────┘
```

## Rendering Strategy

| Route | Type | Why |
|-------|------|-----|
| `/` | Static (SSG) | Content doesn't change |
| `/browse` | Client | Interactive filtering |
| `/browse/[slug]` | Static (SSG) | Pre-rendered via `generateStaticParams()` |
| `/learn`, `/tools`, `/shop` | Static | Placeholder pages |

## Data Flow

```
JSON Files → data.ts functions → Components → UI
     ↓              ↓
  types/       TypeScript
  index.ts     validation
```

**Pattern**: No runtime data fetching. All data imported statically from JSON at build time.

## Key Patterns

### 1. Server/Client Split
- **Server Components** (default): Layout, home, plant detail
- **Client Components**: Browse page (needs `useState` for filters)

### 2. Static Generation
```typescript
// src/app/browse/[slug]/page.tsx
export function generateStaticParams() {
  return getAllPlants().map(plant => ({ slug: plant.id }));
}
```

### 3. Type-Safe Data Access
```typescript
// JSON imported through unknown for safety
import plantsData from '@/data/plants.json';
const plants = plantsData as unknown as Plant[];
```

### 4. Component Variants
```typescript
// Pattern used by Button, Pill, Callout
interface Props {
  variant?: 'primary' | 'secondary' | 'parchment';
  size?: 'sm' | 'md' | 'lg';
}
```

## Path Alias

```typescript
// tsconfig.json: "@/*" → "./src/*"
import { Button } from '@/components';
import { getAllPlants } from '@/lib/data';
```

## Dependencies

| Package | Purpose |
|---------|---------|
| `next` 16.x | Framework |
| `react` 19.x | UI library |
| `clsx` | Class conditionals |
| `tailwind-merge` | Merge Tailwind classes |

## File Responsibilities

| File | Single Responsibility |
|------|----------------------|
| `layout.tsx` | Wrap pages with Header/Footer |
| `data.ts` | All data queries |
| `types/index.ts` | All interfaces |
| `globals.css` | All design tokens |
