import { toHiragana, toKatakana, toRomaji } from 'wanakana'

/**
 * Converts Japanese text to romaji with proper macron notation for long vowels.
 *
 * This function enhances the basic wanakana romaji conversion by applying
 * proper macron diacritics (ā, ī, ū, ē, ō) for long vowels, following
 * standard Japanese romanization conventions used in academic and official contexts.
 *
 * The function handles various long vowel patterns including:
 * - ああ → ā, いい → ī, うう → ū, えい → ē, おう → ō
 * - Compound sounds with long vowels (きょう → kyō, りゅう → ryū)
 * - All combinations of consonants with long vowels
 *
 * @param text - Japanese text in hiragana, katakana, or kanji
 * @returns Romaji text with proper macron diacritics
 *
 * @example
 * ```typescript
 * toRomajiWithMacrons('こんにちは')     // returns 'konnichiha'
 * toRomajiWithMacrons('おう')          // returns 'ō'
 * toRomajiWithMacrons('きょう')        // returns 'kyō'
 * toRomajiWithMacrons('りゅう')        // returns 'ryū'
 * toRomajiWithMacrons('えい')          // returns 'ē'
 * toRomajiWithMacrons('')              // returns ''
 * ```
 *
 * @since 1.0.0
 */
export function toRomajiWithMacrons(text: string): string {
  if (text.length === 0) return text

  const romaji = toRomaji(text)

  return (
    romaji
      // Basic long vowels
      .replace(/aa/g, 'ā')
      .replace(/ii/g, 'ī')
      .replace(/uu/g, 'ū')
      .replace(/ee/g, 'ē')
      .replace(/oo/g, 'ō')

      // Common long vowel patterns
      .replace(/ou/g, 'ō') // おう → ō
      .replace(/ei/g, 'ē') // えい → ē

      // Compound sounds with long vowels (ゆう pattern)
      .replace(/yuu/g, 'yū')
      .replace(/ryuu/g, 'ryū')
      .replace(/kyuu/g, 'kyū')
      .replace(/shuu/g, 'shū')
      .replace(/chuu/g, 'chū')
      .replace(/nyuu/g, 'nyū')
      .replace(/hyuu/g, 'hyū')
      .replace(/myuu/g, 'myū')
      .replace(/gyuu/g, 'gyū')
      .replace(/juu/g, 'jū')
      .replace(/byuu/g, 'byū')
      .replace(/pyuu/g, 'pyū')
      .replace(/riyuu/g, 'ryū') // Fix for りゅう → ryū

      // Compound sounds with long vowels (よう pattern)
      .replace(/shou/g, 'shō')
      .replace(/chou/g, 'chō')
      .replace(/kyou/g, 'kyō')
      .replace(/ryou/g, 'ryō')
      .replace(/hyou/g, 'hyō')
      .replace(/myou/g, 'myō')
      .replace(/gyou/g, 'gyō')
      .replace(/jyou/g, 'jō')
      .replace(/byou/g, 'byō')
      .replace(/pyou/g, 'pyō')
  )
}

/**
 * Converts text with diacritical marks to ASCII by removing accent marks.
 *
 * This function is useful for creating ASCII-safe versions of Japanese names
 * or text that may contain macrons or other diacritical marks. It normalizes
 * the text to NFD form and removes combining diacritical marks.
 *
 * @param inputString - Text that may contain diacritical marks
 * @returns ASCII text with diacritical marks removed
 *
 * @example
 * ```typescript
 * convertDiacriticsToAscii('Tōkyō')     // returns 'Tokyo'
 * convertDiacriticsToAscii('Ōsaka')     // returns 'Osaka'
 * convertDiacriticsToAscii('Kyōto')     // returns 'Kyoto'
 * convertDiacriticsToAscii('No accents') // returns 'No accents'
 * convertDiacriticsToAscii('')          // returns ''
 * ```
 *
 * @since 1.0.0
 */
export function convertDiacriticsToAscii(inputString: string): string {
  if (inputString.length === 0) return inputString

  // Normalize to NFD (Normalization Form D) to separate base characters from diacritical marks
  const normalizedString = inputString.normalize('NFD')

  // Remove combining diacritical marks (Unicode range U+0300 to U+036F)
  return normalizedString.replace(/[\u0300-\u036f]/g, '')
}

/**
 * Converts Japanese text to hiragana, handling mixed scripts gracefully.
 *
 * This function uses wanakana to convert any Japanese text (including kanji
 * and katakana) to hiragana, which is useful for text processing and analysis.
 *
 * @param text - Japanese text in any script (hiragana, katakana, kanji, romaji)
 * @returns Text converted to hiragana
 *
 * @example
 * ```typescript
 * toHiraganaSafe('こんにちは')           // returns 'こんにちは'
 * toHiraganaSafe('コンニチハ')           // returns 'こんにちは'
 * toHiraganaSafe('konnichiha')          // returns 'こんにちは'
 * toHiraganaSafe('大関')                // returns 'おおぜき'
 * toHiraganaSafe('')                    // returns ''
 * ```
 *
 * @since 1.0.0
 */
export function toHiraganaSafe(text: string): string {
  if (text.length === 0) return text

  try {
    return toHiragana(text)
  } catch {
    // Return original text if conversion fails
    return text
  }
}

