# Gather Data

Research and populate apothecary data with a staging workflow and source citations.

## Usage

```
/gather plant <name>      - Research a plant/herb
/gather condition <name>  - Research a health condition
/gather remedy <name>     - Research a remedy/recipe
/gather --list <category> - Show existing items (plants/conditions/remedies)
/gather --review          - Review all staged items
/gather --merge <file>    - Merge staged item to main JSON
```

## Workflow

**Staging Area** → **Review** → **Merge**

All gathered data goes to `src/data/staging/` first, allowing review before adding to the main database.

---

## Execution: Research Commands

When user runs `/gather plant <name>`, `/gather condition <name>`, or `/gather remedy <name>`:

### Step 1: Check Existing Data

First, check if the item already exists in the main database:

```bash
# For plants
grep -i "<name>" src/data/plants.json

# For conditions
grep -i "<name>" src/data/conditions.json

# For remedies
grep -i "<name>" src/data/remedies.json
```

If item exists, note this is an **update** (set `_meta.isUpdate: true`).

### Step 2: Research

Use WebSearch to gather authoritative information:

**For Plants:**
1. Search: `"<plant name>" herbal medicine uses traditional`
2. Search: `"<latin name>" pharmacology constituents`
3. Search: `"<plant name>" contraindications drug interactions safety`
4. Search: `"<plant name>" pregnancy breastfeeding children`

**For Conditions:**
1. Search: `"<condition>" herbal treatment natural remedies`
2. Search: `"<condition>" symptoms when to see doctor`
3. Search: `"<condition>" lifestyle modifications`

**For Remedies:**
1. Search: `"<remedy name>" herbal recipe preparation`
2. Search: `"<remedy type>" dosage instructions storage`

### Step 3: Cross-Reference & Validate

- Verify Latin names against botanical databases
- Cross-reference safety information from multiple sources
- Flag any conflicting information

### Step 4: Structure Data

Map researched information to the TypeScript schema.

**Plants must include:**
- id, commonName, latinName, family, partsUsed
- taste, energy, actions, bodySystems, conditions
- preparations, traditions, seasons
- safety (ALL subfields: generalSafety, contraindications, drugInteractions, pregnancySafe, pregnancyNotes, nursingNotes, childrenNotes)
- dosage (object with preparation types as keys)
- content (overview, traditionalUses, modernResearch, howToUse)

**Conditions must include:**
- id, name, category (BodySystem), description
- symptoms, herbs, approaches, lifestyle, whenToSeek

**Remedies must include:**
- id, name, type (PreparationType), difficulty
- prepTime, yield, description
- herbs, conditions, bodySystems
- ingredients, instructions

### Step 5: Write Staged File

Write to appropriate staging directory:

```
src/data/staging/plants/<id>.json
src/data/staging/conditions/<id>.json
src/data/staging/remedies/<id>.json
```

Include `_meta` block at top level:

```json
{
  "_meta": {
    "gatheredAt": "YYYY-MM-DD",
    "sources": [
      "https://example.com/source1",
      "https://example.com/source2"
    ],
    "confidence": "high|medium|low",
    "isUpdate": false,
    "notes": "Any uncertainty or flags"
  },
  "id": "item-id",
  ...
}
```

### Step 6: Report Summary

Output a summary:
- Item name and Latin name (for plants)
- Key properties (actions, body systems, etc.)
- Safety highlights
- Number of sources cited
- Confidence level
- Path to staged file
- Next steps (`/gather --review` or `/gather --merge <path>`)

---

## Execution: List Command

When user runs `/gather --list <category>`:

1. Read the appropriate main JSON file
2. List all items with id and name
3. Also list any staged items in `src/data/staging/<category>/`

```bash
# Example output format:
# Plants in database: 15
# - chamomile (Chamomile)
# - lavender (Lavender)
# ...
#
# Staged plants: 2
# - ashwagandha (pending review)
# - valerian (pending review)
```

---

## Execution: Review Command

When user runs `/gather --review`:

1. List all files in staging directories
2. For each staged file, show:
   - Item name and type
   - Gathered date
   - Confidence level
   - Source count
   - Any notes/flags

```bash
# Find all staged files
ls -la src/data/staging/plants/
ls -la src/data/staging/conditions/
ls -la src/data/staging/remedies/
```

If user wants to review a specific item, read and summarize the staged JSON file.

---

## Execution: Merge Command

When user runs `/gather --merge <file>`:

**File path format:** `plants/valerian.json` or `conditions/headache.json`

### Step 1: Read Staged File

```bash
cat src/data/staging/<file>
```

### Step 2: Validate Structure

Ensure all required fields are present for the item type.

### Step 3: Strip Metadata

Remove the `_meta` block - it's for review only, not for production data.

### Step 4: Determine Operation

- If `_meta.isUpdate` is true: Replace existing item in array
- If `_meta.isUpdate` is false: Append to array

### Step 5: Update Main JSON

Read the main JSON file, add/update the item, write back.

**For new items:**
```typescript
// Read existing array, push new item, write back
```

**For updates:**
```typescript
// Find item by id, replace it, write back
```

### Step 6: Remove Staged File

```bash
rm src/data/staging/<file>
```

### Step 7: Verify

```bash
# Ensure TypeScript still compiles
npx tsc --noEmit
```

### Step 8: Report

- Confirm item added/updated
- Show item count in database
- Remind about committing changes

---

## Safety-Critical Handling

For safety fields (`contraindications`, `drugInteractions`, `pregnancySafe`):

1. **Explicitly search** for safety information - don't assume
2. **If conflicting info found**: Set confidence to "low", add detailed note
3. **If no safety info found**: Flag clearly in notes, don't guess
4. **Always populate** `pregnancyNotes`, `nursingNotes`, `childrenNotes` even if just "No known concerns" or "Insufficient data"

### Confidence Levels

- **high**: Multiple authoritative sources agree, clear safety profile
- **medium**: Good information but some gaps or minor conflicts
- **low**: Limited sources, conflicting info, or safety concerns need verification

---

## Schema Reference

### Valid BodySystem Values
`nervous`, `digestive`, `immune`, `respiratory`, `skin`, `cardiovascular`, `musculoskeletal`, `endocrine`, `reproductive`, `urinary`

### Valid PreparationType Values
`tea`, `decoction`, `tincture`, `salve`, `oil`, `syrup`, `poultice`, `capsule`, `compress`, `bath`

### Valid Tradition Values
`western`, `tcm`, `ayurveda`, `native-american`, `folk`

### Valid Season Values
`spring`, `summer`, `fall`, `winter`

### Difficulty Levels
`beginner`, `intermediate`, `advanced`

---

## Example Session

```
User: /gather plant ashwagandha

Claude: I'll research ashwagandha comprehensively.

[Performs web searches, cross-references sources]

Staged to: src/data/staging/plants/ashwagandha.json

Summary:
- Latin: Withania somnifera (Solanaceae)
- Actions: adaptogen, anxiolytic, immunomodulator, anti-inflammatory
- Body Systems: nervous, immune, endocrine
- Safety: Avoid with thyroid medications, nightshade allergy
- Sources: 4 references cited
- Confidence: HIGH

Run `/gather --review` to inspect the full entry, or `/gather --merge plants/ashwagandha.json` to add to the database.
```

---

## Files

- **Staging directory**: `src/data/staging/`
- **Main data files**: `src/data/plants.json`, `src/data/conditions.json`, `src/data/remedies.json`
- **Types**: `src/types/index.ts`
