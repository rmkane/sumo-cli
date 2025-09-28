# Code Quality Rules

## Pre-commit Requirements

- **ALWAYS run `make format` and `make lint` before committing**
- Use `make lint-fix` to automatically fix linting issues
- Never commit code that fails linting checks
- Fix linting errors before committing changes

## TypeScript Standards

- Use proper TypeScript types and avoid `any` when possible
- Follow the existing mocking patterns in test files
- Maintain test coverage and ensure all tests pass
