# Testing Commands

## Available Commands

When running tests, always use one of these commands:

- `make test` (preferred - runs all tests once)
- `make test-watch` (runs tests in watch mode)
- `make test-ui` (runs tests with UI)
- `make test-coverage` (runs tests with coverage report)
- `pnpm test --run` (alternative - runs all tests once)
- `pnpm test <specific-file>` (for individual test files)

## Test Execution Rules

- Always run tests after making changes to verify functionality
- Use `make test` for full test suite validation
- Use specific file paths for focused testing during development
- If tests fail, analyze the output and fix issues systematically
- Run `make test-coverage` to check test coverage before major changes
