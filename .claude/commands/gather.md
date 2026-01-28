# Gather Data

Research and populate apothecary data with a staging workflow and source citations.

## Usage

```
/gather plant <name>       - Research a plant/herb
/gather condition <name>   - Research a health condition
/gather remedy <name>      - Research a remedy/recipe
/gather ingredient <name>  - Research a non-plant ingredient
/gather preparation <name> - Research a preparation method
/gather action <name>      - Research an herbal action
/gather term <name>        - Research a glossary term
/gather tea <name>         - Research a tea variety
/gather --next             - Gather the next queued item (any type)
/gather --next plant       - Gather the next queued plant (etc.)
/gather --queue [type]     - Show queue status (optionally filtered)
/gather --list <category>  - Show existing items
/gather --review           - Review all staged items
/gather --merge <file>     - Merge staged item to main JSON
```

## Workflow

**Queue** → **Research** → **Staging Area** → **Review** → **Merge**

Items enter Research either manually (`/gather plant sage`) or from the queue (`/gather --next`).
All gathered data goes to `src/data/staging/` first, allowing review before adding to the main database.

---

## Execution: Research Commands

When user runs any `/gather <type> <name>` command:

### Step 1: Check Existing Data

Use the **Grep** tool to search for the item name (case-insensitive) in the appropriate main data file:

| Type | File |
|------|------|
| plant | `src/data/plants.json` |
| condition | `src/data/conditions.json` |
| remedy | `src/data/remedies.json` |
| ingredient | `src/data/ingredients.json` |
| preparation | `src/data/preparations.json` |
| action | `src/data/actions.json` |
| term | `src/data/glossary.json` |
| tea | `src/data/teas.json` |

If item exists in the main database, note this is an **update** (set `_meta.isUpdate: true`).

Also use **Glob** to check the staging directory (`src/data/staging/<pluralDir>/<id>.json`). If a staged file already exists, inform the user and ask whether to overwrite.

### Step 1.5: Check Duke Reference (Plants Only)

For plant research, use the **Grep** tool to search for the plant name (common or Latin) in `src/data/reference/duke-plants.json`. If a match is found, use the **Read** tool to extract the full Duke entry.

If found, pre-fill from Duke data:
- **constituents**: Use Duke's chemical list, grouped by plant part
- **conditions**: Derive from Duke's ethnobotany list
- **family**: Use Duke's family classification
- **latinName**: Validate against Duke's taxonomy

Set a `hasDukeData` flag for Step 2 adaptive search.

**Format note**: Duke uses Latin-only family names (e.g., `Lamiaceae`). This is the standard — do not add parenthetical English names.

### Step 2: Research

Use WebSearch to gather authoritative information. Plant searches are **adaptive** based on Duke data availability.

**For Plants — Always perform (10 searches):**
1. Search: `"<plant name>" herbal medicine uses traditional`
2. Search: `"<plant name>" contraindications drug interactions safety`
3. Search: `"<plant name>" pregnancy breastfeeding children`
4. Search: `"<plant name>" history origin etymology cultural significance`
5. Search: `"<plant name>" native range habitat distribution geography`
6. Search: `"<plant name>" morphology identification characteristics appearance`
7. Search: `"<plant name>" storage shelf life dried herb`
8. Search: `"<plant name>" quality indicators buying sourcing`
9. Search: `"<plant name>" conservation status endangered sustainable`
10. Search: `"<plant name>" lookalikes poisonous misidentification`

**For Plants — Skip when Duke provides constituents:**
- ~~`"<latin name>" pharmacology constituents`~~ (pre-filled from Duke)

**For Plants — Skip when Duke provides family/taxonomy:**
- ~~`"<latin name>" taxonomy classification related species`~~ → lighter search: `"<plant name>" related species subspecies varieties` (for narrative content only)

**For Plants — When Duke data is NOT available, add:**
11. Search: `"<latin name>" pharmacology constituents`
12. Search: `"<latin name>" taxonomy classification related species`