/**
 * Converts Japanese text to katakana, handling mixed scripts gracefully.
 *
 * This function uses wanakana to convert any Japanese text (including kanji
 * and hiragana) to katakana, which is useful for text processing and analysis.
 *
 * @param text - Japanese text in any script (hiragana, katakana, kanji, romaji)
 * @returns Text converted to katakana
 *
 * @example
 * ```typescript
 * toKatakanaSafe('こんにちは')           // returns 'コンニチハ'
 * toKatakanaSafe('コンニチハ')           // returns 'コンニチハ'
 * toKatakanaSafe('konnichiha')          // returns 'コンニチハ'
 * toKatakanaSafe('大関')                // returns 'オオゼキ'
 * toKatakanaSafe('')                    // returns ''
 * ```
 *
 * @since 1.0.0
 */
export function toKatakanaSafe(text: string): string {
  if (text.length === 0) return text

  try {
    return toKatakana(text)
  } catch {
    // Return original text if conversion fails
    return text
  }
}

/**
 * Extracts and returns the first kanji character from a string.
 *
 * This function is useful for extracting kanji from mixed Japanese text,
 * such as when you need to identify the main kanji in a name or title.
 *
 * @param text - Japanese text that may contain kanji
 * @returns The first kanji character found, or empty string if none found
 *
 * @example
 * ```typescript
 * extractFirstKanji('大関')              // returns '大'
 * extractFirstKanji('大関 関脇')         // returns '大'
 * extractFirstKanji('こんにちは')        // returns ''
 * extractFirstKanji('Hello 世界')       // returns '世'
 * extractFirstKanji('')                 // returns ''
 * ```
 *
 * @since 1.0.0
 */
export function extractFirstKanji(text: string): string {
  if (text.length === 0) return ''

  // Regex for kanji characters (Unicode range U+4E00 to U+9FAF)
  const kanjiMatch = text.match(/[\u4E00-\u9FAF]/)
  return kanjiMatch ? kanjiMatch[0] : ''
}

/**
 * Counts the number of kanji characters in a string.
 *
 * This function is useful for analyzing the complexity of Japanese text
 * or determining the level of formality in written content.
 *
 * @param text - Japanese text to analyze
 * @returns Number of kanji characters found
 *
 * @example
 * ```typescript
 * countKanji('大関')                     // returns 2
 * countKanji('大関 関脇')                // returns 4
 * countKanji('こんにちは')               // returns 0
 * countKanji('Hello 世界')              // returns 1
 * countKanji('')                        // returns 0
 * ```
 *
 * @since 1.0.0
 */
export function countKanji(text: string): number {
  if (text.length === 0) return 0

  // Regex for kanji characters (Unicode range U+4E00 to U+9FAF)
  const kanjiMatches = text.match(/[\u4E00-\u9FAF]/g)
  return kanjiMatches ? kanjiMatches.length : 0
}

/**
 * Checks if a string contains any kanji characters.
 *
 * This function is useful for determining if text contains Chinese characters,
 * which can help with text classification or processing decisions.
 *
 * @param text - Text to check for kanji
 * @returns True if the string contains at least one kanji character
 *
 * @example
 * ```typescript
 * hasKanji('大関')                       // returns true
 * hasKanji('こんにちは')                 // returns false
 * hasKanji('Hello 世界')                // returns true
 * hasKanji('')                          // returns false
 * ```
 *
 * @since 1.0.0
 */
export function hasKanji(text: string): boolean {
  return countKanji(text) > 0
}

/**
 * Normalizes Japanese text by converting to hiragana and standardizing formatting.
 *
 * This function is useful for creating consistent, normalized versions of
 * Japanese text for comparison, search, or data processing purposes.
 *
 * @param text - Japanese text to normalize
 * @returns Normalized text in hiragana with consistent formatting
 *
 * @example
 * ```typescript
 * normalizeJapanese('大関')              // returns 'おおぜき'
 * normalizeJapanese('コンニチハ')        // returns 'こんにちは'
 * normalizeJapanese('konnichiha')       // returns 'こんにちは'
 * normalizeJapanese('  こんにちは  ')   // returns 'こんにちは'
 * normalizeJapanese('')                 // returns ''
 * ```
 *
 * @since 1.0.0
 */
export function normalizeJapanese(text: string): string {
  if (text.length === 0) return text

  // Convert to hiragana and trim whitespace
  const normalized = toHiraganaSafe(text).trim()

  // Remove extra whitespace and normalize
  return normalized.replace(/\s+/g, ' ')
}

export function kanjiToNumber(kanji: string): number {
  if (!kanji) return 0

  // Handle special sumo rank terms
  if (kanji === '筆頭') return 1 // hittou = first position

  const map = {
    〇: 0,
    一: 1,
    二: 2,
    三: 3,
    四: 4,
    五: 5,
    六: 6,
    七: 7,
    八: 8,
    九: 9,
  } as const

  const units = {
    千: 1000,
    百: 100,
    十: 10,
  } as const

  let result = 0
  let current = kanji

  for (const [unitChar, unitValue] of Object.entries(units)) {
    const index = current.indexOf(unitChar)
    if (index !== -1) {
      const prefix = current.slice(0, index)
      const num = prefix ? map[prefix as keyof typeof map] || 0 : 1
      result += num * unitValue
      current = current.slice(index + 1)
    }
  }

  // Handle remaining ones place
  if (current) {
    result += map[current as keyof typeof map] || 0
  }

  return result
}
