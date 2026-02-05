# Gather Data

Research and populate apothecary data with source citations.

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
```

## Workflow

**Queue** → **Research** → **Database**

Items enter Research either manually (`/gather plant sage`) or from the queue (`/gather --next`).
All gathered data is validated and written directly to the main database.

---

## Execution: Research Commands

When user runs any `/gather <type> <name>` command:

**Queue awareness (manual runs):** Before starting, use **Grep** to check if this item exists in `src/data/gather-queue.json` (search by name, case-insensitive). If found, note the queue item's ID and inform the user: `"Note: This item is also in the gather queue (ID: <id>)."` This is informational only — proceed with the gather regardless.

### Step 1: Check Existing Data

Check if `src/data/{type}/{id}.json` exists using the **Glob** or **Read** tool:

| Type | Directory |
|------|-----------|
| plant | `src/data/plants/` |
| condition | `src/data/conditions/` |
| remedy | `src/data/remedies/` |
| ingredient | `src/data/ingredients/` |
| preparation | `src/data/preparations/` |
| action | `src/data/actions/` |
| term | `src/data/glossary/` |
| tea | `src/data/teas/` |

If `src/data/{type}/{id}.json` exists, note this is an **update** (will replace the existing entry).

### Step 1.5: Check Duke Reference (Plants Only)

For plant research, run the extraction script via **Bash**:

```bash
node scripts/extract-duke-entry.js "<plant-name-or-slug>"
```

This accepts a slug (`allium-sativum`), common name (`"garlic"`), or Latin name (`"Allium sativum"`). It outputs compact JSON with filtered compounds (nutritional noise removed, max 30 per part), ethnobotany, family, and common names. Exit code 0 = found, 1 = not found.

If found (exit 0), pre-fill from the output:
- **constituents**: Curate the `compounds` object (see curation rules below)
- **conditions**: Derive from the `ethnobotany` array
- **family**: Use the `family` field (but see APG IV override below)
- **latinName**: Validate against the `latinName` field

Set a `hasDukeData` flag for Step 2 adaptive search.

**Format note**: Duke uses Latin-only family names (e.g., `Lamiaceae`). This is the standard — do not add parenthetical English names.

#### APG IV Taxonomy Override

Duke's database uses older taxonomic classifications. When Duke's family differs from the modern APG IV system, **prefer the APG IV family** and note the discrepancy in the report (e.g., `"Duke lists Liliaceae; updated to Amaryllidaceae per APG IV"`).

Common overrides:

| Duke Family | APG IV Family | Affected Genera |
|-------------|---------------|-----------------|
| Liliaceae | Amaryllidaceae | Allium |
| Labiatae | Lamiaceae | Mentha, Salvia, Ocimum, Lavandula |
| Compositae | Asteraceae | Matricaria, Echinacea, Calendula |
| Umbelliferae | Apiaceae | Angelica, Foeniculum |
| Leguminosae | Fabaceae | Glycyrrhiza, Astragalus |
| Cruciferae | Brassicaceae | Sinapis |
| Gramineae | Poaceae | Avena |
| Guttiferae | Hypericaceae | Hypericum |
| Palmae | Arecaceae | Serenoa |
| Scrophulariaceae | Plantaginaceae | Digitalis (partial move) |

If a genus is not in this table but the Duke family name looks outdated, verify against a current taxonomic source during Step 2 research.

#### Duke Constituent Curation Rules

Duke entries often contain 100-400+ raw compound names across many plant parts (Root, Leaf, Shoot, Seed Oil, Fruit Epidermis, etc.). The `constituents` field on `Plant` is a flat `string[]` — curate down to **15-25 entries** using these rules:

1. **Prioritize pharmacologically significant compounds** — ginsenosides, alkaloids, flavonoids, terpenes, saponins, and other compounds with known therapeutic activity. These are the reason herbalists use the plant.
2. **Include compound classes, not every variant** — write `"ginsenosides (Rb1, Rb2, Rc, Rd, Re, Rf, Rg1)"` rather than listing each ginsenoside as a separate entry. Group related compounds.
3. **Include notable vitamins and minerals only when therapeutically relevant** — e.g., include iron for nettle, vitamin C for rosehips. Skip trace minerals (aluminum, tin, arsenic) and generic entries (water, ash, fat, fiber, kilocalories, protein, carbohydrates).
4. **Skip raw biochemistry artifacts** — entries like `"Eo"`, `"Pt"`, `"Gum"`, `"Starch"`, tissue culture compounds, and items that are plant structural components rather than active constituents.
5. **Focus on the primary medicinal part** — Root constituents matter most for ginseng, leaf constituents for ginkgo, flower constituents for chamomile. Include secondary parts only when they add unique compounds.
6. **Normalize naming** — convert Duke's title-case format (`"Beta Sitosterol"`) to lowercase with hyphens for chemical names (`"beta-sitosterol"`) or natural prose (`"ginsenosides"`). Use common names when widely recognized (`"vitamin C"` not `"ascorbic acid"`).
7. **Include essential oil components when the plant is aromatic** — note 2-4 key volatile compounds (e.g., `"essential oil (linalool, linalyl acetate, camphor)"`).

**Example**: Duke lists 400+ compounds for Panax ginseng. Curated result (~20 entries):
```
ginsenosides (Rb1, Rb2, Rc, Rd, Re, Rf, Rg1, Rg2, Rg3, Rh1, Rh2), protopanaxadiol,
protopanaxatriol, panaxadiol, panaxatriol, panaxydol, panaxynol, panaxytriol,
polyacetylenes, polysaccharides (panaxan A-U), gintonin, beta-sitosterol, stigmasterol,
campesterol, germanium, selenium, ascorbic acid, B vitamins (thiamine, riboflavin,
niacin, B12, folic acid, pantothenic acid, biotin),
essential oil (alpha-panasinsene, beta-farnesene, caryophyllene, limonene)
```

### Step 2: Research

Use WebSearch to gather authoritative information. **All searches within a type are independent — launch ALL searches for a type in a single parallel batch.** Issue them all simultaneously in one tool-call message.

Plant searches are **adaptive** based on Duke data availability.

**For Plants — Always perform (8 core searches):**
1. Search: `"<plant name>" herbal medicine uses traditional`
2. Search: `"<plant name>" contraindications drug interactions safety`
3. Search: `"<plant name>" pregnancy breastfeeding children`
4. Search: `"<plant name>" history origin etymology native range habitat`
5. Search: `"<plant name>" morphology identification characteristics appearance`
6. Search: `"<plant name>" storage quality sourcing shelf life`
7. Search: `"<plant name>" harvesting cultivation growing conditions`
8. Search: `"<plant name>" herbal formula synergy medicinal combination protocol` — Focus on therapeutic pairings; ignore culinary results.

**For Plants — Conditional (add when applicable):**
9. Search: `"<plant name>" conservation status endangered sustainable` — Add when the plant is wild-harvested, foraged, on the United Plant Savers At-Risk/To-Watch list, CITES-listed, OR when genetic diversity is threatened (e.g., garlic's clonal bottleneck) or wild populations are under pressure. Skip only for exclusively seed-cultivated plants with no wild population concerns.
10. Search: `"<plant name>" lookalikes poisonous misidentification` — Add when the genus has wild-foraged relatives (Allium, Sambucus, Apiaceae family) or the plant has documented dangerous lookalikes. Skip only when there are no wild relatives AND no documented lookalikes.

**For Plants — Adaptive (Duke-dependent):**
- **Skip when Duke provides constituents:** ~~`"<latin name>" pharmacology constituents`~~ (pre-filled from Duke)
- **Skip when Duke provides family/taxonomy:** ~~`"<latin name>" taxonomy classification related species`~~ → lighter search: `"<plant name>" related species subspecies varieties` (for narrative content only)
- **When Duke data is NOT available, add both:**
  - Search: `"<latin name>" pharmacology constituents`
  - Search: `"<latin name>" taxonomy classification related species`

**Typical search count:** 8 core + 0-2 conditional + 0-2 adaptive = 8-12 total depending on plant.

**Cross-referencing (all types):** As you review search results, validate key facts across sources inline:
- **Latin names**: Confirm against Duke reference (if available) and at least one search result. Flag discrepancies.
- **Safety information**: Searches #2 and #3 both cover safety — note where sources agree or conflict. If sources conflict on a safety claim, set confidence to `"medium"` or `"low"` and document the conflict in the report.
- **Conflicting claims**: When sources disagree on non-safety facts (e.g., native range, traditional uses), prefer peer-reviewed sources (PMC, PubMed) over commercial sites. Note the disagreement in the relevant content section.

#### Source Priority Tiers

When evaluating and citing sources, apply these tiers:

| Tier | Label | Sources |
|------|-------|---------|
| **1** | Authoritative | PubMed/PMC, NCCIH (nccih.nih.gov), WHO monographs, EMA/HMPC, Merck Manual, MSKCC (mskcc.org/cancer-care/integrative-medicine/herbs) |
| **2** | Reliable | Drugs.com, WebMD, Britannica, .edu domains, peer-reviewed journals |
| **3** | Supplementary | Herbal practitioner sites (Mountain Rose Herbs, Herbal Academy), Wikipedia (taxonomy only) |
| **4** | Avoid as sole source | Blogs, social media, supplement marketing sites |

**Tier rules:**
- Plant, condition, remedy, ingredient, preparation, action, and tea entries need **≥2 Tier 1** sources.
- Glossary terms need **≥1 Tier 1** source.
- List sources in the report in descending tier order (Tier 1 first).
- Never cite a Tier 4 source as the sole support for a claim.

**For Conditions (6 searches):**
1. Search: `"<condition>" herbal remedies evidence clinical trials`
2. Search: `"<condition>" pathophysiology causes risk factors`
3. Search: `"<condition>" symptoms diagnosis when to seek medical help`
4. Search: `"<condition>" lifestyle diet exercise management`
5. Search: `"<condition>" herb drug interactions contraindications safety`
6. Search: `"<condition>" traditional medicine TCM ayurveda natural treatment` — Skip for conditions without established traditional frameworks (e.g., modern diagnoses like ADHD).

**For Remedies (7 core + 1 adaptive):**

**Pre-search inference**: Before launching searches, infer `<primary herb(s)>` and `<remedy type>` from the remedy name. If not obvious from the name (e.g., "Fire Cider", "Four Thieves Vinegar"), use search #1 results to determine them, then launch searches #2-7 as a second batch.

1. Search: `"<remedy name>" herbal recipe preparation method`
2. Search: `"<primary herb(s)>" "<remedy type>" recipe formula traditional`
3. Search: `"<remedy name>" OR "<primary herb(s)> <remedy type>" dosage amount frequency`
4. Search: `"<primary herb(s)>" synergy combination benefit evidence`
5. Search: `"<primary herb(s)>" "<remedy type>" safety contraindications drug interactions`
6. Search: `"<remedy name>" storage preservation shelf life`
7. Search: `"<remedy name>" OR "<remedy type>" troubleshooting tips common mistakes beginner`

**Adaptive (add based on internal vs external type):**
- **Internal types** (tea, decoction, tincture, syrup, capsule): add `"<remedy name>" dosage children adults elderly pregnancy`
- **External types** (salve, oil, poultice, compress, bath): add `"<remedy type>" application technique frequency skin patch test`

**For Ingredients:**
1. Search: `"<ingredient>" herbal preparations uses`
2. Search: `"<ingredient>" properties composition profile characteristics`
3. Search: `"<ingredient>" quality sourcing buying guide`
4. Search: `"<ingredient>" storage shelf life`
5. Search: `"<ingredient>" safety sensitivity allergies internal external toxicity`
6. Search: `"<ingredient>" substitutes alternatives comparison when to use`
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
8. Search: `"<preparation type>" safety precautions contamination sanitation hygiene`

**For Actions:**
1. Search: `"<action>" herbal action definition`
2. Search: `"<action>" mechanism how it works physiology`
3. Search: `"<action>" herbs examples plants`
4. Search: `"<action>" conditions indications uses`
5. Search: `"<action>" etymology origin term`
6. Search: `"<action>" traditional chinese medicine ayurveda`
7. Search: `"<action>" related actions similar`
8. Search: `"<action>" clinical herbalist protocol dosage formulation`

**For Glossary Terms:**
1. Search: `"<term>" herbal definition meaning`
2. Search: `"<term>" etymology word origin`
3. Search: `"<term>" herbalism context usage`
4. Search: `"<term>" related terms synonyms antonyms herbalism`
5. Search: `"<term>" history traditional herbal medicine evolution`

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

**For Teas — Blend adaptation (`teaType: 'blend'`):**
When the tea is a blend (Earl Grey, English Breakfast, Chai, etc.), adapt these searches:
- Search **#1**: Replace `origin region terroir` → `blend components origins base tea` (blends have no single origin)
- Search **#2**: Replace `processing oxidation production` → `blend composition ratio ingredients recipe` (blends combine finished teas or add flavorings)
- Search **#7**: Replace `grading quality selection` → `brand quality selection best examples` (blends are evaluated by brand/blend quality, not leaf grade)

### Step 3: Structure Data

Read `src/types/index.ts` on the **FIRST** gather of a session only. If you can recall the Plant/PlantContent interfaces without re-reading, you already have the types loaded. Do **NOT** read again.

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
- **Plant-specific override**: All 10 extended content sections (`harvesting`, `cultivation`, `history`, `nativeRange`, `taxonomy`, `morphology`, `storage`, `quality`, `conservationStatus`, `lookalikes`) are editorially required despite being TypeScript-optional.
- **Remedy-specific override**: `tips`, `variations`, `storage`, `safety`, and `dosage` (internal types only) are editorially required despite being TypeScript-optional.

**Format conventions:**
- `family`: Latin only — `"Lamiaceae"` not `"Lamiaceae (Mint family)"`
- `id`: common-name kebab-case — `"valerian"` not `"valeriana-officinalis"`
- `taste` / `energy`: lowercase, comma-separated — `"bitter, pungent"`
- `latinName`: Use base species binomial — `"Allium sativum"` not `"Allium sativum var. sativum"`. Strip Duke's variety/subspecies markers. Note full taxonomy (varieties, cultivars) in the `taxonomy` content section.
- Array strings: lowercase unless proper nouns — `["nervine", "adaptogen"]`

**Content section length targets** (sentences per section — enforces consistent entry size):

| Section | Target | Notes |
|---------|--------|-------|
| `overview` | 5-8 sentences | The anchor section; cover what the plant is, key uses, and significance |
| `traditionalUses` | 5-8 sentences | Cover multiple traditions if applicable |
| `modernResearch` | 5-8 sentences | Summarize evidence; note quality of studies |
| `howToUse` | 5-8 sentences | Practical preparation and dosing guidance |
| `history` | 5-8 sentences | Etymology, cultural significance, key historical figures |
| `nativeRange` | 3-5 sentences | Geography, habitat, elevation, naturalization |
| `taxonomy` | 3-5 sentences | Family, relatives, subspecies, cultivars |
| `morphology` | 4-6 sentences | Growth habit, leaves, flowers, roots, ID features |
| `harvesting` | 3-5 sentences | When/how to harvest, age requirements |
| `cultivation` | 3-5 sentences | Growing conditions, challenges, disease |
| `storage` | 3-5 sentences | Shelf life, containers, degradation signs |
| `quality` | 3-5 sentences | Buying indicators, adulteration risks |
| `conservationStatus` | 3-5 sentences | Threat level, regulations, sustainable alternatives |
| `lookalikes` | 4-8 sentences | Each dangerous lookalike with distinguishing features |

**Remedy section length targets** (non-content fields):

| Section | Target | Notes |
|---------|--------|-------|
| `description` | 3-5 sentences | What it does, heritage/tradition, who benefits, when to use |
| `instructions` | ≥4 numbered steps | Each with timing cues, temperature, or sensory indicators |
| `tips` | ≥3 items | Common mistakes, yield optimization, beginner wisdom |
| `variations` | ≥2 items | Meaningful alternatives with rationale |
| `storage` | 1-3 sentences | Container type, temperature, shelf life, spoilage signs |
| `safety` | 2-4 sentences | Contraindications, drug interactions, vulnerable populations |
| `dosage` | ≥2 keys with 1-2 sentence values | Adult + child dosing per scenario (e.g., prevention, acute). Internal remedies only. |

**Ingredient content section length targets:**

| Section | Target |
|---------|--------|
| `content.overview` | 4-6 sentences |
| `content.history` | 3-5 sentences |
| `content.production` | 3-5 sentences |
| `content.quality` | 3-5 sentences |
| `content.usageGuidelines` | 3-5 sentences |
| `content.scienceNotes` | 3-5 sentences |

**Preparation content section length targets:**

| Section | Target |
|---------|--------|
| `content.overview` | 4-6 sentences |
| `content.history` | 3-5 sentences |
| `content.theory` | 4-6 sentences |
| `content.bestFor` | 3-5 sentences |
| `content.notRecommendedFor` | 2-4 sentences |
| `content.safetyConsiderations` | 3-5 sentences |
| `content.advancedTechniques` | 3-5 sentences |

**Action content section length targets:**

| Section | Target |
|---------|--------|
| `content.overview` | 4-6 sentences |
| `content.history` | 3-5 sentences |
| `content.physiology` | 4-6 sentences |
| `content.clinicalUse` | 3-5 sentences |
| `content.cautions` | 2-4 sentences |
| `content.combining` | 3-5 sentences |

**Glossary term content section length targets:**

| Section | Target |
|---------|--------|
| `definition` | 1-2 sentences |
| `etymology` | 1-3 sentences |
| `content.extendedDefinition` | 3-5 sentences |
| `content.history` | 2-4 sentences |
| `content.modernUsage` | 2-4 sentences |

For non-plant types not listed above, aim for 3-5 sentences per content section unless the guidelines below specify otherwise.

### Step 3.5: Validation Checklist

Before writing to the database, verify every item against the checklist for its type. **If any check fails, go back and fill the gap with additional targeted research. Do not proceed to Step 4 with gaps.**

**Plants:**
- [ ] All `Plant` required fields populated (id, commonName, latinName, family, partsUsed, taste, energy, actions, bodySystems, conditions, preparations, traditions, seasons, safety, dosage, content)
- [ ] `family` is Latin-only format (e.g., `"Lamiaceae"`)
- [ ] `id` is common-name kebab-case (e.g., `"valerian"`)
- [ ] `safety` has ALL 7 subfields: generalSafety, contraindications, drugInteractions, pregnancySafe, pregnancyNotes, nursingNotes, childrenNotes
- [ ] `content` has 4 core sections: overview, traditionalUses, modernResearch, howToUse
- [ ] `content` has all 8 extended sections: history, nativeRange, taxonomy, morphology, storage, quality, conservationStatus, lookalikes
- [ ] `content` has harvesting and cultivation sections
- [ ] Each content section meets length targets (see table above)
- [ ] `constituents` populated and curated (15-25 entries, see Duke curation rules)
- [ ] `combinations` has 3-5 herb pairings with purposes
- [ ] ≥4 sources cited (≥2 Tier 1)

**Conditions:**
- [ ] All `Condition` required fields populated (id, name, category, description, symptoms, herbs, approaches, lifestyle, whenToSeek)
- [ ] `category` is a valid `BodySystem` value
- [ ] `description` is 3-5 sentences covering pathophysiology and herbal framing
- [ ] `symptoms` has ≥8 items covering both physical and psychological manifestations
- [ ] `herbs` has ≥5 entries, ordered by evidence strength (most supported first)
- [ ] `approaches` has ≥5 items, each following the format: `"<Category> (<specific herbs>) for <use case> — <evidence or practical note>"`
- [ ] `lifestyle` has ≥5 items with actionable specifics (dosing, frequency, or measurable targets)
- [ ] `whenToSeek` is ≥2 sentences covering timeline triggers, red-flag symptoms, and emergency indicators
- [ ] ≥5 sources cited (≥2 Tier 1)

**Remedies:**
- [ ] All `Remedy` required fields populated (id, name, type, difficulty, prepTime, yield, description, herbs, conditions, bodySystems, ingredients, instructions)
- [ ] `type` is a valid `PreparationType`
- [ ] `description` is 3-5 sentences
- [ ] `ingredients` has ≥3 items, each with amount specified
- [ ] `instructions` has ≥4 steps, each with a clear action
- [ ] `herbs` has ≥2 entries using plant ID format (kebab-case common names); note any IDs not yet in `plants.json` in the report
- [ ] `conditions` has ≥2 entries
- [ ] `tips` has ≥3 practical items
- [ ] `variations` has ≥2 items
- [ ] `storage` populated (string field)
- [ ] `dosage` populated for internal remedies (tea, decoction, tincture, syrup, capsule)
- [ ] `safety` is 2-4 sentences covering contraindications, drug interactions, and vulnerable populations
- [ ] ≥4 sources cited (≥2 Tier 1)

**Ingredients:**
- [ ] All `Ingredient` required fields populated (id, name, category, source, description, properties, uses, content)
- [ ] `uses` has ≥3 items
- [ ] `properties` has shelfLife, storageRequirements, and ≥2 additional fields (texture, color, scent, etc.)
- [ ] `substitutes` has ≥1 item with notes explaining when/why to use
- [ ] `safety` has generalSafety, internalUse, and at least allergens or sensitivityNotes
- [ ] `content.overview` is ≥4 sentences
- [ ] All populated content sections meet length targets
- [ ] ≥4 sources cited (≥2 Tier 1)

**Preparations:**
- [ ] All `Preparation` required fields populated (id, name, type, description, difficulty, timeRequired, equipment, ingredientTypes, ratios, process, storage, content)
- [ ] `ratios` has ≥2 entries (standard + at least one variation)
- [ ] `process` has ≥5 steps with clear instructions
- [ ] `equipment` has ≥3 items
- [ ] `ingredientTypes` has ≥2 items
- [ ] `troubleshooting` has ≥3 items
- [ ] `variations` has ≥1 item with description and modifications
- [ ] `storage` has all 4 subfields (container, conditions, shelfLife, signsOfSpoilage)
- [ ] All populated content sections meet length targets
- [ ] ≥4 sources cited (≥2 Tier 1)

**Actions:**
- [ ] All `Action` required fields populated (id, name, definition, category, mechanism, exampleHerbs, conditions, traditions, content)
- [ ] `conditions` has ≥3 items
- [ ] `relatedActions` has ≥2 items
- [ ] `traditions` has ≥2 entries (Western + at least one other when applicable)
- [ ] `mechanism` is ≥2 sentences
- [ ] `definition` is exactly 1 clear sentence
- [ ] All populated content sections meet length targets
- [ ] ≥4 sources cited (≥2 Tier 1)

**Glossary Terms:**
- [ ] All `GlossaryTerm` required fields populated (id, term, definition, category)
- [ ] `definition` is concise (1-2 sentences)
- [ ] `etymology` populated
- [ ] `usageExamples` has ≥2 examples
- [ ] `relatedTerms` has ≥2 related terms
- [ ] `seeAlso` has ≥1 cross-reference to plant, action, preparation, condition, or ingredient
- [ ] `content` populated with at least `extendedDefinition`
- [ ] All populated content sections meet length targets
- [ ] ≥3 sources cited (≥1 Tier 1)

**Teas:**
- [ ] All `Tea` required fields populated (id, name, teaType, origin, processing, profile, brewing, caffeine, health, content)
- [ ] `origin.country` present
- [ ] `processing.oxidationLevel` and `processing.steps` present
- [ ] `profile` has appearance, liquorColor, aroma, flavor
- [ ] `brewing` has waterTemp, steepTime, leafRatio
- [ ] `caffeine.level` present
- [ ] `health.primaryBenefits` has at least 3 items
- [ ] `content.overview` is substantive
- [ ] ≥4 sources cited (≥2 Tier 1)

### Step 4: Write to Database

Write the gathered data as an individual JSON file.

1. **Write** the entry to `src/data/{type}/{id}.json` using the **Write** tool (single file, no read needed)
2. **If new entry**: Read `src/data/{type}/index.ts`, then make two **Edit** calls:
   - **Import**: Add `import {varName} from './{id}.json';` after the last existing `import ... from` line
   - **Array**: Add `  {varName} as unknown as {TypeName},` before the closing `];`
   - Variable name is the id in camelCase (e.g., `st-johns-wort` → `stJohnsWort`)
3. **If update**: Just overwrite the JSON file — the barrel already has the import

**Do NOT include `_meta` in the database** — metadata (sources, confidence, notes) is for the report output only.

### Step 4.5: Post-Write Content Length Audit (Plants, Teas, Ingredients, Preparations, and Actions)

After writing, read the entry back and audit each content section against the length targets from Step 3.

1. For each content section, count sentences (approximate: split on `. `, `! `, `? `).
2. Compare against the target range.
3. If any section is **under the minimum**, perform a targeted follow-up search to expand it, then update the database entry.
4. Build an audit table for the Step 5 report.

### Step 5: Report Summary

Output a summary:
- Item name and Latin name (for plants)
- Key properties (actions, body systems, etc.)
- Safety highlights
- Sources cited (count + tier breakdown)
- Confidence level (high/medium/low)
- Validation checklist result (all passed / gaps found)
- Confirmation: written to `src/data/{type}/{id}.json`
- Next steps: `Run /gather --next [type] to continue.`

---

## Execution: Queue Status Command

When user runs `/gather --queue [type]`:

1. Use **Read** to load `src/data/gather-queue.json`
2. For each item, determine status:
   - **done**: Check if `src/data/{type}/{id}.json` exists (use **Glob**)
   - **queued**: Not yet in the database
3. Display a breakdown by type:
   ```
   Gather Queue Status
   ═══════════════════
   Plants:       51 total (5 done, 46 queued)
   Teas:         16 total (1 done, 15 queued)
   Conditions:   25 total (0 done, 25 queued)
   Remedies:     20 total (0 done, 20 queued)
   Ingredients:  20 total (0 done, 20 queued)
   Preparations: 10 total (0 done, 10 queued)
   Actions:      25 total (0 done, 25 queued)
   Terms:        20 total (0 done, 20 queued)
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
3. For each item, check status (same as queue status command) — find the first item with status "queued" (not yet in database)
4. Report selection to user:
   ```
   Next from queue: Ginseng (Panax ginseng)
   Type: plant | Queue ID: panax-ginseng | Duke ref: available
   Notes: (any notes from queue item)
   ```