**For Conditions:**
1. Search: `"<condition>" herbal treatment natural remedies`
2. Search: `"<condition>" symptoms when to see doctor`
3. Search: `"<condition>" lifestyle modifications`

**For Remedies:**
1. Search: `"<remedy name>" herbal recipe preparation`
2. Search: `"<remedy type>" dosage instructions storage`

**For Ingredients:**
1. Search: `"<ingredient>" herbal preparations uses`
2. Search: `"<ingredient>" properties characteristics`
3. Search: `"<ingredient>" quality sourcing buying guide`
4. Search: `"<ingredient>" storage shelf life`
5. Search: `"<ingredient>" safety skin sensitivity allergies`
6. Search: `"<ingredient>" substitutes alternatives`
7. Search: `"<ingredient>" production extraction how made`
8. Search: `"<ingredient>" history traditional use`

**For Preparations (Methods):**
1. Search: `"<preparation type>" herbal method how to make`
2. Search: `"<preparation type>" ratio proportions`
3. Search: `"<preparation type>" equipment supplies needed`
4. Search: `"<preparation type>" troubleshooting common problems`
5. Search: `"<preparation type>" storage shelf life`
6. Search: `"<preparation type>" history traditional method`
7. Search: `"<preparation type>" which herbs best suited`

**For Actions:**
1. Search: `"<action>" herbal action definition`
2. Search: `"<action>" mechanism how it works physiology`
3. Search: `"<action>" herbs examples plants`
4. Search: `"<action>" conditions indications uses`
5. Search: `"<action>" etymology origin term`
6. Search: `"<action>" traditional chinese medicine ayurveda`
7. Search: `"<action>" related actions similar`

**For Glossary Terms:**
1. Search: `"<term>" herbal definition meaning`
2. Search: `"<term>" etymology word origin`
3. Search: `"<term>" herbalism context usage`

**For Teas:**
1. Search: `"<tea name>" tea origin region terroir`
2. Search: `"<tea name>" processing oxidation production`
3. Search: `"<tea name>" flavor profile tasting notes aroma`
4. Search: `"<tea name>" brewing temperature steep time parameters`
5. Search: `"<tea name>" caffeine L-theanine content`
6. Search: `"<tea name>" health benefits research antioxidants`
7. Search: `"<tea name>" grading quality selection`
8. Search: `"<tea name>" history culture ceremony`
9. Search: `"<tea name>" storage aging shelf life`

### Step 3: Cross-Reference & Validate

- Verify Latin names against botanical databases
- Cross-reference safety information from multiple sources
- Flag any conflicting information

### Step 4: Structure Data

Read `src/types/index.ts` to determine the required and optional fields for the item type.

**Type → Interface mapping:**

| Content Type | Primary Interface | Content Interface |
|-------------|-------------------|-------------------|
| plant | `Plant` | `PlantContent` |
| condition | `Condition` | *(inline)* |
| remedy | `Remedy` | *(inline)* |
| ingredient | `Ingredient` | `IngredientContent` |
| preparation | `Preparation` | `PreparationContent` |
| action | `Action` | `ActionContent` |
| term | `GlossaryTerm` | `GlossaryContent` |
| tea | `Tea` | `TeaContent` |

**Rules:**
- Non-optional fields (no `?` suffix in TypeScript) MUST be populated.
- Optional fields (with `?` suffix) SHOULD be populated when research provides data.
- **Plant-specific override**: All 8 botanical/practical content sections (`history`, `nativeRange`, `taxonomy`, `morphology`, `storage`, `quality`, `conservationStatus`, `lookalikes`) are editorially required despite being TypeScript-optional.

**Format conventions:**
- `family`: Latin only — `"Lamiaceae"` not `"Lamiaceae (Mint family)"`
- `id`: common-name kebab-case — `"valerian"` not `"valeriana-officinalis"`
- `taste` / `energy`: lowercase, comma-separated — `"bitter, pungent"`
- Array strings: lowercase unless proper nouns — `["nervine", "adaptogen"]`

