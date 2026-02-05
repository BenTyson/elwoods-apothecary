# Components

> See also: [INDEX.md](./INDEX.md) | [CONVENTIONS.md](./CONVENTIONS.md)

## Import Pattern

```typescript
import { Button, Pill, Callout, HerbCard, TeaCard, StagedItemCard } from '@/components';
```

All components exported from `src/components/index.ts`.

---

## UI Components

### Button

**File**: `src/components/ui/Button.tsx`

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'parchment';
  size?: 'sm' | 'md' | 'lg';
  href?: string;        // Renders as Link if provided
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}
```

**Usage**:
```tsx
<Button variant="primary" size="lg" href="/browse">Browse Herbs</Button>
<Button variant="secondary" onClick={handleClick}>Action</Button>
```

---

### Pill

**File**: `src/components/ui/Pill.tsx`

```typescript
interface PillProps {
  variant?: BodySystem | 'default' | 'action' | 'tradition' | 'preparation';
  children: ReactNode;
  className?: string;
}
```

**Body System Variants**: `nervous`, `digestive`, `respiratory`, `cardiovascular`, `immune`, `musculoskeletal`, `integumentary`, `endocrine`, `reproductive`, `urinary`

**Usage**:
```tsx
<Pill variant="nervous">Nervous System</Pill>
<Pill variant="action">Anti-inflammatory</Pill>
```

---

### Callout

**File**: `src/components/ui/Callout.tsx`

```typescript
interface CalloutProps {
  variant?: 'warning' | 'danger' | 'info';
  title?: string;
  children: ReactNode;
}
```

**Usage**:
```tsx
<Callout variant="warning" title="Caution">
  Not recommended during pregnancy.
