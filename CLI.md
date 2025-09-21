# Sumo CLI

A professional command-line interface for processing sumo rikishi data.

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

### Examples

```bash
# Process all divisions with force refresh
sumo-cli process-all --force-refresh

# Process day 8 with verbose logging
sumo-cli process-day 8 --verbose

# Process day 15 with force refresh and verbose logging
sumo-cli process-day 15 --force-refresh --verbose

# Development mode examples
pnpm cli process-all --force-refresh
pnpm cli process-day 8 --verbose
```

## Commands

### `process-all`
Process all sumo divisions and extract rikishi data.

```bash
pnpm cli process-all [options]
```

**Options:**
- `--force-refresh` - Force refresh of cached data
- `--verbose` - Enable verbose logging

### `process-day <day>`
Process matchup data for a specific tournament day.

```bash
pnpm cli process-day <day> [options]
```

**Arguments:**
- `<day>` - Tournament day number (1-15)

**Options:**
- `--force-refresh` - Force refresh of cached data
- `--verbose` - Enable verbose logging

### `list`
List available data files and directories.

```bash
pnpm cli list
```

## Data Output

The CLI processes data into the following structure:

```
data/
├── json/           # Rikishi data by division
├── csv/            # Matchup data by day and division
├── html/           # Raw HTML data
└── logs/           # Application logs
```

## Logging

The CLI uses professional logging with Winston:

- **Console**: Colorized output for development
- **Files**: Structured JSON logs in `data/logs/`
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
