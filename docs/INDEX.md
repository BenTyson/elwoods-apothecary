# El Woods Apothecary - Agent Documentation

> **Last Updated**: 2026-01-28
> **Version**: 0.1.0

## Session-Start Protocol

**Run these commands on every new session:**

```bash
# 1. Verify environment
node -v && npm -v

# 2. Check for uncommitted changes
git status

# 3. Install deps if needed (check node_modules exists)
ls node_modules > /dev/null 2>&1 || npm install

# 4. Start dev server (if doing UI work)
npm run dev  # → http://localhost:5588
```

**Quick Context Load Order:**
1. This file (INDEX.md) - orientation
2. [ARCHITECTURE.md](./ARCHITECTURE.md) - system design
3. Specific doc based on task:
   - UI work → [COMPONENTS.md](./COMPONENTS.md)
   - Data/API work → [DATA.md](./DATA.md)
   - New pages → [ROUTES.md](./ROUTES.md)
   - Code style questions → [CONVENTIONS.md](./CONVENTIONS.md)

---

## Project Overview

**El Woods Apothecary** - Herbal knowledge web app
**Stack**: Next.js 16 + React 19 + TypeScript + Tailwind v4
**Port**: 5588

### Directory Map

```
src/
├── app/           # Pages (App Router)
├── components/    # Reusable UI
├── lib/           # Data layer + utils
├── types/         # TypeScript interfaces
└── data/          # JSON content (plants, categories, etc.)
    ├── reference/ # Dr. Duke's phytochemical reference (CC0)
    └── staging/   # Staged data from /gather skill
scripts/           # Build utilities (not part of Next.js app)
```

### Key Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server (port 5588) |
| `npm run build` | Production build |
| `npm run lint` | ESLint check |

---

## Documentation Index

| Doc | Purpose | Read When |
|-----|---------|-----------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design, patterns, data flow | Starting any task |
| [COMPONENTS.md](./COMPONENTS.md) | UI component API reference | Building UI |
| [DATA.md](./DATA.md) | Data layer, types, JSON schemas | Working with data |
| [ROUTES.md](./ROUTES.md) | Page structure, routing | Adding/modifying pages |
| [CONVENTIONS.md](./CONVENTIONS.md) | Code style, naming, patterns | Writing new code |

---

## Current State

### Implemented
- Home page with hero, pillars, featured plants
- Browse page with multi-filter search
- Dynamic plant detail pages (SSR)
- Admin staging review page (`/admin/staging`)
- Admin gather queue page (`/admin/gather`) — 8 content-type tabs, Duke plant browser, manual entry
- 13 reusable UI components (including staging + gather components)
- Comprehensive type system (8 content types)
- `/gather` skill supporting 8 content types + queue commands (`--next`, `--queue`)
- `/gather` includes per-type validation checklists (combinations, harvesting, cultivation, content length targets)
- `/gather` Duke constituent curation rules (distills 400+ raw compounds → 15-25 curated entries)
- `/gather` adaptive search (8 core + conditional + Duke-adaptive = 8-12 searches per plant)
- `/gather` queue awareness on manual runs (detects when item is in queue)
- Gather queue seeded with 187 items across all 8 content types (plants, teas, conditions, remedies, ingredients, preparations, actions, terms)

### Placeholders (Not Yet Built)
- `/learn` - Educational content
- `/tools` - Interactive tools
- `/shop` - Marketplace

---

## Critical Files

| File | Why It Matters |
|------|----------------|
| `src/lib/data.ts` | All data access functions |
| `src/lib/staging.ts` | Staging data access functions |
| `src/lib/gather-queue.ts` | Gather queue CRUD + status computation |
| `src/data/gather-queue.json` | Gather queue (187 items across all 8 content types) |
| `src/types/index.ts` | All TypeScript interfaces (50+ types) |
| `src/app/globals.css` | Design tokens (100+ CSS vars) |
| `src/components/index.ts` | Component barrel exports |
| `src/data/staging/` | Staged data from `/gather` skill |
| `src/data/reference/duke-plants.json` | Duke phytochemical reference (2,336 plants) |
| `scripts/build-duke-reference.js` | Builds Duke reference from CSV data |
| `.claude/commands/` | Claude Code skills (gather, update-phase) |

---

## Next Steps

*No known blockers. The staging ID mismatch (Latin-name queue IDs vs common-name file slugs) was resolved — `getStagedIds()` in `gather-queue.ts` now indexes staged files by basename, `id` field, and `slugify(latinName)`, so status computation works regardless of naming scheme.*
