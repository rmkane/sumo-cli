# Import Rules

## Absolute Imports

- Always use absolute imports with `@/*` prefix for internal modules
- Never use relative imports like `../` or `./` for internal modules
- Example: Use `import { something } from '@/utils/helper'` instead of `import { something } from '../utils/helper'`
- This ensures consistent import paths and better refactoring support

## Type Imports

- **ALWAYS use `import type` for type-only imports**
- This is enforced by `verbatimModuleSyntax: true` in tsconfig
- Example: Use `import type { SomeType } from './module'` instead of `import { type SomeType } from './module'`
- This improves build performance and makes intent clear

## Import Organization

- Sort imports alphabetically within each group (external, internal, relative)
- Use `make lint-fix` to automatically fix import ordering issues
- Group imports: external packages, then internal modules, then relative imports