### Step 4.5: Validation Checklist

Before writing the staged file, verify every item against the checklist for its type. **If any check fails, go back and fill the gap with additional targeted research. Do not proceed to Step 5 with gaps.**

**Plants:**
- [ ] All `Plant` required fields populated (id, commonName, latinName, family, partsUsed, taste, energy, actions, bodySystems, conditions, preparations, traditions, seasons, safety, dosage, content)
- [ ] `family` is Latin-only format (e.g., `"Lamiaceae"`)
- [ ] `id` is common-name kebab-case (e.g., `"valerian"`)
- [ ] `safety` has ALL 7 subfields: generalSafety, contraindications, drugInteractions, pregnancySafe, pregnancyNotes, nursingNotes, childrenNotes
- [ ] `content` has 4 core sections: overview, traditionalUses, modernResearch, howToUse
- [ ] `content` has all 8 extended sections: history, nativeRange, taxonomy, morphology, storage, quality, conservationStatus, lookalikes
- [ ] Each content section is substantive (minimum 2-3 sentences)
- [ ] `constituents` populated (from Duke or research)
- [ ] `_meta.sources` has ≥4 URLs

**Conditions:**
- [ ] All `Condition` required fields populated (id, name, category, description, symptoms, herbs, approaches, lifestyle, whenToSeek)
- [ ] `category` is a valid `BodySystem` value
- [ ] `herbs` lists at least 3 relevant herbs
- [ ] `approaches` and `lifestyle` are substantive arrays
- [ ] `whenToSeek` is specific and actionable
- [ ] `_meta.sources` has ≥3 URLs

**Remedies:**
- [ ] All `Remedy` required fields populated (id, name, type, difficulty, prepTime, yield, description, herbs, conditions, bodySystems, ingredients, instructions)
- [ ] `type` is a valid `PreparationType`
- [ ] `ingredients` has amount for each item
- [ ] `instructions` are numbered, clear steps
- [ ] `_meta.sources` has ≥3 URLs

**Ingredients:**
- [ ] All `Ingredient` required fields populated (id, name, category, source, description, properties, uses, content)
- [ ] `properties.shelfLife` and `properties.storageRequirements` present
- [ ] `content.overview` is substantive
- [ ] `safety` populated with at least generalSafety and internalUse
- [ ] At least 1 substitute listed
- [ ] `_meta.sources` has ≥3 URLs

**Preparations:**
- [ ] All `Preparation` required fields populated (id, name, type, description, difficulty, timeRequired, equipment, ingredientTypes, ratios, process, storage, content)
- [ ] `ratios` has at least one entry with description and ratio
- [ ] `process` has numbered steps with instructions
- [ ] `storage` has all 4 subfields (container, conditions, shelfLife, signsOfSpoilage)
- [ ] `content.overview` is substantive
- [ ] At least 2 troubleshooting items
- [ ] `_meta.sources` has ≥3 URLs

**Actions:**
- [ ] All `Action` required fields populated (id, name, definition, category, mechanism, exampleHerbs, conditions, traditions, content)
- [ ] `definition` is one clear sentence
- [ ] `exampleHerbs` has 3-5 herbs
- [ ] `traditions` has at least Western tradition
- [ ] `content.overview` is substantive
- [ ] `_meta.sources` has ≥3 URLs

**Glossary Terms:**
- [ ] All `GlossaryTerm` required fields populated (id, term, definition, category)
- [ ] `definition` is concise (1-2 sentences)
- [ ] `etymology` populated
- [ ] At least 1 usage example
- [ ] `_meta.sources` has ≥2 URLs

