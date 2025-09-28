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
  - [Docker Development](#docker-development)
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
- **Modern Build** - Built with `tsdown` for fast compilation and ES modules
- **Professional Logging** - Winston-based logging with multiple transports
- **Clean Architecture** - Separation of concerns with thin CLI wrappers and feature modules
- **Comprehensive Testing** - Full test coverage with Vitest framework

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
sumo-cli stats

# Download matchup data for specific tournament day (saves as CSV)
sumo-cli matchups 1

# Use custom output directory
sumo-cli matchups 1 --output-dir ./my-data

# Force refresh cached data
sumo-cli stats --force-refresh --verbose

# List data storage locations
sumo-cli list

# Show rikishi by division
sumo-cli division makuuchi
```

## Development

```bash
# Run in development mode (with tsx)
pnpm cli --help
pnpm cli stats
pnpm cli matchups 1

# Build and watch for changes
make dev

# Run tests
make test

# Run tests with coverage
make test-coverage

# Format and lint
make format
make lint
```

### Docker Development

```bash
# Build development Docker image
make docker-build-dev

# Run development environment with live reloading
make docker-dev

# View development logs
make docker-logs

# Stop development containers
make docker-stop

# Access development container shell
make docker-shell

# Build production Docker image
make docker-build

# Run production CLI in Docker
make docker-run
```

For complete documentation, see [CLI.md](./CLI.md).

## Resources

### Official Sumo Sources

- **Rikishi Search**:
  - English: <https://www.sumo.or.jp/EnSumoDataRikishi/search/>
  - Japanese: <https://www.sumo.or.jp/ResultRikishiData/search/>
- **Banzuke:**
  - English: <https://www.sumo.or.jp/EnHonbashoBanzuke/index/>
- **Tournament Results**:
  - English: <https://www.sumo.or.jp/EnHonbashoMain/torikumi/1/15/>
  - Japanese: <https://www.sumo.or.jp/ResultData/torikumi/1/15/>
- **Standings**:
  - Japanese: <https://sumo.or.jp/ResultData/hoshitori/1/1/>
- **Bankuke API:**
  - English: <https://www.sumo.or.jp/EnHonbashoBanzuke/indexAjax/1/15/>
  - Japanese: <https://www.sumo.or.jp/ResultData/torikumiAjax/1/15/>

### Third-Party APIs & Databases

- **Sumo API**: <https://www.sumo-api.com/> - RESTful API for sumo data
- **Sumo Database**: <https://sumodb.sumogames.de/> - Comprehensive sumo database

### Development Resources

- **TypeScript**: <https://www.typescriptlang.org/> - Type-safe JavaScript
- **Commander.js**: <https://github.com/tj/commander.js> - CLI framework
- **Winston**: <https://github.com/winstonjs/winston> - Logging library
- **tsdown**: <https://github.com/rolldown/tsdown> - TypeScript bundler powered by rolldown
- **Docker**: <https://www.docker.com/> - Containerized development and deployment
