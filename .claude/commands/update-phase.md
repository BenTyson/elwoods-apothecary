# Update Phase

Run a documentation audit and update cycle. This skill checks the `/docs` system against the current codebase state and updates any stale information.

## Execution Steps

### Phase 1: Audit Current State

1. **Check last update timestamps** in each doc file
2. **Scan for structural changes**:
   - New/removed files in `src/app/` → update ROUTES.md
   - New/removed components in `src/components/` → update COMPONENTS.md
   - Changes to `src/lib/data.ts` → update DATA.md
   - Changes to `src/types/index.ts` → update DATA.md
   - New dependencies in `package.json` → update ARCHITECTURE.md

### Phase 2: Detect Drift

Run these checks:

```bash
# Check for new routes
ls -la src/app/

# Check for new components
ls -la src/components/ui/ src/components/layout/ src/components/herbs/ 2>/dev/null

# Check component exports match index.ts
cat src/components/index.ts

# Check data functions
grep "^export function" src/lib/data.ts

# Check types
grep "^export interface\|^export type" src/types/index.ts

# Check package.json for new deps
cat package.json | grep -A 50 '"dependencies"'
```

### Phase 3: Update Docs

For each doc that needs updates:

1. **INDEX.md** - Update:
   - Last Updated date
   - Current State section (implemented/placeholder features)
   - Critical Files table if new key files added

2. **ARCHITECTURE.md** - Update:
   - Rendering Strategy table for new routes
   - Dependencies table for new packages
   - File Responsibilities if new core files added

3. **COMPONENTS.md** - Update:
   - Add documentation for new components
   - Update props interfaces if changed
   - Remove documentation for deleted components

4. **DATA.md** - Update:
   - Query Functions section for new data functions
   - Core Types section for new/modified interfaces
   - Data Files table if new JSON added

5. **ROUTES.md** - Update:
   - Route Map for new pages
   - Page Files table
   - Dynamic Routes section if new dynamic routes

6. **CONVENTIONS.md** - Update only if:
   - New patterns emerge from code changes
   - Style conventions change

### Phase 4: Verify Integrity

After updates, verify:
- All interlinks still work (no broken references)
- No duplicate sections introduced
- Formatting consistent across docs
- Last Updated timestamp set to today

## Output

After completion, report:
- Files checked: [count]
- Files updated: [list]
- Changes made: [summary]
- Docs status: [CURRENT / NEEDS-REVIEW]

## Usage Notes

- Run after significant code changes
- Run before starting a new major feature
- Run if docs haven't been updated in 7+ days
- Keep updates minimal - only change what's actually stale