**Teas:**
- [ ] All `Tea` required fields populated (id, name, teaType, origin, processing, profile, brewing, caffeine, health, content)
- [ ] `origin.country` present
- [ ] `processing.oxidationLevel` and `processing.steps` present
- [ ] `profile` has appearance, liquorColor, aroma, flavor
- [ ] `brewing` has waterTemp, steepTime, leafRatio
- [ ] `caffeine.level` present
- [ ] `health.primaryBenefits` has at least 3 items
- [ ] `content.overview` is substantive
- [ ] `_meta.sources` has ≥4 URLs

### Step 5: Write Staged File

Write to appropriate staging directory:

```
src/data/staging/plants/<id>.json
src/data/staging/conditions/<id>.json
src/data/staging/remedies/<id>.json
src/data/staging/ingredients/<id>.json
src/data/staging/preparations/<id>.json
src/data/staging/actions/<id>.json
src/data/staging/glossary/<id>.json
src/data/staging/teas/<id>.json
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
- Validation checklist result (all passed / gaps found)
- Path to staged file
- Next steps (`/gather --review` or `/gather --merge <path>`)

---

## Execution: Queue Status Command

When user runs `/gather --queue [type]`:

1. Use **Read** to load `src/data/gather-queue.json`
2. For each item, determine status:
   - **merged**: Use **Grep** to check if the item's common-name slug exists as an `id` in the main data file for its type
   - **staged**: Use **Glob** to check `src/data/staging/<pluralDir>/*.json` for a matching file
   - **queued**: Neither merged nor staged
3. Display a breakdown by type:
   ```
   Gather Queue Status
   ═══════════════════
   Plants:       51 total (5 merged, 2 staged, 44 queued)
   Teas:         16 total (1 merged, 0 staged, 15 queued)
   Conditions:   25 total (0 merged, 0 staged, 25 queued)
   Remedies:     20 total (0 merged, 0 staged, 20 queued)
   Ingredients:  20 total (0 merged, 0 staged, 20 queued)
   Preparations: 10 total (0 merged, 0 staged, 10 queued)
   Actions:      25 total (0 merged, 0 staged, 25 queued)
   Terms:        20 total (0 merged, 0 staged, 20 queued)
   ───────────────────
   Total:       187 items
   ```
4. Show the next item per type that would be picked up by `--next`:
   ```
   Next in queue:
     plant:       Ginseng (Panax ginseng)
     tea:         Earl Grey
     condition:   Anxiety
     ...
   ```

If a `[type]` filter is provided, show only that type's items with full detail (name, queue ID, Duke ref if any, notes if any).

---

## Execution: Next-From-Queue Command

When user runs `/gather --next [type]`:

### Step 1: Select Item

1. Use **Read** to load `src/data/gather-queue.json`
2. Filter to the specified type (if provided), otherwise consider all types
3. For each item, check status (same as queue status command) — find the first item with status "queued" (not staged or merged)
4. Report selection to user:
   ```
   Next from queue: Ginseng (Panax ginseng)
   Type: plant | Queue ID: panax-ginseng | Duke ref: available
   Notes: (any notes from queue item)
   ```

### Step 2: Map Queue Item to Gather Parameters

- **Research name**: Use the `name` field (common name)
- **Staged file ID**: Slugify the `name` field (e.g., `"Ginseng"` → `"ginseng"`, `"St. John's Wort"` → `"st-johns-wort"`)
  - **Critical**: Do NOT use the queue item's `id` for the staged file. Plant queue IDs are Latin-name slugs (`panax-ginseng`) but the main database convention is common-name slugs (`ginseng`). All plant queue items have this mismatch.
- **Duke lookup**: Use `dukeRef` field directly if present (no search needed — read `src/data/reference/duke-plants.json` and extract the entry keyed by `dukeRef`)
- **Notes**: Display `notes` field if present before starting research

### Step 3: Execute Standard Flow

Execute the standard gather flow (Steps 1–6) with the mapped parameters. At the end, remind the user:
```
Run `/gather --next [type]` to continue, or `/gather --review` to inspect.
```

---

## Execution: List Command

When user runs `/gather --list <category>`:

1. Use **Read** to load the appropriate main JSON file
2. List all items with id and name
3. Use **Glob** on `src/data/staging/<category>/*.json` to find staged items
4. Display both lists:
   ```
   Plants in database: 15
   - chamomile (Chamomile)
   - lavender (Lavender)
   ...

   Staged plants: 2
   - ashwagandha (pending review)
   - valerian (pending review)
   ```

---

## Execution: Review Command

When user runs `/gather --review`:

1. Use **Glob** with pattern `src/data/staging/**/*.json` to find all staged files
2. For each staged file, use **Read** to load it and show:
   - Item name and type
   - Gathered date
   - Confidence level
   - Source count
   - Any notes/flags

If user wants to review a specific item, read and summarize the staged JSON file.

---

## Execution: Merge Command

When user runs `/gather --merge <file>`:

**File path format:** `plants/valerian.json` or `conditions/headache.json`

### Step 1: Read Staged File

Use **Read** to load `src/data/staging/<file>`.

### Step 2: Validate Structure

Ensure all required fields are present for the item type.

### Step 3: Strip Metadata

Remove the `_meta` block - it's for review only, not for production data.

### Step 4: Determine Operation

- If `_meta.isUpdate` is true: Replace existing item in array
- If `_meta.isUpdate` is false: Append to array

### Step 5: Update Main JSON

Use **Read** to load the main JSON file, add/update the item, then **Write** back.

### Step 6: Remove Staged File

```bash
rm src/data/staging/<file>
```

### Step 7: Verify

```bash
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

