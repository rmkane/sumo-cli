# Import Rules

## Absolute Imports

- Always use absolute imports with `@/*` prefix for internal modules
- Never use relative imports like `../` or `./` for internal modules
- Example: Use `import { something } from '@/utils/helper'` instead of `import { something } from '../utils/helper'`
- This ensures consistent import paths and better refactoring support

## Import Organization

- Sort imports alphabetically within each group (external, internal, relative)
- Use `make lint-fix` to automatically fix import ordering issues
- Group imports: external packages, then internal modules, then relative imports
