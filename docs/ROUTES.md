# Routes

> See also: [INDEX.md](./INDEX.md) | [ARCHITECTURE.md](./ARCHITECTURE.md)

## Route Map

```
/                    → Home (Server Component)
/browse              → Herb & Tea browser (Client Component, tabbed)
/browse/[slug]       → Plant detail (Server Component, SSG)
/browse/tea/[slug]   → Tea detail (Server Component, SSG)
/learn               → Educational [placeholder]
/tools               → Tools [placeholder]
/shop                → Marketplace [placeholder]
/admin/staging       → Staging data review (Server + Client)
/admin/gather        → Gather queue management (Server + Client)
```

---

## Page Files

| Route | File | Type |
|-------|------|------|
| `/` | `src/app/page.tsx` | Server |
| `/browse` | `src/app/browse/page.tsx` | Client (`'use client'`) |
| `/browse/[slug]` | `src/app/browse/[slug]/page.tsx` | Server (SSG) |
| `/browse/tea/[slug]` | `src/app/browse/tea/[slug]/page.tsx` | Server (SSG) |
| `/learn` | `src/app/learn/page.tsx` | Server |
| `/tools` | `src/app/tools/page.tsx` | Server |
| `/shop` | `src/app/shop/page.tsx` | Server |
| `/admin/staging` | `src/app/admin/staging/page.tsx` | Server + Client |
| `/admin/gather` | `src/app/admin/gather/page.tsx` | Server + Client |

---

## Layout

**File**: `src/app/layout.tsx`

Wraps all pages with:
- HTML document structure
- Font loading (Cormorant Garamond, Source Serif 4, Caveat)
- Header component
- Footer component

```tsx
<html>
  <body>
    <Header />
    {children}
    <Footer />
  </body>
</html>
```

---

## Dynamic Routes

### Plant Detail (`/browse/[slug]`)

**Static Generation**:
```typescript
export function generateStaticParams() {
  return getAllPlants().map(plant => ({ slug: plant.id }));
}
```

**Page Props**:
```typescript
interface Props {
  params: Promise<{ slug: string }>;
}
```

**Data Fetching**:
```typescript
const plant = getPlantBySlug(slug);
if (!plant) notFound();
```

### Tea Detail (`/browse/tea/[slug]`)

**Static Generation**:
```typescript
export function generateStaticParams() {
  return getAllTeas().map(tea => ({ slug: tea.id }));
}
```

**Page Props**:
```typescript
interface Props {
  params: Promise<{ slug: string }>;
}
```

**Data Fetching**:
```typescript
const tea = getTeaById(slug);
if (!tea) notFound();
```

---

## Adding New Routes

### Static Page

1. Create `src/app/[route]/page.tsx`
2. Export default component
3. Add link to Header if needed

### Dynamic Route

1. Create `src/app/[route]/[param]/page.tsx`
2. Implement `generateStaticParams()` for SSG
3. Handle `notFound()` case

### Client Component Page

Add `'use client'` directive at top:
```typescript
'use client';
// ... rest of file
```

---

## Metadata

Each page can export metadata:

```typescript
export const metadata = {
  title: 'Page Title | El Woods Apothecary',
  description: 'Page description',
};
```

Or dynamic metadata:

```typescript
export async function generateMetadata({ params }) {
  const plant = getPlantBySlug(params.slug);
  return { title: plant?.commonName };
}
```
