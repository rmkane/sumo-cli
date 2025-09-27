# =============================================================================
# Configuration
# =============================================================================
.DEFAULT_GOAL := install

# =============================================================================
# Phony targets
# =============================================================================
.PHONY: all build clean clean-all dev format format-check help install install-cli install-hooks lint lint-fix
.PHONY: refresh test test-coverage test-run test-ui test-watch uninstall-cli

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
