#!/usr/bin/env node

/**
 * Build Duke Reference Data
 *
 * Processes Dr. Duke's Phytochemical & Ethnobotanical Database CSVs
 * into a compact JSON reference file for the /gather skill.
 *
 * Usage: node scripts/build-duke-reference.js <path-to-duke-csvs>
 * Output: src/data/reference/duke-plants.json
 *
 * Source: USDA Dr. Duke's Phytochemical and Ethnobotanical Databases (CC0)
 */

const fs = require("fs");
const path = require("path");

// --- CSV Parser (handles quoted fields) ---

function parseCSVLine(line) {
  const fields = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      fields.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  if (lines.length === 0) return [];

  const headers = parseCSVLine(lines[0]).map((h) => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseCSVLine(line);
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = (values[idx] || "").trim();
    });
    rows.push(row);
  }

  return rows;
}

// --- Helpers ---

/** Clean chemical name: "BORNYL-ACETATE" → "Bornyl Acetate" */
function cleanChemName(raw) {
  return raw
    .replace(/-/g, " ")
    .toLowerCase()
    .replace(/\b[a-z]/g, (c) => c.toUpperCase())
    .trim();
}

/** Slugify: "Valeriana officinalis" → "valeriana-officinalis" */
function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Extract base "Genus species" from a full taxonomic name.
 * Strips subspecies, varieties, hybrid markers ("x"), authorities, etc.
 * "Mentha x piperita subsp. nothosubsp. piperita" → "mentha piperita"
 * "Allium sativum var. sativum" → "allium sativum"
 */
function baseGenusSpecies(taxon) {
  const words = taxon.trim().toLowerCase().split(/\s+/);
  const parts = [];
  for (const w of words) {
    if (
      w === "x" ||
      w === "var." ||
      w === "subsp." ||
      w === "nothosubsp." ||
      w === "f." ||
      w === "cv."
    )
      continue;
    parts.push(w);
    if (parts.length === 2) break;
  }
  return parts.join(" ");
}

// --- Main ---

