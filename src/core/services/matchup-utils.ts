/**
 * Safely parses a string to integer, returning undefined if invalid.
 *
 * @param value - String value to parse
 * @returns Parsed integer or undefined
 */
export function safeParseInt(value: string | undefined): number | undefined {
  if (value === undefined) {
    return undefined
  }
  return parseInt(value, 10)
}

/**
 * Strictly parses a string to integer, throwing error if invalid.
 *
 * @param value - String value to parse
 * @returns Parsed integer
 * @throws Error if value is undefined
 */
export function strictParseInt(value: string | undefined): number {
  if (value === undefined) {
    throw new Error('Value is undefined')
  }
  return parseInt(value, 10)
}
