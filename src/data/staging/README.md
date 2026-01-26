# Data Staging Directory

This directory holds researched data awaiting review before merging into the main database.

## Workflow

```
Research → Stage → Review → Merge
```

1. **Research**: Use `/gather <type> <name>` to research and create a staged file
2. **Stage**: File is written to `staging/<type>/<id>.json` with metadata
3. **Review**: Use `/gather --review` to see all staged items
4. **Merge**: Use `/gather --merge <type>/<id>.json` to add to main database

## Directory Structure

```
src/data/staging/
├── plants/          # Staged plant entries
├── conditions/      # Staged condition entries
├── remedies/        # Staged remedy entries
└── README.md        # This file
```

## Staged File Format

Each staged file includes a `_meta` block that is stripped during merge:

```json
{
  "_meta": {
    "gatheredAt": "2026-01-26",
    "sources": [
      "https://examine.com/supplements/valerian/",
      "https://www.herbalgram.org/..."
    ],
    "confidence": "high",
    "isUpdate": false,
    "notes": "Optional notes about uncertainties"
  },
  "id": "valerian",
  "commonName": "Valerian",
  ...
}
```

### Metadata Fields

| Field | Description |
|-------|-------------|
| `gatheredAt` | ISO date when research was conducted |
| `sources` | Array of URLs/references used |
| `confidence` | `high`, `medium`, or `low` |
| `isUpdate` | `true` if updating existing entry |
| `notes` | Any flags or uncertainties |

## Commands

```bash
# Research and stage a new plant
/gather plant valerian

# Research and stage a condition
/gather condition insomnia

# Research and stage a remedy
/gather remedy sleep-tea

# List existing items
/gather --list plants

# Review all staged items
/gather --review

# Merge a staged item to main database
/gather --merge plants/valerian.json
```

## Notes

- Staged files are **not** part of the application build
- Always review safety information before merging
- The `_meta` block is removed during merge
- After merging, verify TypeScript compiles: `npx tsc --noEmit`