## Botanical Section Guidelines

**history**: Cover etymology of common/Latin names, cultural/spiritual significance,
notable historical figures who used it, when it was introduced to different regions.

**nativeRange**: Native geographic regions (Mediterranean, Asia, etc.), preferred
habitats (woodland edges, meadows), elevation ranges, where it has naturalized.

**taxonomy**: Plant family relationships, notable relatives with similar uses,
important subspecies or varieties, cultivars with medicinal significance.

**morphology**: Growth habit (annual/perennial, height), leaf characteristics
(shape, arrangement, texture), flower details (color, timing, structure),
root system, distinctive identifying features.

**storage**: How to store dried herb (airtight container, away from light),
expected shelf life (1-3 years typical), signs of degradation (color fading,
loss of aroma), whether refrigeration/freezing extends life.

**quality**: What to look for when buying (vibrant color, strong aroma, no
mold/insects), reputable sourcing, organic vs conventional considerations,
whole herb vs cut/sifted vs powdered quality differences.

**conservationStatus**: United Plant Savers status (At-Risk, To-Watch),
CITES listings if applicable, whether to prefer cultivated over wildcrafted,
sustainable harvesting practices, alternative herbs if endangered.

**lookalikes**: Dangerous plants commonly confused with this herb, key
distinguishing features, habitat overlap warnings, fatality risks. Critical
for foragers - err on the side of caution.

---

## Ingredient Section Guidelines

**overview**: What it is, primary role in herbal preparations, why it's valuable.

**history**: Traditional use, when/where it originated, cultural significance,
how extraction/production methods evolved.

**production**: How it's made or extracted (cold-pressed, rendered, distilled),
what affects quality during production.

**quality**: Color, scent, and texture of high-quality product. Red flags
(rancidity, adulteration). Organic vs conventional. Where to source.

**usageGuidelines**: Standard percentages in formulas, how to incorporate
into different preparation types, temperature considerations.

**scienceNotes**: Relevant chemistry (fatty acid profile for oils, etc.),
why it works for its intended purpose.

**safety**: Allergy potential, patch testing recommendations, internal use
considerations, pregnancy/children/pet safety when relevant.

---

## Preparation Method Guidelines

**overview**: What this method is, what type of preparation it produces,
why you'd choose it over alternatives.

