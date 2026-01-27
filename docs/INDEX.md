# El Woods Apothecary - Agent Documentation

> **Last Updated**: 2026-01-27
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
- `/gather` skill supporting 8 content types
- Gather queue seeded with 50 common medicinal plants (Duke-referenced)

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
| `src/data/gather-queue.json` | Gather queue (50 plants seeded) |
| `src/types/index.ts` | All TypeScript interfaces (50+ types) |
| `src/app/globals.css` | Design tokens (100+ CSS vars) |
| `src/components/index.ts` | Component barrel exports |
| `src/data/staging/` | Staged data from `/gather` skill |
| `src/data/reference/duke-plants.json` | Duke phytochemical reference (2,336 plants) |
| `scripts/build-duke-reference.js` | Builds Duke reference from CSV data |
| `.claude/commands/` | Claude Code skills (gather, update-phase) |

---

## Next Steps

### 1. Seed remaining gather queue categories

The plants tab has 50 items seeded. The other 7 content types need similar starter lists added to `src/data/gather-queue.json`. Curate ~15-30 common items per type:

| Type | Target Count | Seed Strategy |
|------|-------------|---------------|
| `condition` | ~25 | Common ailments: anxiety, insomnia, headache, eczema, IBS, etc. Use `slugify()` for IDs |
| `remedy` | ~20 | Classic formulas: fire cider, four thieves vinegar, sleep tincture, etc. |
| `ingredient` | ~20 | Carrier oils (jojoba, olive), waxes (beeswax), solvents (alcohol, glycerin), etc. |
| `preparation` | ~10 | One per PreparationType: tea, decoction, tincture, salve, oil, syrup, poultice, capsule, compress, bath |
| `action` | ~25 | Core herbal actions: adaptogen, nervine, carminative, demulcent, expectorant, etc. Cross-reference `categories.json` actions list |
| `term` | ~20 | Key herbalism terms: menstruum, decoction, infusion, simples, materia medica, etc. |
| `tea` | ~15 | Major varieties: longjing, sencha, gyokuro, da hong pao, pu-erh, darjeeling, etc. |

**Pattern to follow** (same as plant seeding):
1. Curate a list of well-known items for the type
2. Generate IDs via `slugify(name)` — e.g., `"fire-cider"` for "Fire Cider"
3. Append to the `items` array in `gather-queue.json`
4. Set `type` to the content type, `addedAt` to today's date
5. No `dukeRef` needed for non-plant types

### 2. Resolve staging ID mismatch

**Issue**: The gather queue uses Duke Latin-name slugs as plant IDs (e.g., `salvia-officinalis`), but staging files use common-name slugs (e.g., `sage.json`). The status computation checks `${item.id}.json` in the staging directory, so `salvia-officinalis` won't match `sage.json` and will incorrectly show as "queued" instead of "staged".

**Options**:
- (a) Add an ID alias/mapping in `computeItemStatus` that checks the staged file's `id` field
- (b) Rename staged files to match Duke slugs
- (c) Add a reverse lookup: scan staging files and match by `latinName` or `commonName`

This only affects plants added via the Duke browser. Items added manually (via `ManualEntryForm`) will use `slugify(name)` which matches the staging convention.
