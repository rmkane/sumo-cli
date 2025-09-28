# Docker Support for Sumo CLI

This project includes Docker support for both development and production use.

## Quick Start

### Production Build

```bash
# Build the Docker image
npm run docker:build

# Run the CLI
npm run docker:run matchups 12
```

### Development with Live Reload

```bash
# Start development container
npm run docker:dev
```

## Docker Commands

### Build Commands

- `npm run docker:build` - Build production image
- `npm run docker:build:dev` - Build development image

### Run Commands

- `npm run docker:run` - Run production container
- `npm run docker:dev` - Start development container with live reload
- `npm run docker:prod` - Start production container

## Manual Docker Commands

### Build

```bash
# Production
docker build -t sumo-cli .

# Development
docker build -f Dockerfile.dev -t sumo-cli:dev .
```

### Run

```bash
# Basic run
docker run --rm sumo-cli --help

# With volume mounts for data persistence
docker run --rm \
  -v $(pwd)/output:/app/output \
  -v ~/.sumo-cli:/home/sumo-cli/.sumo-cli \
  sumo-cli matchups 12

# Development with live reload
docker-compose up sumo-cli-dev
```

## Volume Mounts

- `./output` → `/app/output` - CSV output files
- `~/.sumo-cli` → `/home/sumo-cli/.sumo-cli` - JSON cache and config files

## Security

The Docker containers run as a non-root user (`sumo-cli`) for security.

## Environment Variables

- `NODE_ENV` - Set to `production` or `development`
- `HOME` - Set to `/home/sumo-cli` for proper file paths