**history**: Origins of the technique, traditional cultures that developed it,
how the method has evolved.

**theory**: What constituents this method extracts (water-soluble, alcohol-soluble,
oil-soluble), why the process works, what happens chemically.

**bestFor**: Types of herbs suited to this method (roots vs leaves, resinous
vs mucilaginous), specific constituents it captures well.

**notRecommendedFor**: Herbs or constituents that don't extract well with
this method, when to choose a different approach.

**safetyConsiderations**: Hazards during preparation (heat, alcohol fumes),
contamination risks, proper sanitation.

**advancedTechniques**: Variations for experienced practitioners, ways to
optimize extraction, professional-level modifications.

---

## Action Section Guidelines

**overview**: Clear explanation of what this action means, suitable for
someone new to herbalism.

**history**: Etymology of the term, who coined it or when it entered herbal
vocabulary, how understanding has evolved.

**physiology**: Detailed mechanism - what happens in the body, which receptors
or systems are affected, measurable effects.

**clinicalUse**: How practicing herbalists apply this action, what presentations
call for it, typical protocols.

**cautions**: When this action might be inappropriate, conditions where it
could cause harm, populations to be careful with.

**combining**: How this action works with others, complementary actions,
building balanced formulas.

**traditions**: How different traditions conceptualize this action (TCM
equivalent, Ayurvedic parallel), noting that concepts don't always map 1:1.

---

## Glossary Term Guidelines

**definition**: Clear, concise definition accessible to beginners.
One to two sentences maximum.

**etymology**: Word roots (Latin, Greek), literal meaning, how the term
came to be used in herbalism.

**extendedDefinition**: Deeper explanation when the short definition isn't
sufficient, nuances, context.

**history**: When the term entered use, key figures who popularized it,
how meaning has shifted over time.

**modernUsage**: How contemporary herbalists use the term, any variations
in meaning across different schools or traditions.

---

## Tea Section Guidelines

**origin**: Country and specific region (Darjeeling, Yunnan, Fujian, Uji).
Include terroir notes (elevation, climate, soil) when known. Note harvest
season (first flush, second flush, autumn).

**processing**: Oxidation level as percentage or range (0% for green, 15-85%
for oolong, 100% for black). List processing steps in order. Note roast
level for roasted teas. For pu-erh/dark teas, note fermentation and aging.

**profile**: Describe dry leaf appearance, liquor color, aromas (3-5 descriptors),
flavors (3-5 descriptors), mouthfeel (body, astringency), and finish/aftertaste.
Use evocative but accurate tasting vocabulary.

**brewing**: Water temperature in both F and C. Steep time as a range for
first infusion. Leaf ratio in grams per volume. Number of possible resteeps.
Include gongfu parameters for teas suited to that style.

**caffeine**: Level category plus approximate mg per cup when known. Note
L-theanine content or ratio. Describe the character of the energy (jittery
vs calm alertness, duration).

**health**: List 3-5 primary benefits with evidence. Note key compounds
(EGCG for green, theaflavins for black). Include traditional uses (TCM
perspective). Add cautions (caffeine sensitivity, iron absorption timing).

**grading**: Explain the grading system used (Orthodox, CTC, Japanese, Chinese).
Provide the grade and what it means. Help readers understand quality tiers.

**content.history**: When and how the tea originated, cultural significance,
famous examples, how production spread.

**content.culture**: Tea ceremony relevance, regional drinking customs,
traditional preparation methods, when/how it's typically enjoyed.

**content.selection**: What to look for in quality examples (leaf appearance,
aroma), red flags, trusted sources, price expectations.

**content.storage**: Container type, temperature, humidity, light exposure.
Whether it ages well or should be drunk fresh. Signs of degradation.

**content.pairings**: Foods that complement the tea, best times of day,
seasonal considerations.

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

### Valid IngredientCategory Values
`carrier-oil`, `essential-oil`, `wax`, `butter`, `solvent`, `sweetener`, `vinegar`, `clay`, `salt`, `other`

