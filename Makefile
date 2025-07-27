# =============================================================================
# Configuration
# =============================================================================
.DEFAULT_GOAL := install

# =============================================================================
# Phony targets
# =============================================================================
.PHONY: dev build clean clean-all format help install refresh format-check
.PHONY: test test-run test-ui test-coverage

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
# Development
# =============================================================================
dev: # Development - run with tsx
	pnpm dev

build: # Build TypeScript to JavaScript
	pnpm build

install: # Install dependencies
	pnpm install

# =============================================================================
# Code Quality
# =============================================================================
format: # Format code with Prettier
	pnpm format

format-check: # Check formatting without changing files
	pnpm format:check

# =============================================================================
# Testing
# =============================================================================
test: # Run tests in watch mode
	pnpm test

test-run: # Run tests once
	pnpm test:run

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