function main() {
  const srcDir = process.argv[2];
  if (!srcDir) {
    console.error(
      "Usage: node scripts/build-duke-reference.js <path-to-duke-csvs>"
    );
    process.exit(1);
  }

  const outPath = path.join(
    __dirname,
    "..",
    "src",
    "data",
    "reference",
    "duke-plants.json"
  );

  console.log("Reading CSV files...");

  // 1. PARTS lookup (PPCO → part name)
  const partsRows = parseCSV(path.join(srcDir, "PARTS.csv"));
  const partsMap = {};
  for (const row of partsRows) {
    if (row.PPCO && row.PPNA) partsMap[row.PPCO] = row.PPNA;
  }
  console.log(`  PARTS: ${Object.keys(partsMap).length} codes`);

  // 2. FNFTAX (taxonomy — primary table)
  const taxRows = parseCSV(path.join(srcDir, "FNFTAX.csv"));
  console.log(`  FNFTAX: ${taxRows.length} plants`);

  const taxByNum = {};
  for (const row of taxRows) {
    taxByNum[row.FNFNUM] = row;
  }

  // 3. COMMON_NAMES → grouped by FNFNUM
  const cnRows = parseCSV(path.join(srcDir, "COMMON_NAMES.csv"));
  console.log(`  COMMON_NAMES: ${cnRows.length} names`);

  const commonNamesByNum = {};
  for (const row of cnRows) {
    const num = row.FNFNUM;
    const name = row.CNNAM ? row.CNNAM.trim() : "";
    if (!name) continue;
    if (!commonNamesByNum[num]) commonNamesByNum[num] = [];
    commonNamesByNum[num].push(name);
  }

  // 4. FARMACY_NEW (chemicals) → grouped by FNFNUM and plant part
  const farmRows = parseCSV(path.join(srcDir, "FARMACY_NEW.csv"));
  console.log(`  FARMACY_NEW: ${farmRows.length} chemical records`);

  const chemsByNum = {};
  for (const row of farmRows) {
    const num = row.FNFNUM;
    const chem = row.CHEM ? row.CHEM.trim() : "";
    const ppco = row.PPCO ? row.PPCO.trim() : "";
    if (!chem) continue;

    if (!chemsByNum[num]) chemsByNum[num] = {};
    const partName = partsMap[ppco] || ppco || "Unspecified";
    if (!chemsByNum[num][partName]) chemsByNum[num][partName] = new Set();
    chemsByNum[num][partName].add(cleanChemName(chem));
  }

  // 5. ETHNOBOT (ethnobotanical uses)
  //    Index by both full TAXON and base genus+species for fuzzy matching.
  //    ETHNOBOT uses names like "Matricaria chamomilla" while FNFTAX may
  //    use "Matricaria recutita" for the same plant.
  const ethnoRows = parseCSV(path.join(srcDir, "ETHNOBOT.csv"));
  console.log(`  ETHNOBOT: ${ethnoRows.length} ethnobotanical records`);

  const ethnoByTaxon = {}; // exact full taxon (lowercased)
  const ethnoByBase = {}; // base genus+species (lowercased)
  for (const row of ethnoRows) {
    const taxon = row.TAXON ? row.TAXON.trim().toLowerCase() : "";
    const activity = row.ACTIVITY ? row.ACTIVITY.trim() : "";
    if (!taxon || !activity) continue;

    if (!ethnoByTaxon[taxon]) ethnoByTaxon[taxon] = new Set();
    ethnoByTaxon[taxon].add(activity);

    const base = baseGenusSpecies(taxon);
    if (base && base !== taxon) {
      if (!ethnoByBase[base]) ethnoByBase[base] = new Set();
      ethnoByBase[base].add(activity);
    }
  }

  // 6. Assemble output
  //    Key by base genus+species slug. When multiple FNFTAX entries share
  //    the same base (e.g., subspecies/varieties), merge their data.
  console.log("\nBuilding reference data...");
  const output = {};
  let skipped = 0;

  for (const row of taxRows) {
    const fnfnum = row.FNFNUM;
    const taxon = row.TAXON ? row.TAXON.trim() : "";
    const family = row.FAMILY ? row.FAMILY.trim() : "";

    if (!taxon) {
      skipped++;
      continue;
    }

    const base = baseGenusSpecies(taxon);
    const slug = slugify(base);

    const commonNames = commonNamesByNum[fnfnum] || [];
    const constituentsRaw = chemsByNum[fnfnum] || {};

    // Look up ethnobotany: try exact taxon first, then base genus+species
    const taxonLower = taxon.toLowerCase();
    let ethnoUses = ethnoByTaxon[taxonLower];
    if (!ethnoUses || ethnoUses.size === 0) {
      ethnoUses = ethnoByBase[base] || ethnoByTaxon[base] || new Set();
    }

    const hasConstituents = Object.keys(constituentsRaw).length > 0;
    const hasEthno = ethnoUses.size > 0;
    const hasCommonNames = commonNames.length > 0;

    // Skip entries with no useful data beyond bare taxonomy
    if (!hasConstituents && !hasEthno && !hasCommonNames) {
      skipped++;
      continue;
    }

    // Convert constituent Sets → sorted arrays
    const constituents = {};
    for (const [part, chems] of Object.entries(constituentsRaw)) {
      constituents[part] = Array.from(chems).sort();
    }

    // If this slug already exists (subspecies merging), merge data
    if (output[slug]) {
      const existing = output[slug];

      // Merge common names (deduplicate)
      if (hasCommonNames) {
        const nameSet = new Set(existing.commonNames || []);
        for (const n of commonNames) nameSet.add(n);
        existing.commonNames = Array.from(nameSet);
      }

      // Merge constituents
      if (hasConstituents) {
        if (!existing.constituents) existing.constituents = {};
        for (const [part, chems] of Object.entries(constituents)) {
          if (!existing.constituents[part]) {
            existing.constituents[part] = chems;
          } else {
            const merged = new Set(existing.constituents[part]);
            for (const c of chems) merged.add(c);
            existing.constituents[part] = Array.from(merged).sort();
          }
        }
      }

      // Merge ethnobotany
      if (hasEthno) {
        const merged = new Set(existing.ethnobotany || []);
        for (const e of ethnoUses) merged.add(e);
        existing.ethnobotany = Array.from(merged).sort();
      }
    } else {
      const entry = { latinName: taxon };
      if (family) entry.family = family;
      if (hasCommonNames) entry.commonNames = commonNames;
      if (hasConstituents) entry.constituents = constituents;
      if (hasEthno) entry.ethnobotany = Array.from(ethnoUses).sort();

      output[slug] = entry;
    }
  }

  console.log(`\nResults:`);
  console.log(`  Total plants in FNFTAX: ${taxRows.length}`);
  console.log(`  Plants with useful data: ${Object.keys(output).length}`);
  console.log(`  Skipped (no data): ${skipped}`);

  // Write output
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const json = JSON.stringify(output, null, 2);
  fs.writeFileSync(outPath, json + "\n", "utf-8");

  const sizeMB = (Buffer.byteLength(json, "utf-8") / (1024 * 1024)).toFixed(2);
  console.log(`\nWrote ${outPath}`);
  console.log(`  Size: ${sizeMB} MB`);

  // Spot-check known plants
  const checks = [
    "valeriana-officinalis",
    "matricaria-recutita",
    "chamaemelum-nobile",
    "sambucus-nigra",
    "lavandula-angustifolia",
    "zingiber-officinale",
    "mentha-piperita",
    "allium-sativum",
    "echinacea-purpurea",
    "curcuma-longa",
  ];
  console.log("\nSpot checks:");
  for (const slug of checks) {
    if (output[slug]) {
      const e = output[slug];
      const parts = e.constituents ? Object.keys(e.constituents).length : 0;
      const chems = e.constituents
        ? Object.values(e.constituents).reduce((sum, a) => sum + a.length, 0)
        : 0;
      const ethno = e.ethnobotany ? e.ethnobotany.length : 0;
      console.log(
        `  + ${slug}: ${e.commonNames?.join(", ") || "(no common name)"} [${e.family}] — ${chems} chemicals in ${parts} parts, ${ethno} ethno uses`
      );
    } else {
      console.log(`  - ${slug}: NOT FOUND`);
    }
  }
}

main();