### Step 2: Map Queue Item to Gather Parameters

- **Research name**: Use the `name` field (common name)
- **Database ID**: Slugify the `name` field (e.g., `"Ginseng"` → `"ginseng"`, `"St. John's Wort"` → `"st-johns-wort"`)
  - **Critical**: Do NOT use the queue item's `id` for the database entry. Plant queue IDs are Latin-name slugs (`panax-ginseng`) but the main database convention is common-name slugs (`ginseng`). All plant queue items have this mismatch.
- **Duke lookup**: Use `dukeRef` field directly if present (no search needed — read `src/data/reference/duke-plants.json` and extract the entry keyed by `dukeRef`)
- **Notes**: Display `notes` field if present before starting research

### Step 3: Execute Standard Flow

Execute the standard gather flow (Steps 1–5) with the mapped parameters. At the end, remind the user:
```
Run `/gather --next [type]` to continue.
```

---

## Execution: List Command

When user runs `/gather --list <category>`:

1. Use **Glob** to list `src/data/{type}/*.json` files, then read each to extract id and name
2. List all items with id and name:
   ```
   Plants in database: 15
   - chamomile (Chamomile)
   - lavender (Lavender)
   ...
   ```

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

**harvesting**: When to harvest (season, plant age, time of day), which part
to harvest, sustainable harvesting practices, post-harvest processing (drying,
cleaning), how harvest timing affects potency.

