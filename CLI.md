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
  - [Development Mode](#development-mode)
  - [Options](#options)
  - [Examples](#examples)
- [Commands](#commands)
  - [`process-all`](#process-all)
  - [`process-day <day>`](#process-day-day)
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
- [Development](#development)

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

# Process all divisions
sumo-cli process-all

# Process specific day (1-15)
sumo-cli process-day 1

# List available data
sumo-cli list
```

### Development Mode

```bash
# Run in development mode (without linking)
pnpm cli --help
pnpm cli process-all
pnpm cli process-day 1
```

### Options

- `-f, --force-refresh` - Force refresh of cached data
- `-v, --verbose` - Enable verbose logging
- `-o, --output-dir <path>` - Custom output directory for CSV files (default: "./output")
- `-i, --interactive` - Launch interactive REPL mode

### Examples

```bash
# Process all divisions with force refresh
sumo-cli process-all --force-refresh

# Process day 8 with verbose logging
sumo-cli process-day 8 --verbose

# Process day 15 with custom output directory
sumo-cli process-day 15 --output-dir ./my-csv-files

# Process day 15 with force refresh, verbose logging, and custom output
sumo-cli process-day 15 --force-refresh --verbose --output-dir ./custom-output

# Interactive mode
sumo-cli --interactive

# Development mode examples
pnpm cli process-all --force-refresh
pnpm cli process-day 8 --verbose --output-dir ./dev-output
```

## Commands

### `process-all`

Process all sumo divisions and extract rikishi data.

```bash
sumo-cli process-all [options]
```

**Options:**

- `--force-refresh` - Force refresh of cached data
- `--verbose` - Enable verbose logging
- `--output-dir <path>` - Custom output directory for CSV files

### `process-day <day>`

Process matchup data for a specific tournament day.

```bash
sumo-cli process-day <day> [options]
```

**Arguments:**

- `<day>` - Tournament day number (1-15)

**Options:**

- `--force-refresh` - Force refresh of cached data
- `--verbose` - Enable verbose logging
- `--output-dir <path>` - Custom output directory for CSV files

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
- `process-all` - Process all divisions
- `process-day <day>` - Process specific tournament day (1-15)

### Interactive Examples

```bash
sumo-cli> help
sumo-cli> list
sumo-cli> process-day 1 --verbose
sumo-cli> process-all --force-refresh --output-dir ./my-data
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

## Development

```bash
# Run in development mode
pnpm dev

# Run specific command in development
pnpm dev process-all --force-refresh
```
