# Components

> See also: [INDEX.md](./INDEX.md) | [CONVENTIONS.md](./CONVENTIONS.md)

## Import Pattern

```typescript
import { Button, Pill, Callout, HerbCard, StagedItemCard } from '@/components';
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

## Adding New Components

1. Create file in appropriate subfolder:
   - `ui/` - Generic reusable
   - `layout/` - Page structure
   - `herbs/` - Domain-specific
   - `staging/` - Admin staging review

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
