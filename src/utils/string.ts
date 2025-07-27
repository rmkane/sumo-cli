/**
 * Capitalizes the first character of a string while preserving the rest of the string.
 *
 * This function handles edge cases such as empty strings, single characters,
 * and strings that are already capitalized. It only affects the first character
 * and leaves all other characters unchanged.
 *
 * @param str - The input string to capitalize. Can be empty or contain any characters.
 * @returns The string with the first character converted to uppercase. Returns empty string if input is empty.
 *
 * @example
 * ```typescript
 * capitalize('hello')     // returns 'Hello'
 * capitalize('world')     // returns 'World'
 * capitalize('')          // returns ''
 * capitalize('a')         // returns 'A'
 * capitalize('HELLO')     // returns 'HELLO' (first char already uppercase)
 * capitalize('123abc')    // returns '123abc' (numbers unaffected)
 * ```
 *
 * @since 1.0.0
 */
export function capitalize(str: string): string {
  if (str.length === 0) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Removes parentheses from the beginning and end of a string and trims whitespace.
 *
 * This function is specifically designed for cleaning up text that may be wrapped
 * in parentheses, such as data extracted from HTML or other formatted sources.
 * It handles various edge cases including nested parentheses, missing parentheses,
 * and extra whitespace.
 *
 * @param str - The input string to unwrap. Can contain any characters including parentheses.
 * @returns The string with outer parentheses removed and leading/trailing whitespace trimmed.
 *
 * @example
 * ```typescript
 * unwrapText('(hello world)')     // returns 'hello world'
 * unwrapText('(test) ')           // returns 'test'
 * unwrapText('no parentheses')    // returns 'no parentheses'
 * unwrapText('(nested (test))')   // returns 'nested (test)'
 * unwrapText('')                  // returns ''
 * unwrapText('(only opening')     // returns '(only opening'
 * unwrapText('only closing)')     // returns 'only closing)'
 * ```
 *
 * @since 1.0.0
 */
export function unwrapText(str: string): string {
  if (str.length === 0) return str

  let result = str.trim()

  // Remove opening parenthesis if present
  if (result.startsWith('(')) {
    result = result.slice(1)
  }

  // Remove closing parenthesis if present
  if (result.endsWith(')')) {
    result = result.slice(0, -1)
  }

  return result.trim()
}

/**
 * Normalizes Japanese text by removing extra whitespace and standardizing characters.
 *
 * This function is specifically designed for cleaning Japanese text data,
 * handling common issues found in scraped HTML content such as multiple spaces,
 * full-width characters, and inconsistent line breaks.
 *
 * @param text - The Japanese text to normalize
 * @returns Normalized text with consistent spacing and character encoding
 *
 * @example
 * ```typescript
 * normalizeJapaneseText('  こんにちは　世界  ')  // returns 'こんにちは 世界'
 * normalizeJapaneseText('大関\n\n関脇')         // returns '大関 関脇'
 * normalizeJapaneseText('')                    // returns ''
 * ```
 *
 * @since 1.0.0
 */
export function normalizeJapaneseText(text: string): string {
  if (text.length === 0) return text

  return text
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .replace(/[\u3000]/g, ' ') // Replace full-width space with regular space
    .replace(/\n+/g, ' ') // Replace line breaks with spaces
    .trim() // Remove leading/trailing whitespace
}

/**
 * Extracts a number from a string, returning the first sequence of digits found.
 *
 * Useful for parsing age, weight, height, or other numeric data from text
 * that may contain additional characters or formatting.
 *
 * @param text - The text containing a number to extract
 * @returns The first number found as a string, or empty string if no number found
 *
 * @example
 * ```typescript
 * extractNumber('Age: 25 years')     // returns '25'
 * extractNumber('Weight: 150.5kg')   // returns '150'
 * extractNumber('Height: 185cm')     // returns '185'
 * extractNumber('No numbers here')   // returns ''
 * extractNumber('')                  // returns ''
 * ```
 *
 * @since 1.0.0
 */
export function extractNumber(text: string): string {
  if (text.length === 0) return ''

  const match = text.match(/\d+/)
  return match ? match[0] : ''
}

/**
 * Checks if a string contains only Japanese characters (hiragana, katakana, kanji).
 *
 * This function is useful for validating Japanese text input or filtering
 * content that should only contain Japanese characters.
 *
 * @param text - The text to check for Japanese characters
 * @returns True if the string contains only Japanese characters, false otherwise
 *
 * @example
 * ```typescript
 * isJapaneseOnly('こんにちは')        // returns true
 * isJapaneseOnly('大関')             // returns true
 * isJapaneseOnly('Hello 世界')       // returns false
 * isJapaneseOnly('123')             // returns false
 * isJapaneseOnly('')                // returns true (empty string)
 * ```
 *
 * @since 1.0.0
 */
export function isJapaneseOnly(text: string): boolean {
  if (text.length === 0) return true

  // Regex for hiragana, katakana, and kanji
  const japaneseRegex = /^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+$/
  return japaneseRegex.test(text)
}
