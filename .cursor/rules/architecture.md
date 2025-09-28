# Architecture Principles

## Separation of Concerns

- **CLI Commands**: Thin wrappers that marshal arguments and delegate to features
- **Feature Modules**: Contain all business logic and should be thoroughly tested
- **Services**: Handle data processing, API calls, and business operations
- **Utils**: Pure utility functions with no side effects
- **Types**: Centralized type definitions and interfaces
- **Constants**: Shared values and configuration

## DRY (Don't Repeat Yourself) Principles

- **Extract constants**: If you need to reuse a value, make it a constant and import it
- **Create utility functions**: For repeated logic, extract to utility functions
- **Centralize types**: Define interfaces and types in dedicated files
- **Share configuration**: Use centralized config files for repeated settings
- **Avoid code duplication**: Refactor repeated code into reusable modules

## Examples

```typescript
// ❌ Bad - repeated magic strings
if (status === 'active') { ... }
if (user.status === 'active') { ... }

// ✅ Good - extract constant
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const

if (status === USER_STATUS.ACTIVE) { ... }
if (user.status === USER_STATUS.ACTIVE) { ... }
```

## Module Organization

- Keep modules focused on a single responsibility
- Use clear, descriptive names for modules and functions
- Group related functionality together
- Avoid circular dependencies
- Prefer composition over inheritance
