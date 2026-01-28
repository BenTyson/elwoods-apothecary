#!/usr/bin/env node

/**
 * Extract Duke Entry
 *
 * CLI utility to look up a plant in Dr. Duke's Phytochemical reference
 * and output a compact, filtered JSON summary to stdout.
 *
 * Usage:
 *   node scripts/extract-duke-entry.js <slug-or-name>
 *
 * Accepts:
 *   - Latin-name slug:   allium-sativum
 *   - Common name:       "garlic"
 *   - Latin name:        "Allium sativum"
 *
 * Exit codes:
 *   0 = found
 *   1 = not found
 *
 * Output (JSON):
 *   { slug, latinName, family, commonNames, compounds: { Part: [...] }, ethnobotany }
 *
 * CommonJS, no external dependencies (matches build-duke-reference.js conventions).
 */

const fs = require("fs");
const path = require("path");

// --- Constants ---

const DUKE_PATH = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "reference",
  "duke-plants.json"
);

const MAX_COMPOUNDS_PER_PART = 30;

/**
 * Nutritional / structural noise to filter out of compound lists.
 * Matches are case-insensitive and use startsWith for prefix matching.
 */
const NOISE_EXACT = new Set([
  "water",
  "ash",
  "fat",
  "fiber",
  "protein",
  "carbohydrate",
  "carbohydrates",
  "kilocalories",
  "calories",
  "eo",
  "starch",
  "gum",
  "mufa",
  "pufa",
  "sfa",
  "sugar",
  "sugars",
]);

const NOISE_PREFIXES = [
  "kilocalor",
  "total dietary fiber",
];

/**
 * Common amino acids — filter unless therapeutically notable.
 */
const AMINO_ACIDS = new Set([
  "alanine",
  "arginine",
  "aspartic acid",
  "cystine",
  "cysteine",
  "glutamic acid",
  "glycine",
  "histidine",
  "isoleucine",
  "leucine",
  "lysine",
  "methionine",
  "phenylalanine",
  "proline",
  "serine",
  "threonine",
  "tryptophan",
  "tyrosine",
  "valine",
]);

// --- Helpers ---

/** Slugify: "Allium sativum" → "allium-sativum" */
function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Extract base "Genus species" from a full taxonomic name.
 * Strips subspecies, varieties, hybrid markers.
 */
function baseGenusSpecies(taxon) {
  const words = taxon.trim().toLowerCase().split(/\s+/);
  const parts = [];
  for (const w of words) {
    if (["x", "var.", "subsp.", "nothosubsp.", "f.", "cv."].includes(w))
      continue;
    parts.push(w);
    if (parts.length === 2) break;
  }
  return parts.join(" ");
}

/** Check if a compound name is nutritional noise */
function isNoise(name) {
  const lower = name.toLowerCase();
  if (NOISE_EXACT.has(lower)) return true;
  if (AMINO_ACIDS.has(lower)) return true;
  for (const prefix of NOISE_PREFIXES) {
    if (lower.startsWith(prefix)) return true;
  }
  return false;
}

/** Filter and cap compounds for a single plant part */
function filterCompounds(compounds) {
  return compounds.filter((c) => !isNoise(c)).slice(0, MAX_COMPOUNDS_PER_PART);
}

// --- Lookup ---

/**
 * Find a Duke entry by slug, common name, or Latin name.
 * Returns { slug, entry } or null.
 */
function findEntry(duke, query) {
  const queryLower = query.toLowerCase().trim();
  const querySlug = slugify(query);

  // 1. Direct slug match
  if (duke[querySlug]) {
    return { slug: querySlug, entry: duke[querySlug] };
  }

  // 2. Search by base genus+species slug (handles "Allium sativum var. sativum" → "allium-sativum")
  const baseSlug = slugify(baseGenusSpecies(query));
  if (baseSlug !== querySlug && duke[baseSlug]) {
    return { slug: baseSlug, entry: duke[baseSlug] };
  }

  // 3. Search by common name or Latin name across all entries
  for (const [slug, entry] of Object.entries(duke)) {
    // Match common names (case-insensitive)
    if (entry.commonNames) {
      for (const cn of entry.commonNames) {
        if (cn.toLowerCase() === queryLower) {
          return { slug, entry };
        }
      }
    }
    // Match Latin name (case-insensitive, also try base form)
    if (entry.latinName) {
      const entryLatin = entry.latinName.toLowerCase();
      if (entryLatin === queryLower) {
        return { slug, entry };
      }
      if (baseGenusSpecies(entry.latinName) === queryLower) {
        return { slug, entry };
      }
    }
  }

  return null;
}

// --- Main ---

function main() {
  const query = process.argv.slice(2).join(" ").trim();
  if (!query) {
    console.error(
      "Usage: node scripts/extract-duke-entry.js <slug-or-name>"
    );
    console.error('  e.g.: node scripts/extract-duke-entry.js allium-sativum');
    console.error('        node scripts/extract-duke-entry.js "garlic"');
    console.error('        node scripts/extract-duke-entry.js "Allium sativum"');
    process.exit(1);
  }

  // Load reference
  if (!fs.existsSync(DUKE_PATH)) {
    console.error(`Duke reference not found: ${DUKE_PATH}`);
    process.exit(1);
  }
  const duke = JSON.parse(fs.readFileSync(DUKE_PATH, "utf-8"));

  // Look up
  const result = findEntry(duke, query);
  if (!result) {
    console.error(`Not found in Duke reference: "${query}"`);
    process.exit(1);
  }

  const { slug, entry } = result;

  // Build compact output with filtered compounds
  const output = {
    slug,
    latinName: entry.latinName,
    family: entry.family || null,
    commonNames: entry.commonNames || [],
  };

  if (entry.constituents) {
    output.compounds = {};
    for (const [part, compounds] of Object.entries(entry.constituents)) {
      const filtered = filterCompounds(compounds);
      if (filtered.length > 0) {
        output.compounds[part] = filtered;
      }
    }
  }

  if (entry.ethnobotany) {
    output.ethnobotany = entry.ethnobotany;
  }

  console.log(JSON.stringify(output, null, 2));
  process.exit(0);
}

main();