</Callout>
```

---

### HerbCard

**File**: `src/components/herbs/HerbCard.tsx`

```typescript
interface HerbCardProps {
  plant: Plant;
  featured?: boolean;   // Larger card variant
}
```

**Usage**:
```tsx
<HerbCard plant={plant} />
<HerbCard plant={plant} featured />
```

---

## Tea Components

### TeaCard

**File**: `src/components/teas/TeaCard.tsx`

```typescript
interface TeaCardProps {
  tea: Tea;
  className?: string;
}
```

Displays a tea card with tea type badge (color-coded by type), origin country, caffeine level pill, overview excerpt, and links to `/browse/tea/[id]`.

**Tea type color mapping**: green → green, white → rose, oolong → amber, black → orange, dark → purple, blend → blue.

**Usage**:
```tsx
<TeaCard tea={tea} />
```

---

## Layout Components

### Header

**File**: `src/components/layout/Header.tsx`

- Sticky navigation
- Route-aware active states
- Links: Home, Browse, Learn, Tools, Shop

### Footer

**File**: `src/components/layout/Footer.tsx`

- Medical disclaimer
- Copyright notice

---

## Staging Components

### StagedItemCard

**File**: `src/components/staging/StagedItemCard.tsx`

Client component for displaying staged items in a list.

```typescript
interface StagedItemCardProps {
  item: StagedItemSummary;
  isSelected?: boolean;
  onClick?: () => void;
}
```

**Usage**:
```tsx
<StagedItemCard item={stagedItem} isSelected={selected} onClick={handleSelect} />
```

---

### StagedItemDetail

**File**: `src/components/staging/StagedItemDetail.tsx`

Displays full details of a staged item including metadata, sources, and data preview.

```typescript
interface StagedItemDetailProps {
  item: StagedItemDetail;
}
```

**Usage**:
```tsx
<StagedItemDetail item={selectedItem} />
```

---

### SourceLink

**File**: `src/components/staging/SourceLink.tsx`

Displays a source URL with extracted domain and external link icon.

```typescript
interface SourceLinkProps {
  url: string;
}
```

**Usage**:
```tsx
<SourceLink url="https://example.com/article" />
```

---

## Gather Components

### StatusBadge

**File**: `src/components/gather/StatusBadge.tsx`

Pill-based badge for gather queue item status.

```typescript
interface StatusBadgeProps {
  status: GatherItemStatus; // 'queued' | 'staged' | 'merged'
}
```

**Colors**: queued = moss, staged = amber, merged = fern

**Usage**:
```tsx
<StatusBadge status="queued" />
```

---

### GatherQueueCard

**File**: `src/components/gather/GatherQueueCard.tsx`

Client component. Displays a gather queue item with status badge, dates, notes, and optional remove button. **Click-to-copy**: clicking the card copies the `/gather <type> <name>` command to clipboard for pasting into a terminal session. Shows a green confirmation banner with the copied command for 2 seconds, and a hover hint previewing the command.

```typescript
interface GatherQueueCardProps {
  item: GatherQueueItemWithStatus;
  onRemove?: (id: string, type: string) => void; // Only shown for 'queued' status, stopPropagation prevents copy
}
```

**Usage**:
```tsx
<GatherQueueCard item={item} onRemove={handleRemove} />
// Clicking card → copies "/gather plant Ginseng" to clipboard
// Clicking Remove → only removes, does not copy
```

---

### ManualEntryForm

**File**: `src/components/gather/ManualEntryForm.tsx`

Client component. Text input + Add button for non-plant content types. Uses `slugify()` to derive ID. Validates non-empty and deduplicates.

```typescript
interface ManualEntryFormProps {
  type: GatherContentType;
  existingIds: Set<string>;
  onAdd: (id: string, name: string, type: GatherContentType) => void;
}
```

**Usage**:
```tsx
<ManualEntryForm type="condition" existingIds={ids} onAdd={handleAdd} />
```

---

### DukePlantBrowser

**File**: `src/components/gather/DukePlantBrowser.tsx`

Client component. Searchable browser for the Duke phytochemical reference (~2,336 plants). Features debounced search (300ms), A-Z letter navigation, and results capped at 50.

```typescript
interface DukePlantBrowserProps {
  plants: DukePlantSummary[];
  queuedSlugs: Set<string>;
  onAdd: (slug: string, latinName: string) => void;
}
```

**Usage**:
```tsx
<DukePlantBrowser plants={dukePlants} queuedSlugs={queued} onAdd={handleAddPlant} />
```

---

## Detail Page Components

Shared components used by plant and tea detail pages (`/browse/[slug]`, `/browse/tea/[slug]`).

### HeroPlaceholder

**File**: `src/components/detail/HeroPlaceholder.tsx`

Large hero section with SVG artwork (tea cup or botanical leaf), back link, pills, and metadata.

```typescript
interface HeroPlaceholderProps {
  variant: 'tea' | 'plant';
  name: string;
  subtitle?: string;
  pills?: { label: string; variant?: string }[];
  meta?: { label: string; value: string }[];
  className?: string;
}
```

### QuickInfoBar

**File**: `src/components/detail/QuickInfoBar.tsx`

Responsive grid bar displaying labeled data items.

```typescript
interface QuickInfoItem { label: string; value: string; subValue?: string; }
interface QuickInfoBarProps { items: QuickInfoItem[]; className?: string; }
```

### TableOfContents / MobileTOC

**Files**: `src/components/detail/TableOfContents.tsx`, `src/components/detail/MobileTOC.tsx`

Client components. Sticky desktop sidebar and fixed mobile dropdown with intersection observer tracking for active section.

```typescript
interface TOCItem { id: string; label: string; }
// Both accept: { items: TOCItem[] }
```

### ContentSection

**File**: `src/components/detail/ContentSection.tsx`

Semantic section wrapper with heading and scroll margin for TOC navigation.

```typescript
interface ContentSectionProps { id: string; title: string; children: ReactNode; className?: string; }
```

### ProseBlock

**File**: `src/components/detail/ProseBlock.tsx`

Renders formatted prose text with optional pull quote extraction and lead paragraph styling.

```typescript
interface ProseBlockProps { text: string; lead?: boolean; showPullQuote?: boolean; className?: string; }
```

### DataCard

**File**: `src/components/detail/DataCard.tsx`

Labeled data point display with optional monospace styling.

```typescript
interface DataCardProps { label: string; value: string; mono?: boolean; className?: string; }
```

### OxidationMeter

**File**: `src/components/detail/OxidationMeter.tsx`

Visual progress bar for tea oxidation percentage with gradient styling.

```typescript
interface OxidationMeterProps { level: string; className?: string; }
```

### CaffeineMeter

**File**: `src/components/detail/CaffeineMeter.tsx`

Segmented bar (0-6 segments) representing caffeine content level.

```typescript
interface CaffeineMeterProps { level: CaffeineLevel; className?: string; }
```

### ProcessingTimeline

**File**: `src/components/detail/ProcessingTimeline.tsx`

Vertical timeline with numbered processing steps.

```typescript
interface ProcessingTimelineProps { steps: string[]; className?: string; }
```

### BrewingCard

**File**: `src/components/detail/BrewingCard.tsx`

Displays western and optional gongfu style brewing parameters.

```typescript
interface BrewingCardProps { brewing: BrewingParameters; className?: string; }
```

### FlavorProfile

**File**: `src/components/detail/FlavorProfile.tsx`

Shows aroma/flavor pills, appearance, liquor color, mouthfeel, and finish.

```typescript
interface FlavorProfileProps { profile: TeaProfile; className?: string; }
```

### ImageGalleryPlaceholder

**File**: `src/components/detail/ImageGalleryPlaceholder.tsx`

Grid of placeholder image cards with labels.

```typescript
interface ImageGalleryPlaceholderProps { labels: string[]; className?: string; }
```

### RelatedTeas / RelatedPlants

**Files**: `src/components/detail/RelatedTeas.tsx`, `src/components/detail/RelatedPlants.tsx`

Fetch and render up to 3 related items as cards. Return null if none found.

```typescript
// RelatedTeas: { currentTeaId: string }
// RelatedPlants: { currentPlantId: string }
```

---

## Adding New Components

1. Create file in appropriate subfolder:
   - `ui/` - Generic reusable
   - `layout/` - Page structure
   - `herbs/` - Herb domain-specific
   - `teas/` - Tea domain-specific
   - `detail/` - Shared detail page components
   - `staging/` - Admin staging review
   - `gather/` - Admin gather queue

2. Export from `src/components/index.ts`:
   ```typescript
   export { NewComponent } from './ui/NewComponent';
   ```

3. Follow variant pattern if needed (see Button/Pill)

4. Use `cn()` for class merging:
   ```typescript
   import { cn } from '@/lib/utils';
   className={cn('base-classes', className)}
   ```
