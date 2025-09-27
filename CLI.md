<!-- omit in toc -->
# Sumo CLI

A professional command-line interface for processing sumo rikishi data.

<!-- omit in toc -->
## Table of Contents

- [Installation](#installation)
  - [Local Development Installation (like pip -e)](#local-development-installation-like-pip--e)
  - [Manual Installation](#manual-installation)
- [Usage](#usage)
  - [Basic Commands](#basic-commands)
  - [Options](#options)
  - [Argument Parsing Notes](#argument-parsing-notes)
  - [Examples](#examples)
- [Commands](#commands)
  - [`stats`](#stats)
  - [`matchups <day>`](#matchups-day)
  - [`tournament [date]`](#tournament-date)
  - [`division [options] <division>`](#division-options-division)
  - [`validate <day>`](#validate-day)
  - [`list`](#list)
- [Interactive Mode](#interactive-mode)
  - [Interactive Commands](#interactive-commands)
  - [Interactive Examples](#interactive-examples)
- [Data Storage](#data-storage)
  - [User Data Directory (`~/.sumo-cli/`)](#user-data-directory-sumo-cli)
  - [Output Directory (`./output/` or custom)](#output-directory-output-or-custom)
  - [Example Output](#example-output)
- [Logging](#logging)
- [Error Handling](#error-handling)

## Installation

### Local Development Installation (like pip -e)

```bash
# Install dependencies
pnpm install

# Build and link globally (equivalent to pip -e)
pnpm run install-local

# Now you can use sumo-cli from anywhere!
sumo-cli --help
```

### Manual Installation

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build

# Link globally
npm link
```

## Usage

### Basic Commands

```bash
# Show help
sumo-cli --help

# Show version
sumo-cli --version

# Download rikishi statistics for all divisions (saves as JSON)
sumo-cli stats

# Download matchup data for specific day (1-15) (saves as CSV)
sumo-cli matchups 1

# List available data
sumo-cli list
```

### Options

- `-f, --force-refresh` - Force refresh of cached data
- `-v, --verbose` - Enable verbose logging
- `-o, --output-dir <path>` - Custom output directory for CSV files (default: "./output")
- `-i, --interactive` - Launch interactive REPL mode

### Argument Parsing Notes

When using options that require values (like `--format` or `--output-dir`), use the long form to avoid parsing ambiguity:

```bash
# ✅ Correct syntaxes
sumo-cli division --format list 1
sumo-cli division --format=list 1
sumo-cli download-matchups 1 --output-dir ./my-data

# ❌ Avoid short options with space (ambiguous)
sumo-cli division -f list 1
sumo-cli download-matchups 1 -o ./my-data
```

This is standard Commander.js behavior - short options with space-separated values can be ambiguous when mixed with positional arguments.

### Examples

```bash
# Download rikishi statistics with force refresh
sumo-cli stats --force-refresh

# Download matchup data for day 8 with verbose logging
sumo-cli matchups 8 --verbose

# Download matchup data for day 15 with custom output directory
sumo-cli matchups 15 --output-dir ./my-csv-files

# Download matchup data with force refresh, verbose logging, and custom output
sumo-cli matchups 15 --force-refresh --verbose --output-dir ./custom-output

# Get tournament information
sumo-cli tournament
sumo-cli tournament 2024-01-15

# List rikishi in divisions (supports both names and numbers)
sumo-cli division makuuchi
sumo-cli division 1
sumo-cli division juryo --format list
sumo-cli division 2 --format json

# Validate HTML data
sumo-cli validate 1
sumo-cli validate 15

# Interactive mode
sumo-cli --interactive
```

## Commands

### `stats`

Download rikishi statistics for all divisions and save as JSON files.

```bash
sumo-cli stats [options]
```

**Options:**

- `--force-refresh` - Force refresh of cached data
- `--verbose` - Enable verbose logging

### `matchups <day>`

Download matchup data for a specific tournament day and save as CSV files.

```bash
sumo-cli matchups <day> [options]
```

**Arguments:**

- `<day>` - Tournament day number (1-15)

**Options:**

- `--force-refresh` - Force refresh of cached data
- `--verbose` - Enable verbose logging
- `--output-dir <path>` - Custom output directory for CSV files

### `tournament [date]`

Get current or next tournament information for a given date.

```bash
sumo-cli tournament [date]
```

**Arguments:**

- `[date]` - Optional date in YYYY-MM-DD format (defaults to current date)

**Example:**

```bash
sumo-cli tournament
sumo-cli tournament 2024-01-15
```

### `division [options] <division>`

List all rikishi in a division in English alphabetical order.

```bash
sumo-cli division <division> [options]
```

**Arguments:**

- `<division>` - Division name (makuuchi, juryo, makushita, sandanme, jonidan, jonokuchi) or number (1-6)

**Options:**

- `-f, --format <format>` - Output format: table, list, json (default: "table")

**Examples:**

```bash
sumo-cli division makuuchi
sumo-cli division 1
sumo-cli division juryo --format list
sumo-cli division 2 --format json
```

**Output Formats:**

- **table** (default): Structured table with columns for division, rank, position, side, name, kanji, and romaji
- **list**: Numbered list showing name (kanji) - rank #position side
- **json**: Raw JSON data for programmatic use

**Note on Option Syntax:**

When using the format option, use the long form `--format` to avoid parsing ambiguity:

```bash
# ✅ Correct syntaxes
sumo-cli division --format list 1
sumo-cli division --format=list 1
sumo-cli division 1 --format list
sumo-cli division 1 --format=list

# ❌ Avoid short option with space (ambiguous)
sumo-cli division -f list 1
```

### `validate <day>`

Validate HTML metadata for a specific tournament day.

```bash
sumo-cli validate <day>
```

**Arguments:**

- `<day>` - Tournament day number (1-15)

**Example:**

```bash
sumo-cli validate 1
sumo-cli validate 15
```

### `list`

List available data files and directories.

```bash
sumo-cli list [options]
```

**Options:**

- `--output-dir <path>` - Show custom output directory in the listing

## Interactive Mode

Launch an interactive REPL (Read-Eval-Print Loop) for exploring the CLI:

```bash
sumo-cli --interactive
```

### Interactive Commands

- `help` - Show interactive help with available commands
- `clear` - Clear the screen
- `exit`, `quit` - Exit interactive mode
- `list` - List data storage locations
- `stats` - Download rikishi statistics for all divisions
- `matchups <day>` - Download matchup data for specific tournament day (1-15)
- `tournament [date]` - Get current or next tournament information
- `division <division>` - List all rikishi in a division
- `validate <day>` - Validate HTML metadata for a specific tournament day

### Interactive Examples

```bash
sumo-cli> help
sumo-cli> list
sumo-cli> tournament
sumo-cli> division makuuchi
sumo-cli> division 1 --format list
sumo-cli> validate 1
sumo-cli> matchups 1 --verbose
sumo-cli> stats --force-refresh
sumo-cli> clear
sumo-cli> exit
```

The interactive mode provides a user-friendly way to explore commands and options without having to type the full `sumo-cli` command each time.

## Data Storage

The CLI uses a modern data storage strategy:

### User Data Directory (`~/.sumo-cli/`)

Persistent data stored in the user's home directory:

```none
~/.sumo-cli/
├── json/           # Rikishi data by division (cached)
├── cache/          # Raw HTML data (cached)
└── logs/           # Application logs
```

### Output Directory (`./output/` or custom)

Generated CSV files stored relative to current working directory:

```none
./output/           # CSV files (default)
./my-custom-output/ # CSV files (when using --output-dir)
```

### Example Output

```bash
$ sumo-cli list

Data storage locations:
📁 C:\Users\ryan\.sumo-cli\json - Rikishi data by division (cached)
📁 C:\Users\ryan\.sumo-cli\cache - Raw HTML data (cached)
📁 C:\Users\ryan\.sumo-cli\logs - Application logs

Output locations:
📁 C:\Users\ryan\Git\rikishi-data\output - CSV output files (default)
```

## Logging

The CLI uses professional logging with Winston:

- **Console**: Colorized output for development
- **Files**: Structured JSON logs in `~/.sumo-cli/logs/`
  - `error.log` - Error messages only
  - `combined.log` - All log messages

## Error Handling

The CLI provides comprehensive error handling:

- Input validation (day numbers, etc.)
- Network error handling
- File system error handling
- Graceful degradation for missing data
