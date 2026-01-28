# Data Layer

> See also: [INDEX.md](./INDEX.md) | [ARCHITECTURE.md](./ARCHITECTURE.md)

## Data Files

| File | Content | ~Size |
|------|---------|-------|
| `src/data/plants.json` | Herb database | 20KB+ |
| `src/data/categories.json` | Taxonomy (body systems, preparations, actions, traditions) | 5KB |
| `src/data/conditions.json` | Ailment guides | 8KB |
| `src/data/remedies.json` | Recipe database | 10KB |
| `src/data/ingredients.json` | Non-plant materials (carrier oils, waxes, etc.) | varies |
| `src/data/preparations.json` | Method guides (how to make tinctures, etc.) | varies |
| `src/data/actions.json` | Herbal action definitions | varies |
| `src/data/glossary.json` | Herbal terminology | varies |
| `src/data/teas.json` | Tea varieties (Camellia sinensis) | varies |
| `src/data/reference/duke-plants.json` | Dr. Duke's phytochemical reference (2,336 plants, CC0) | 3.4MB |
| `src/data/gather-queue.json` | Gather queue (187 items across all 8 content types, status computed at read time) | 20KB+ |
| `src/data/staging/` | Staged data awaiting review (see Gather Skill below) | varies |

---

## Query Functions

**File**: `src/lib/data.ts`

### Plants

```typescript
getAllPlants(): Plant[]
getPlantById(id: string): Plant | undefined
getPlantBySlug(slug: string): Plant | undefined
getFeaturedPlants(): Plant[]
searchPlants(query: string): Plant[]
filterPlants(filters: FilterState): Plant[]
getPlantsByBodySystem(system: string): Plant[]
getPlantsByCondition(condition: string): Plant[]
getPlantsByPreparation(preparation: string): Plant[]
```

### Categories

```typescript
getCategories(): Categories
getBodySystems(): BodySystemInfo[]
getPreparationTypes(): PreparationInfo[]
getActions(): ActionInfo[]
getTraditions(): TraditionInfo[]
getSeasons(): SeasonInfo[]
```

### Conditions

```typescript
getAllConditions(): Condition[]
getConditionById(id: string): Condition | undefined
getConditionsByCategory(category: string): Condition[]
```

### Remedies

```typescript
getAllRemedies(): Remedy[]
getRemedyById(id: string): Remedy | undefined
getRemediesByHerb(herbId: string): Remedy[]
getRemediesByCondition(conditionId: string): Remedy[]
```

### Staging

**File**: `src/lib/staging.ts`

```typescript
getAllStagedItems(): StagedItemSummary[]
getStagedItemByPath(relativePath: string): StagedItemDetail | null
```

### Gather Queue

**File**: `src/lib/gather-queue.ts`

```typescript
getGatherQueue(): GatherQueueItemWithStatus[]          // All items with computed status
getGatherQueueByType(type): GatherQueueItemWithStatus[] // Filtered by content type
addToGatherQueue(item): { success, error? }             // Append with dedup check
removeFromGatherQueue(id, type): { success, error? }    // Remove by id+type
getDukePlantIndex(): DukePlantSummary[]                  // Lightweight Duke index (~2,336 entries, cached)
getPluralDir(type): string                               // Type → staging directory name
```

**Status computation** (derived at read time, never stored):
- `merged` → item ID found in main data file (e.g., `plants.json`)
- `staged` → file exists at `src/data/staging/<type-plural>/<id>.json`
- `queued` → neither of the above

### Utilities

```typescript
formatLabel(kebabCase: string): string  // 'nervous-system' → 'Nervous System'
slugify(text: string): string           // 'Lemon Balm' → 'lemon-balm'
```

---

## Core Types

**File**: `src/types/index.ts`

### GatherMetadata (Staging Only)

```typescript
interface GatherMetadata {
  gatheredAt: string;                      // ISO date (YYYY-MM-DD)
  sources: string[];                       // Key source URLs/references
  confidence: 'high' | 'medium' | 'low';   // Research confidence level
  isUpdate: boolean;                       // True if updating existing entry
  notes?: string;                          // Uncertainty flags or comments
}
```

### Gather Queue Types

**File**: `src/types/gather-queue.ts`

