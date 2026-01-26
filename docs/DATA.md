# Data Layer

> See also: [INDEX.md](./INDEX.md) | [ARCHITECTURE.md](./ARCHITECTURE.md)

## Data Files

| File | Content | ~Size |
|------|---------|-------|
| `src/data/plants.json` | Herb database | 20KB+ |
| `src/data/categories.json` | Taxonomy (body systems, preparations, actions, traditions) | 5KB |
| `src/data/conditions.json` | Ailment guides | 8KB |
| `src/data/remedies.json` | Recipe database | 10KB |
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

---

## Adding New Data

### Manual Addition

1. Add to appropriate JSON file in `src/data/`
2. Ensure structure matches TypeScript interface
3. Types auto-validate via import assertions

### Using the Gather Skill

The `/gather` skill provides a structured workflow for researching and adding data:

```bash
# Research and stage a new plant
/gather plant ashwagandha

# Research a health condition
/gather condition insomnia

# Research a remedy
/gather remedy calming-tea

# List existing items
/gather --list plants

# Review all staged items
/gather --review

# Merge staged item to main database
/gather --merge plants/ashwagandha.json
```

**Workflow:**
1. **Research** - Claude searches authoritative sources
2. **Stage** - Data saved to `src/data/staging/<type>/<id>.json` with metadata
3. **Review** - Inspect staged files, verify accuracy
4. **Merge** - Add to main JSON, metadata stripped

**Staging Directory Structure:**
```
src/data/staging/
├── plants/
├── conditions/
├── remedies/
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
