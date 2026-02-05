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
│  └── Imports from barrel files (index.ts)       │
├─────────────────────────────────────────────────┤
│  Static Data (src/data/{type}/*.json)           │
│  └── File-per-entry: teas/, plants/, etc.       │
└─────────────────────────────────────────────────┘
```

## Rendering Strategy

| Route | Type | Why |
|-------|------|-----|
| `/` | Static (SSG) | Content doesn't change |
| `/browse` | Client | Interactive filtering (Herbs/Teas tabs) |
| `/browse/[slug]` | Static (SSG) | Pre-rendered via `generateStaticParams()` |
| `/browse/tea/[slug]` | Static (SSG) | Pre-rendered via `generateStaticParams()` |
| `/learn`, `/tools`, `/shop` | Static | Placeholder pages |
| `/admin/staging` | Server + Client | Server fetches staged files, client handles selection UI |
| `/admin/gather` | Dynamic + Client | Server reads queue JSON + Duke index, client handles tabs/search/CRUD |

## Data Flow

```
Per-entry JSON → barrel index.ts → data.ts functions → Components → UI
     ↓                 ↓
  types/          TypeScript
  index.ts        validation

Reference DB  → extract-duke-entry.js → /gather skill (pre-fills plant data)
Gather Queue  → gather-queue.ts → /admin/gather UI (status from directory scan)
```

**Pattern**: No runtime data fetching. All data imported statically from barrel files at build time. Each entry is a standalone JSON file; barrel `index.ts` files aggregate them into typed arrays. Reference data consulted by the `/gather` skill during research.

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
// Barrel files aggregate per-entry JSON with type assertions
// src/data/plants/index.ts
import chamomile from './chamomile.json';
export const plants: Plant[] = [chamomile as unknown as Plant, ...];

// src/lib/data.ts
import { plants } from '@/data/plants';
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
| `types/gather-queue.ts` | Gather queue types |
| `gather-queue.ts` | Gather queue CRUD + status computation |
| `extract-duke-entry.js` | CLI to extract/filter single Duke entry (used by /gather) |
| `globals.css` | All design tokens |