```typescript
type GatherContentType = 'plant' | 'condition' | 'remedy' | 'ingredient' |
                          'preparation' | 'action' | 'term' | 'tea';

type GatherItemStatus = 'queued' | 'staged' | 'merged';

interface GatherQueueItem {
  id: string;
  name: string;
  type: GatherContentType;
  addedAt: string;         // YYYY-MM-DD
  notes?: string;
  dukeRef?: string;        // Duke slug for plants
}

interface GatherQueueItemWithStatus extends GatherQueueItem {
  status: GatherItemStatus; // Computed at read time
}

interface DukePlantSummary {
  slug: string;
  latinName: string;
  family: string;
  commonNames: string[];
  constituentCount: number;
}
```

### Staging Types

**File**: `src/types/staging.ts`

```typescript
type StagedItemType = 'plant' | 'condition' | 'remedy';

interface StagedItemSummary {
  id: string;
  name: string;
  type: StagedItemType;
  filePath: string;
  meta: GatherMetadata;
}

interface StagedItemDetail extends StagedItemSummary {
  data: Record<string, unknown>;
}
```

### Plant

```typescript
interface Plant {
  id: string;
  commonName: string;
  otherNames?: string[];
  latinName: string;
  family: string;
  partsUsed: string[];
  taste: string;
  energy: string;
  actions: string[];
  bodySystems: BodySystem[];
  conditions: string[];
  preparations: PreparationType[];
  traditions: Tradition[];
  seasons: Season[];
  featured?: boolean;
  safety: SafetyInfo;
  dosage: Record<string, string>;
  content: PlantContent;
  constituents?: string[];
  combinations?: HerbCombination[];
}
```

### SafetyInfo

```typescript
interface SafetyInfo {
  generalSafety: string;
  contraindications: string[];
  drugInteractions: string[];
  pregnancySafe: boolean;
  pregnancyNotes?: string;
  nursingNotes?: string;
  childrenNotes?: string;
}
```

### PlantContent

```typescript
interface PlantContent {
  overview: string;
  traditionalUses: string;
  modernResearch: string;
  howToUse: string;
  harvesting?: string;
  cultivation?: string;
  // Botanical sections
  history?: string;
  nativeRange?: string;
  taxonomy?: string;
  morphology?: string;
  // Practical sections
  storage?: string;
  quality?: string;
  conservationStatus?: string;
  lookalikes?: string;
}
```

### Union Types

```typescript
type BodySystem = 'nervous' | 'digestive' | 'immune' | 'respiratory' |
                  'skin' | 'cardiovascular' | 'musculoskeletal' |
                  'endocrine' | 'reproductive' | 'urinary';

type PreparationType = 'tea' | 'decoction' | 'tincture' | 'salve' | 'oil' |
                       'syrup' | 'poultice' | 'capsule' | 'compress' | 'bath';

type Tradition = 'western' | 'tcm' | 'ayurveda' | 'native-american' | 'folk';

type Season = 'spring' | 'summer' | 'fall' | 'winter';
```

### FilterState

```typescript
interface FilterState {
  search: string;
  bodySystems: BodySystem[];
  preparations: PreparationType[];
  conditions: string[];
  actions: string[];
}
```

### Ingredient (New)

```typescript
interface Ingredient {
  id: string;
  name: string;
  otherNames?: string[];
  category: IngredientCategory;  // 'carrier-oil' | 'wax' | 'butter' | 'solvent' | ...
  source: string;
  description: string;
  properties: IngredientProperties;
  uses: string[];
  substitutes?: IngredientSubstitute[];
  safety?: IngredientSafety;
  content: IngredientContent;
}
```

### Preparation (Method Guide) (New)

```typescript
interface Preparation {
  id: string;
  name: string;
  type: PreparationType;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeRequired: string;
  equipment: string[];
  ratios: PreparationRatio[];
  process: PreparationStep[];
  troubleshooting?: TroubleshootingItem[];
  storage: StorageInfo;
  content: PreparationContent;
}
```

### Action (New)

```typescript
interface Action {
  id: string;
  name: string;
  pronunciation?: string;
  definition: string;
  category: ActionCategory;  // 'nervous-system' | 'digestive' | 'immune' | ...
  mechanism: string;
  exampleHerbs: string[];
  conditions: string[];
  relatedActions?: string[];
  traditions: ActionTradition[];
  content: ActionContent;
}
```