**cultivation**: Growing conditions (light, soil, pH, moisture), propagation
methods (seed, division, cuttings), common pests and diseases, growth rate,
time to harvest maturity, replant considerations.

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

## Condition Section Guidelines

**description** (3-5 sentences): What the condition is, underlying
pathophysiology or mechanisms (e.g., HPA axis dysregulation for anxiety,
inflammatory cascade for arthritis), how common it is, and how herbal
approaches frame the condition (e.g., nervine support, immune modulation).
Avoid clinical jargon but include enough mechanism to justify the herbal
strategy.

**symptoms** (≥8 items): Cover both physical and psychological manifestations.
Order from most common/recognizable to less obvious. Use lowercase, descriptive
phrases — not single words. Include the experience, not just the label
(e.g., `"fatigue despite adequate rest"` not `"fatigue"`).

**herbs** (≥5 entries): Order by evidence strength — herbs with clinical trial
support first, traditional-use-only herbs last. Use kebab-case IDs matching
the plant database (e.g., `"lemon-balm"` not `"Lemon Balm"`). Include herbs
from different action categories when applicable (nervines + adaptogens for
anxiety, immune stimulants + anti-inflammatories for cold).

**approaches** (≥5 items): Each entry should follow this format:
`"<Herbal category/action> (<specific herbs>) for <use case> — <evidence, dosing note, or practical guidance>"`
Cover different therapeutic strategies: acute relief, chronic support,
symptomatic management, combination formulas. Include preparation forms
(tea, tincture, extract) and any time-limited guidance (e.g., kava ≤8 weeks).