### Valid ActionCategory Values
`nervous-system`, `digestive`, `respiratory`, `cardiovascular`, `immune`, `musculoskeletal`, `reproductive`, `skin-mucous-membrane`, `metabolic`, `general`

### Valid GlossaryCategory Values
`botanical`, `preparation`, `action`, `traditional`, `anatomy`, `chemistry`, `general`

### Valid TeaType Values
`white`, `green`, `yellow`, `oolong`, `black`, `dark`, `blend`

### Valid CaffeineLevel Values
`none`, `very-low`, `low`, `moderate`, `high`, `very-high`

### Valid RoastLevel Values
`none`, `light`, `medium`, `heavy`

---

## Example Sessions

### Plant Example
```
User: /gather plant ashwagandha

Claude: I'll research ashwagandha comprehensively.

[Performs web searches, cross-references sources]

Staged to: src/data/staging/plants/ashwagandha.json

Summary:
- Latin: Withania somnifera (Solanaceae)
- Actions: adaptogen, anxiolytic, immunomodulator, anti-inflammatory
- Body Systems: nervous, immune, endocrine
- Native Range: India, Middle East, parts of Africa
- Morphology: Shrub to 1.5m, oval leaves, small greenish flowers
- Conservation: Not at risk, widely cultivated
- Storage: 2-3 years in airtight container, cool and dark
- Safety: Avoid with thyroid medications, nightshade allergy
- Sources: 8 references cited
- Confidence: HIGH
- Validation: All 12 content sections PRESENT

Run `/gather --review` to inspect the full entry, or `/gather --merge plants/ashwagandha.json` to add to the database.
```

### Queue Example
```
User: /gather --next plant

Claude: Checking gather queue...

Next from queue: Ginseng (Panax ginseng)
Type: plant | Queue ID: panax-ginseng | Duke ref: available

Pre-filling from Duke reference data:
- Family: Araliaceae
- Constituents: 47 compounds across plant parts
- Ethnobotany: 12 traditional uses

[Performs 10 adaptive web searches, cross-references sources]
[Runs validation checklist...]

Validation:
- All Plant required fields: PASS
- Family Latin-only format: PASS (Araliaceae)
- Safety 7 subfields: PASS
- Content 4 core sections: PASS
- Content 8 extended sections: PASS
- Each section substantive: PASS
- Constituents populated: PASS (from Duke)
- Sources ≥4 URLs: PASS (6 URLs)

Staged to: src/data/staging/plants/ginseng.json

Summary:
- Latin: Panax ginseng (Araliaceae)
- Actions: adaptogen, tonic, immunomodulator
- Body Systems: nervous, immune, endocrine
- Safety: Avoid with blood thinners, MAOIs; not for children under 12
- Sources: 6 references cited
- Confidence: HIGH
- All 12 content sections: PRESENT

Run `/gather --next plant` to continue, or `/gather --review` to inspect.
```

### Ingredient Example
```
User: /gather ingredient jojoba oil

Claude: I'll research jojoba oil comprehensively.

[Performs web searches, cross-references sources]

Staged to: src/data/staging/ingredients/jojoba-oil.json

Summary:
- Category: carrier-oil
- Source: Simmondsia chinensis seeds
- Shelf Life: 2-5 years (very stable)
- Uses: salves, oils, lotions, lip balms
- Key Properties: Actually a liquid wax, non-comedogenic, closely mimics sebum
- Substitutes: Meadowfoam seed oil, fractionated coconut oil
- Safety: Generally very safe, rare sensitivity
- Sources: 5 references cited
- Confidence: HIGH

Run `/gather --review` to inspect the full entry, or `/gather --merge ingredients/jojoba-oil.json` to add to the database.
```

