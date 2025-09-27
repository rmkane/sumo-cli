# Testing Philosophy

## Architecture Principles

- **CLI Commands**: Thin wrappers that marshal arguments and delegate to features
- **Feature Modules**: Contain all business logic and should be thoroughly tested
- **Commands**: Minimal testing - just verify argument parsing and delegation
- **Focus**: Test the feature modules, not the command marshalling layer

## Testing Strategy

- Test business logic in feature modules extensively
- Keep command tests minimal (just configuration verification)
- Use integration tests for complex workflows
- Mock external dependencies appropriately
