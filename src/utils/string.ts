/**
 * Capitalizes the first character of a string.
 *
 * @param str - The input string to capitalize
 * @returns The string with the first character capitalized
 * @example
 * capitalize('hello') // returns 'Hello'
 * capitalize('world') // returns 'World'
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Removes parentheses from the beginning and end of a string and trims whitespace.
 *
 * @param str - The input string to unwrap
 * @returns The string with parentheses removed and trimmed
 * @example
 * unwrapText('(hello world)') // returns 'hello world'
 * unwrapText('(test) ') // returns 'test'
 */
export function unwrapText(str: string): string {
  return str.replace('(', '').replace(')', '').trim();
}