### Preparation Example
```
User: /gather preparation tincture

Claude: I'll research tincture-making comprehensively.

[Performs web searches, cross-references sources]

Staged to: src/data/staging/preparations/tincture.json

Summary:
- Type: tincture
- Difficulty: beginner
- Time Required: 4-6 weeks (5 minutes active)
- Equipment: Mason jar, strainer, cheesecloth, amber bottles
- Standard Ratio: 1:5 (dried herb) or 1:2 (fresh herb)
- Best For: Most herbs, especially alkaloids and resins
- Storage: 5+ years in dark glass
- Sources: 6 references cited
- Confidence: HIGH

Run `/gather --review` to inspect the full entry, or `/gather --merge preparations/tincture.json` to add to the database.
```

### Action Example
```
User: /gather action adaptogen

Claude: I'll research the adaptogen action comprehensively.

[Performs web searches, cross-references sources]

Staged to: src/data/staging/actions/adaptogen.json

Summary:
- Category: general (whole-body)
- Definition: Herbs that increase resistance to stress and promote homeostasis
- Mechanism: Modulates HPA axis, supports adrenal function, normalizes cortisol
- Example Herbs: Ashwagandha, Rhodiola, Eleuthero, Holy Basil, Schisandra
- Conditions: Chronic stress, fatigue, burnout, immune support
- Related Actions: nervine, tonic, immunomodulator
- Sources: 6 references cited
- Confidence: HIGH

Run `/gather --review` to inspect the full entry, or `/gather --merge actions/adaptogen.json` to add to the database.
```

### Glossary Example
```
User: /gather term menstruum

Claude: I'll research the term "menstruum" comprehensively.

[Performs web searches, cross-references sources]

Staged to: src/data/staging/glossary/menstruum.json

Summary:
- Category: preparation
- Definition: The solvent used to extract constituents from plant material
- Etymology: Latin "menstruus" (monthly), alchemical term
- Examples: "Use a 50% alcohol menstruum for this tincture"
- Related Terms: marc, maceration, solvent
- Sources: 3 references cited
- Confidence: HIGH

Run `/gather --review` to inspect the full entry, or `/gather --merge glossary/menstruum.json` to add to the database.
```

### Tea Example
```
User: /gather tea longjing

Claude: I'll research Longjing (Dragon Well) tea comprehensively.

[Performs web searches, cross-references sources]

Staged to: src/data/staging/teas/longjing.json

Summary:
- Type: green
- Origin: Zhejiang Province, China (West Lake region)
- Processing: 0% oxidation, pan-fired, hand-pressed flat
- Profile: Flat jade leaves, pale yellow-green liquor, chestnut & vegetal notes
- Brewing: 175°F/80°C, 2-3 min, 3g per 6oz
- Caffeine: moderate, high L-theanine (calm alertness)
- Health: High in catechins/EGCG, antioxidant, focus-enhancing
- Grading: Pre-Qingming (Ming Qian) is highest grade
- Sources: 7 references cited
- Confidence: HIGH

Run `/gather --review` to inspect the full entry, or `/gather --merge teas/longjing.json` to add to the database.
```

---

## Files

- **Staging directory**: `src/data/staging/`
- **Main data files**:
  - `src/data/plants.json` - Herbs and medicinal plants
  - `src/data/conditions.json` - Health conditions
  - `src/data/remedies.json` - Recipes and formulas
  - `src/data/ingredients.json` - Non-plant materials
  - `src/data/preparations.json` - Method guides
  - `src/data/actions.json` - Herbal actions
  - `src/data/glossary.json` - Terminology
  - `src/data/teas.json` - Tea varieties (Camellia sinensis)
- **Reference data**: `src/data/reference/duke-plants.json` (Dr. Duke's Phytochemical DB, CC0)
- **Types**: `src/types/index.ts`
- **Queue data**: `src/data/gather-queue.json` — Item queue (187 items, 8 categories)
- **Queue types**: `src/types/gather-queue.ts` — Queue item interfaces
- **Queue library**: `src/lib/gather-queue.ts` — Queue management functions (reference)
