# El Woods Apothecary

Where ancient plant wisdom meets modern understanding.

## Development

```bash
npm run dev
```

**Default port: 5588**

Open [http://localhost:5588](http://localhost:5588) to view the site.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── browse/            # Herb browsing & filtering
│   │   ├── page.tsx       # Browse grid with filters
│   │   └── [slug]/        # Dynamic plant detail pages
│   ├── learn/             # Educational content (coming soon)
│   ├── tools/             # Interactive tools (coming soon)
│   └── shop/              # Marketplace (coming soon)
├── components/
│   ├── layout/            # Header, Footer
│   ├── ui/                # Button, Pill, Callout
│   └── herbs/             # HerbCard
├── lib/
│   ├── data.ts            # Data access functions
│   └── utils.ts           # Utility functions (cn)
├── types/
│   └── index.ts           # TypeScript type definitions
└── data/
    ├── plants.json        # Herb database
    ├── categories.json    # Taxonomy (body systems, preparations, etc.)
    ├── conditions.json    # Ailment guides
    └── remedies.json      # Remedy recipes
```

## Tech Stack

- **Next.js 16** with App Router
- **React 19**
- **Tailwind CSS v4** with CSS variables
- **TypeScript**

## Design System

Colors are defined as CSS variables in `globals.css`:

- Forest palette: `--deep-forest`, `--moss`, `--sage`, `--fern`, `--mist`, `--cream`
- Apothecary: `--apothecary-amber`, `--parchment`, `--sepia`
- Category accents: `--color-calming`, `--color-digestive`, `--color-immune`, etc.

Fonts:
- Display: Cormorant Garamond
- Body: Source Serif 4
- Handwritten: Caveat

## Scripts

```bash
npm run dev      # Start dev server on port 5588
npm run build    # Build for production
npm run start    # Start production server on port 5588
npm run lint     # Run ESLint
```