### GlossaryTerm (New)

```typescript
interface GlossaryTerm {
  id: string;
  term: string;
  pronunciation?: string;
  definition: string;
  etymology?: string;
  category: GlossaryCategory;  // 'botanical' | 'preparation' | 'action' | ...
  usageExamples?: string[];
  relatedTerms?: string[];
  seeAlso?: GlossaryReference[];
}
```

### Tea (New)

```typescript
interface Tea {
  id: string;
  name: string;
  otherNames?: string[];
  teaType: TeaType;  // 'white' | 'green' | 'oolong' | 'black' | 'dark' | ...
  origin: TeaOrigin;
  processing: TeaProcessing;
  profile: TeaProfile;
  brewing: BrewingParameters;
  caffeine: CaffeineProfile;
  health: TeaHealth;
  grading?: TeaGrading;
  content: TeaContent;
}
```

---

## Adding New Data

### Manual Addition

1. Add to appropriate JSON file in `src/data/`
2. Ensure structure matches TypeScript interface
3. Types auto-validate via import assertions

### Using the Gather Skill

The `/gather` skill provides a structured workflow for researching and adding data:

```bash
# Research different content types
/gather plant ashwagandha      # Herbs/medicinal plants (12 searches)
/gather condition insomnia     # Health conditions
/gather remedy calming-tea     # Recipes/formulas
/gather ingredient jojoba-oil  # Non-plant materials (8 searches)
/gather preparation tincture   # Method guides (7 searches)
/gather action adaptogen       # Herbal actions (7 searches)
/gather term menstruum         # Glossary terms
/gather tea longjing           # Tea varieties (9 searches)

# Queue commands
/gather --next                 # Gather next queued item (any type)
/gather --next plant           # Gather next queued plant
/gather --queue                # Show queue status breakdown
/gather --queue plant          # Show queue status for plants only

# Management commands
/gather --list plants          # List existing items
/gather --review               # Review all staged items
/gather --merge plants/xyz.json # Merge staged item to main database
```

**Workflow:**
1. **Queue** - Items enter from `gather-queue.json` via `--next` or manually via `/gather <type> <name>`
2. **Research** - Claude searches authoritative sources (adaptive: skips searches when Duke data covers constituents/taxonomy)
3. **Validate** - Per-type checklist ensures all required fields and content sections are populated before writing
4. **Stage** - Data saved to `src/data/staging/<type>/<id>.json` with metadata
5. **Review** - Inspect staged files, verify accuracy (also via `/admin/staging` UI)
6. **Merge** - Add to main JSON, metadata stripped

**Staging Directory Structure:**
```
src/data/staging/
├── plants/
├── conditions/
├── remedies/
├── ingredients/
├── preparations/
├── actions/
├── glossary/
├── teas/
└── README.md
```

**Staged File Metadata:**
```json
{
  "_meta": {
    "gatheredAt": "2026-01-26",
    "sources": ["https://...", "https://..."],
    "confidence": "high",
    "isUpdate": false,
    "notes": "Optional flags"
  },
  "id": "plant-id",
  ...
}
```

See `src/data/staging/README.md` for full workflow documentation.

## Duke Reference Data

**File**: `src/data/reference/duke-plants.json`
**Source**: USDA Dr. Duke's Phytochemical and Ethnobotanical Databases (CC0 Public Domain)
**Build**: `node scripts/build-duke-reference.js <path-to-duke-csvs>`

Pre-built reference indexed by slugified Latin name (e.g., `valeriana-officinalis`). Contains 2,336 plants with:

- `latinName` — Full taxonomic name
- `family` — Plant family (e.g., Valerianaceae)
- `commonNames` — Array of common names
- `constituents` — Chemical compounds grouped by plant part (e.g., Root, Leaf, Flower)
- `ethnobotany` — Traditional uses (e.g., Insomnia, Sedative, Nervine)

The `/gather` skill consults this reference in Step 1.5 to pre-fill plant data before web searches.

## Color Mapping

```typescript
// src/types/index.ts
const bodySystemColors: Record<BodySystem, string> = {
  nervous: 'lavender',
  digestive: 'amber',
  respiratory: 'sky',
  // ... etc
};
```

Used by Pill component for consistent color coding.
