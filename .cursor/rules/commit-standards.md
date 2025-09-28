# Commit Message Standards

## Conventional Commits

- **Follow Conventional Commits specification**: `<type>[optional scope]: <description>`
- **50/72 Rule**: Commit title max 50 characters, body lines max 72 characters
- **Required types**: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`
- **Optional scope**: `feat(parser):`, `fix(cli):`, etc.
- **Breaking changes**: Use `!` after type/scope or `BREAKING CHANGE:` footer

## Examples

- `feat: add user authentication`
- `fix(cli): resolve command parsing error`
- `docs: update API documentation`
- `refactor!: simplify command structure`
