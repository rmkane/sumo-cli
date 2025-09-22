<!-- omit in toc -->
# Sumo CLI

A professional command-line interface for processing sumo rikishi data. Extract, parse, and export sumo tournament data with modern tooling and TypeScript.

<!-- omit in toc -->
## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Sumo Divisions](#sumo-divisions)
- [Data Structure](#data-structure)
- [Usage Examples](#usage-examples)
- [Development](#development)
- [Resources](#resources)
  - [Official Sumo Sources](#official-sumo-sources)
  - [Third-Party APIs \& Databases](#third-party-apis--databases)
  - [Development Resources](#development-resources)

## Features

- **Professional CLI** - Modern command-line interface with `commander.js`
- **Data Extraction** - Download rikishi data and matchup information from official sources
- **Smart Caching** - Intelligent caching system to avoid redundant downloads
- **CSV Export** - Generate structured CSV files for data analysis
- **TypeScript** - Fully typed with modern TypeScript practices
- **Modern Build** - Built with `tsup` for fast compilation and ES modules
- **Professional Logging** - Winston-based logging with multiple transports

## Quick Start

```bash
# Install dependencies
pnpm install

# Build and link globally
pnpm run install-local

# Start using the CLI
sumo-cli --help
sumo-cli list
```

## Sumo Divisions

The CLI processes all six sumo divisions:

- Sekitori（関取
  - Makuuchi（幕内 – I（一）
    - Yokozuna（横綱）
    - Ōzeki（大関）
    - Sekiwake（関脇）
    - Komusubi（小結）
    - Maegashira（前頭）
  - Jūryō（十両 – II（二）
- Non-Sekitori（取的
  - Makushita（幕下） – III（三）
  - Sandanme（三段目） – IV（四）
  - Jonidan（序二段） – V（五）
  - Jonokuchi（序ノ口） – VI（六）

## Data Structure

The CLI extracts and processes:

- **Rikishi Data** - Names in Kanji, Hiragana, Romaji, and English
- **Matchup Data** - Tournament day results with win/loss records
- **Rank Information** - Current division and position data
- **Technique Data** - Winning techniques (kimarite) when available

## Usage Examples

```bash
# Get help (multiple ways to run)
pnpm cli --help  # Development mode
sumo-cli --help  # If installed globally

# Download rikishi statistics for all divisions (saves as JSON)
sumo-cli download-stats

# Download matchup data for specific tournament day (saves as CSV)
sumo-cli download-matchups 1

# Use custom output directory
sumo-cli download-matchups 1 --output-dir ./my-data

# Force refresh cached data
sumo-cli download-stats --force-refresh --verbose

# List data storage locations
sumo-cli list

# Show rikishi by division
sumo-cli division makuuchi
```

## Development

```bash
# Run in development mode (with tsx)
pnpm cli --help
pnpm cli download-stats
pnpm cli download-matchups 1

# Build and watch for changes
make dev

# Run tests
pnpm test --run

# Format and lint
pnpm format
pnpm lint
```

For complete documentation, see [CLI.md](./CLI.md).

## Resources

### Official Sumo Sources

- **English Tournament Results**: <https://www.sumo.or.jp/EnHonbashoMain/torikumi/1/15/>
- **Japanese Tournament Results**: <https://www.sumo.or.jp/ResultData/torikumi/1/15/>
- **Japanese Rankings**: <https://sumo.or.jp/ResultData/hoshitori/1/1/>
- **Rikishi Search (English)**: <https://www.sumo.or.jp/EnSumoDataRikishi/search/>

### Third-Party APIs & Databases

- **Sumo API**: <https://www.sumo-api.com/> - RESTful API for sumo data
- **Sumo Database**: <https://sumodb.sumogames.de/> - Comprehensive sumo database

### Development Resources

- **TypeScript**: <https://www.typescriptlang.org/> - Type-safe JavaScript
- **Commander.js**: <https://github.com/tj/commander.js> - CLI framework
- **Winston**: <https://github.com/winstonjs/winston> - Logging library
- **tsup**: <https://github.com/egoist/tsup> - TypeScript bundler
