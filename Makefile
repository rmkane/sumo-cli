# =============================================================================
# Configuration
# =============================================================================
.DEFAULT_GOAL := install

# =============================================================================
# Phony targets
# =============================================================================
.PHONY: all build clean clean-all dev lint lint-fix format format-check help
.PHONY: install install-cli install-hooks
.PHONY: refresh test test-coverage test-run test-ui test-watch uninstall-cli
.PHONY: docker-build docker-build-dev docker-build-all docker-run docker-clean
.PHONY: docker-dev docker-shell docker-logs docker-stop

# =============================================================================
# Help
# =============================================================================
help: # Show help
	@printf "Usage: make \033[36m<target>\033[0m\n\n"
	@awk '/^[a-zA-Z_-]+:.*?#/ { \
		target=$$1; \
		gsub(/.*#/, ""); \
		gsub(/:/, "", target); \
		printf "  \033[36m%-15s\033[0m %s\n", target, $$0 \
	}' $(MAKEFILE_LIST) | sort

# =============================================================================
# Complete Workflow
# =============================================================================
all: # Complete workflow: format, lint, test, and build
	@echo "🚀 Running complete workflow..."
	@$(MAKE) install
	@echo "📝 Formatting code..."
	@$(MAKE) format
	@echo "🔍 Linting code..."
	@$(MAKE) lint
	@echo "🧪 Running tests..."
	@$(MAKE) test
	@echo "🏗️  Building project..."
	@$(MAKE) build
	@echo "✅ Complete workflow finished successfully!"

# =============================================================================
# Development
# =============================================================================
dev: # Development - run with tsx
	pnpm dev

build: # Build TypeScript to JavaScript
	pnpm build

install: # Install dependencies and git hooks
	pnpm install
	@$(MAKE) install-hooks

install-cli: # Build and link CLI globally
	pnpm run install-local

install-hooks: # Install git hooks
	@echo "🔗 Installing git hooks..."
	@chmod +x .githooks/pre-commit
	@git config core.hooksPath .githooks
	@echo "✅ Git hooks installed successfully!"

uninstall-cli: # Unlink CLI globally
	pnpm run unlink

# =============================================================================
# Code Quality
# =============================================================================
format: # Format code with Prettier
	pnpm format

format-check: # Check formatting without changing files
	pnpm format:check

lint: # Run ESLint to check code quality
	pnpm lint

lint-fix: # Run ESLint and automatically fix issues
	pnpm lint:fix

# =============================================================================
# Testing
# =============================================================================
test: # Run tests once
	pnpm test --run

test-watch: # Run tests in watch mode
	pnpm test

test-ui: # Run tests with UI
	pnpm test:ui

test-coverage: # Run tests with coverage report
	pnpm test:coverage

# =============================================================================
# Data Management
# =============================================================================
refresh: # Run all divisions with fresh data
	pnpm dev --refresh

# =============================================================================
# Cleanup
# =============================================================================
clean: # Clean build artifacts and cache
	rm -rf dist/
	rm -rf cache/
	rm -rf data/

clean-all: clean # Clean everything including dependencies
	rm -rf node_modules/
	rm -f pnpm-lock.yaml

# =============================================================================
# Docker
# =============================================================================
docker-build: # Build production Docker image
	@echo "🐳 Building production Docker image..."
	docker build -f Dockerfile -t sumo-cli:latest .
	@echo "✅ Production Docker image built successfully!"

docker-build-dev: # Build development Docker image
	@echo "🐳 Building development Docker image..."
	docker build -f Dockerfile.dev -t sumo-cli:dev .
	@echo "✅ Development Docker image built successfully!"

docker-build-all: # Build all Docker images
	@echo "🐳 Building all Docker images..."
	docker build -f Dockerfile -t sumo-cli:latest .
	@$(MAKE) docker-build-dev
	@echo "✅ All Docker images built successfully!"

docker-run: # Run the CLI in production Docker container
	@echo "🐳 Running sumo-cli in production Docker..."
	docker run --rm -i sumo-cli:latest

docker-dev: # Run development environment in Docker
	@echo "🐳 Starting development environment..."
	docker run --rm -i -v $(PWD)/src:/app/src -p 3001:3000 --user root sumo-cli:dev

docker-shell: # Get shell access to development container
	@echo "🐳 Opening shell in development Docker container..."
	docker run --rm -it -v $(PWD)/src:/app/src sumo-cli:dev /bin/sh

docker-logs: # Show logs from running container
	@echo "🐳 Showing Docker container logs..."
	docker logs $(shell docker ps -q --filter ancestor=sumo-cli:dev) 2>/dev/null || echo "No running containers found"

docker-stop: # Stop all running sumo-cli containers
	@echo "🐳 Stopping Docker containers..."
	docker stop $(shell docker ps -q --filter ancestor=sumo-cli:dev) 2>/dev/null || echo "No running containers found"

docker-clean: # Clean Docker images and containers
	@echo "🐳 Cleaning Docker artifacts..."
	docker rmi sumo-cli:latest sumo-cli:dev 2>/dev/null || echo "Images not found"
	docker container prune -f
	docker image prune -f