**lifestyle** (≥5 items): Each item must include actionable specifics — not
just `"exercise"` but frequency, type, and evidence-based targets (e.g.,
`"2+ hours/week moderate activity"`). Cover the major lifestyle domains:
movement, sleep, diet, substances to limit, stress management, social/environmental.

**whenToSeek** (≥2 sentences): Must include: (1) a timeline trigger for
when symptoms have persisted long enough to warrant professional evaluation,
(2) specific red-flag symptoms that need prompt attention, (3) emergency
indicators or differential diagnosis flags (e.g., cardiac symptoms that
mimic anxiety). Be concrete — `"persists most days for six weeks"` not
`"persists for a long time"`.

---

## Remedy Section Guidelines

**description** (3-5 sentences): What the remedy does, its heritage or
tradition, who benefits most, and when to use it. Frame the remedy's purpose
clearly so users understand why they'd choose it.

**ingredients**: Precise amounts with plant parts specified (e.g., "2 tbsp dried
chamomile flowers"). Include notes for key substitutions where applicable.

**instructions** (≥4 numbered steps): Each step should include timing cues,
temperature when relevant, and sensory indicators (color, smell, texture) that
signal readiness. Write for someone making this for the first time.

**tips** (≥3 items): Common mistakes and how to avoid them, yield optimization,
beginner wisdom. Practical, experience-based advice that won't be found in a
bare recipe.

**variations** (≥2 items): Meaningful alternatives with rationale — not just
"add X" but why (e.g., "substitute valerian for passionflower for deeper
sedation"). Each variation should serve a different purpose or audience.

**storage**: Container type (amber glass, tin, etc.), temperature (cool/dark,
refrigerated), expected shelf life, and signs of spoilage (color change,
off smell, mold).

**safety** (2-4 sentences): Cover contraindications, known drug interactions,
age restrictions, and pregnancy/nursing considerations. Be specific —
name the drug classes or conditions, not just "consult a doctor."

**dosage** (internal remedies only): Populate for tea, decoction, tincture,
syrup, and capsule types. Include adult dosing (amount and frequency) and
child dosing or age restrictions. Note maximum duration if applicable.

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

Note: This item is also in the gather queue (ID: withania-somnifera).

[Performs 8 core searches + 0 conditional (cultivated herb, no foraging)]
[Duke reference: available — skipping constituent/taxonomy searches]

Validation: All checks passed
Written to: src/data/plants/ashwagandha.json

Summary:
- Latin: Withania somnifera (Solanaceae)
- Actions: adaptogen, anxiolytic, immunomodulator, anti-inflammatory
- Body Systems: nervous, immune, endocrine
- Safety: Avoid with thyroid medications, nightshade allergy
- Sources: 8 cited (3 Tier 1)
- Confidence: HIGH

Run `/gather --next plant` to continue.
```

### Condition Example
```
User: /gather condition anxiety

Claude: I'll research anxiety comprehensively.

Note: This item is also in the gather queue (ID: anxiety).

[Performs 3 searches in parallel]

Validation: All checks passed
Written to: src/data/conditions/anxiety.json

Summary:
- Category: nervous
- Herbs: 8 (lavender, chamomile, passionflower, lemon balm, ashwagandha, valerian, holy basil, kava)
- Approaches: 7 (anxiolytic nervines, calming nervines, adaptogens, sedative nervines, kava, aromatherapy, combinations)
- Sources: 7 cited (3 Tier 1)
- Confidence: HIGH

Run `/gather --next condition` to continue.
```

### Queue Example
```
User: /gather --next plant

Claude: Checking gather queue...

Next from queue: Ginseng (Panax ginseng)
Type: plant | Queue ID: panax-ginseng | Duke ref: available

[Performs 8 core + 2 conditional + 1 lighter taxonomy = 11 searches]

Validation: All checks passed
Written to: src/data/plants/ginseng.json (new entry + barrel updated)

Summary:
- Latin: Panax ginseng (Araliaceae)
- Actions: adaptogen, tonic, immunomodulator
- Body Systems: nervous, immune, endocrine
- Safety: Avoid with blood thinners, MAOIs; not for children
- Sources: 10 cited (4 Tier 1)
- Confidence: HIGH

Run `/gather --next plant` to continue.
```

---

## Files

- **Data directories** (file-per-entry, each entry is `{id}.json` + barrel `index.ts`):
  - `src/data/plants/` - Herbs and medicinal plants
  - `src/data/conditions/` - Health conditions
  - `src/data/remedies/` - Recipes and formulas
  - `src/data/ingredients/` - Non-plant materials
  - `src/data/preparations/` - Method guides
  - `src/data/actions/` - Herbal actions
  - `src/data/glossary/` - Terminology
  - `src/data/teas/` - Tea varieties (Camellia sinensis)
- **Reference data**: `src/data/reference/duke-plants.json` (Dr. Duke's Phytochemical DB, CC0)
- **Types**: `src/types/index.ts`
- **Queue data**: `src/data/gather-queue.json` — Item queue (187 items, 8 categories)
- **Queue types**: `src/types/gather-queue.ts` — Queue item interfaces
- **Queue library**: `src/lib/gather-queue.ts` — Queue management functions (reference)
