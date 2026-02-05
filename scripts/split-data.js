#!/usr/bin/env node
// Migration script: Split monolithic JSON data files into file-per-entry architecture
// Usage: node scripts/split-data.js

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

// Map of content types to their config
const TYPES = [
  { file: 'teas.json', key: 'teas', dir: 'teas', typeName: 'Tea', typeImport: "import type { Tea } from '@/types';" },
  { file: 'plants.json', key: 'plants', dir: 'plants', typeName: 'Plant', typeImport: "import type { Plant } from '@/types';" },
  { file: 'conditions.json', key: 'conditions', dir: 'conditions', typeName: 'Condition', typeImport: "import type { Condition } from '@/types';" },
  { file: 'remedies.json', key: 'remedies', dir: 'remedies', typeName: 'Remedy', typeImport: "import type { Remedy } from '@/types';" },
];

// Future types (empty barrel stubs)
const FUTURE_TYPES = [
  { dir: 'ingredients', typeName: 'Ingredient', typeImport: "import type { Ingredient } from '@/types';" },
  { dir: 'preparations', typeName: 'Preparation', typeImport: "import type { Preparation } from '@/types';" },
  { dir: 'actions', typeName: 'Action', typeImport: "import type { Action } from '@/types';" },
  { dir: 'glossary', typeName: 'GlossaryTerm', typeImport: "import type { GlossaryTerm } from '@/types';" },
];

function idToVarName(id) {
  // Convert kebab-case ID to camelCase variable name
  return id.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function splitDataFile({ file, key, dir, typeName, typeImport }) {
  const filePath = path.join(DATA_DIR, file);
  if (!fs.existsSync(filePath)) {
    console.log(`  SKIP: ${file} not found`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(content);
  const items = data[key];

  if (!items || !Array.isArray(items)) {
    console.log(`  SKIP: ${file} has no "${key}" array`);
    return;
  }

  // Create directory
  const dirPath = path.join(DATA_DIR, dir);
  fs.mkdirSync(dirPath, { recursive: true });

  // Write individual entry files
  const entries = [];
  for (const item of items) {
    const entryPath = path.join(dirPath, `${item.id}.json`);
    fs.writeFileSync(entryPath, JSON.stringify(item, null, 2) + '\n', 'utf-8');
    entries.push(item.id);
  }

  // Generate barrel file
  const importLines = entries
    .map(id => `import ${idToVarName(id)} from './${id}.json';`)
    .join('\n');

  const arrayEntries = entries
    .map(id => `  ${idToVarName(id)} as unknown as ${typeName},`)
    .join('\n');

  const barrel = `// Auto-generated barrel file — gather skill appends here
${typeImport}

${importLines}

export const ${key}: ${typeName}[] = [
${arrayEntries}
];
`;

  fs.writeFileSync(path.join(dirPath, 'index.ts'), barrel, 'utf-8');

  console.log(`  ${file} → ${dir}/ (${entries.length} entries + index.ts)`);
}

function createEmptyBarrel({ dir, typeName, typeImport }) {
  const dirPath = path.join(DATA_DIR, dir);
  fs.mkdirSync(dirPath, { recursive: true });

  const barrel = `// Auto-generated barrel file — gather skill appends here
${typeImport}

export const ${dir}: ${typeName}[] = [];
`;

  fs.writeFileSync(path.join(dirPath, 'index.ts'), barrel, 'utf-8');
  console.log(`  ${dir}/index.ts (empty stub)`);
}

console.log('Splitting monolithic data files into file-per-entry...\n');

console.log('Data files:');
for (const type of TYPES) {
  splitDataFile(type);
}

console.log('\nFuture type stubs:');
for (const type of FUTURE_TYPES) {
  createEmptyBarrel(type);
}

console.log('\nDone! Next steps:');
console.log('  1. Update src/lib/data.ts imports');
console.log('  2. Update src/lib/gather-queue.ts');
console.log('  3. Run: npx tsc --noEmit');
console.log('  4. Run: npm run build');
console.log('  5. Delete old monolithic JSON files');
