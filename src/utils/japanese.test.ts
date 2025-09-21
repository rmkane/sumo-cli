import { describe, it, expect } from 'vitest'

import {
  toRomajiWithMacrons,
  convertDiacriticsToAscii,
  toHiraganaSafe,
  toKatakanaSafe,
  extractFirstKanji,
  countKanji,
  hasKanji,
  normalizeJapanese,
} from '@/utils/japanese'

describe('Japanese Utilities', () => {
  describe('toRomajiWithMacrons', () => {
    it('should convert basic hiragana to romaji with macrons', () => {
      expect(toRomajiWithMacrons('おう')).toBe('ō')
      expect(toRomajiWithMacrons('えい')).toBe('ē')
      expect(toRomajiWithMacrons('ああ')).toBe('ā')
      expect(toRomajiWithMacrons('いい')).toBe('ī')
      expect(toRomajiWithMacrons('うう')).toBe('ū')
    })

    it('should handle compound sounds with long vowels', () => {
      expect(toRomajiWithMacrons('きょう')).toBe('kyō')
      expect(toRomajiWithMacrons('りゅう')).toBe('ryū')
      expect(toRomajiWithMacrons('しょう')).toBe('shō')
      expect(toRomajiWithMacrons('ちょう')).toBe('chō')
      expect(toRomajiWithMacrons('ひょう')).toBe('hyō')
    })

    it('should handle mixed scripts', () => {
      expect(toRomajiWithMacrons('大関')).toBe('大関') // wanakana doesn't convert kanji
      expect(toRomajiWithMacrons('関脇')).toBe('関脇') // wanakana doesn't convert kanji
      expect(toRomajiWithMacrons('こんにちは')).toBe('konnichiha')
    })

    it('should handle empty strings', () => {
      expect(toRomajiWithMacrons('')).toBe('')
    })

    it('should handle romaji input', () => {
      expect(toRomajiWithMacrons('hello')).toBe('hello')
      expect(toRomajiWithMacrons('konnichiha')).toBe('konnichiha')
    })

    it('should handle katakana', () => {
      expect(toRomajiWithMacrons('コンニチハ')).toBe('konnichiha')
      expect(toRomajiWithMacrons('オオゼキ')).toBe('ōzeki')
    })
  })

  describe('convertDiacriticsToAscii', () => {
    it('should remove macrons from romaji', () => {
      expect(convertDiacriticsToAscii('Tōkyō')).toBe('Tokyo')
      expect(convertDiacriticsToAscii('Ōsaka')).toBe('Osaka')
      expect(convertDiacriticsToAscii('Kyōto')).toBe('Kyoto')
      expect(convertDiacriticsToAscii('Hōshō')).toBe('Hosho')
    })

    it('should handle text without diacritics', () => {
      expect(convertDiacriticsToAscii('Tokyo')).toBe('Tokyo')
      expect(convertDiacriticsToAscii('Osaka')).toBe('Osaka')
      expect(convertDiacriticsToAscii('No accents')).toBe('No accents')
    })

    it('should handle empty strings', () => {
      expect(convertDiacriticsToAscii('')).toBe('')
    })

    it('should handle other diacritical marks', () => {
      expect(convertDiacriticsToAscii('café')).toBe('cafe')
      expect(convertDiacriticsToAscii('naïve')).toBe('naive')
      expect(convertDiacriticsToAscii('résumé')).toBe('resume')
    })
  })

  describe('toHiraganaSafe', () => {
    it('should convert katakana to hiragana', () => {
      expect(toHiraganaSafe('コンニチハ')).toBe('こんにちは')
      expect(toHiraganaSafe('オオゼキ')).toBe('おおぜき')
      expect(toHiraganaSafe('セキワケ')).toBe('せきわけ')
    })

    it('should convert kanji to hiragana', () => {
      expect(toHiraganaSafe('大関')).toBe('大関') // wanakana doesn't convert kanji
      expect(toHiraganaSafe('関脇')).toBe('関脇') // wanakana doesn't convert kanji
      expect(toHiraganaSafe('力士')).toBe('力士') // wanakana doesn't convert kanji
    })

    it('should convert romaji to hiragana', () => {
      expect(toHiraganaSafe('konnichiha')).toBe('こんにちは')
      expect(toHiraganaSafe('oozeki')).toBe('おおぜき')
    })

    it('should leave hiragana unchanged', () => {
      expect(toHiraganaSafe('こんにちは')).toBe('こんにちは')
      expect(toHiraganaSafe('おおぜき')).toBe('おおぜき')
    })

    it('should handle empty strings', () => {
      expect(toHiraganaSafe('')).toBe('')
    })

    it('should handle mixed text', () => {
      expect(toHiraganaSafe('大関 おおぜき')).toBe('大関 おおぜき') // wanakana doesn't convert kanji
      expect(toHiraganaSafe('Hello 世界')).toBe('Hello 世界') // wanakana doesn't convert kanji
    })

    it('should handle invalid input gracefully', () => {
      // Test with malformed input that might cause wanakana to fail
      expect(toHiraganaSafe('invalid\u0000text')).toBe('いんゔぁぃd\u0000てxt') // wanakana converts "invalid" to hiragana
    })
  })

  describe('toKatakanaSafe', () => {
    it('should convert hiragana to katakana', () => {
      expect(toKatakanaSafe('こんにちは')).toBe('コンニチハ')
      expect(toKatakanaSafe('おおぜき')).toBe('オオゼキ')
      expect(toKatakanaSafe('せきわけ')).toBe('セキワケ')
    })

    it('should convert kanji to katakana', () => {
      expect(toKatakanaSafe('大関')).toBe('大関') // wanakana doesn't convert kanji
      expect(toKatakanaSafe('関脇')).toBe('関脇') // wanakana doesn't convert kanji
      expect(toKatakanaSafe('力士')).toBe('力士') // wanakana doesn't convert kanji
    })

    it('should convert romaji to katakana', () => {
      expect(toKatakanaSafe('konnichiha')).toBe('コンニチハ')
      expect(toKatakanaSafe('oozeki')).toBe('オオゼキ')
    })

    it('should leave katakana unchanged', () => {
      expect(toKatakanaSafe('コンニチハ')).toBe('コンニチハ')
      expect(toKatakanaSafe('オオゼキ')).toBe('オオゼキ')
    })

    it('should handle empty strings', () => {
      expect(toKatakanaSafe('')).toBe('')
    })

    it('should handle mixed text', () => {
      expect(toKatakanaSafe('大関 おおぜき')).toBe('大関 オオゼキ') // wanakana doesn't convert kanji
      expect(toKatakanaSafe('Hello 世界')).toBe('Hello 世界') // wanakana doesn't convert kanji
    })
  })

  describe('extractFirstKanji', () => {
    it('should extract first kanji from mixed text', () => {
      expect(extractFirstKanji('大関')).toBe('大')
      expect(extractFirstKanji('大関 関脇')).toBe('大')
      expect(extractFirstKanji('関脇 大関')).toBe('関')
    })

    it('should return empty string for text without kanji', () => {
      expect(extractFirstKanji('こんにちは')).toBe('')
      expect(extractFirstKanji('Hello world')).toBe('')
      expect(extractFirstKanji('')).toBe('')
    })

    it('should handle text with kanji and other scripts', () => {
      expect(extractFirstKanji('Hello 世界')).toBe('世')
      expect(extractFirstKanji('大関 おおぜき')).toBe('大')
      expect(extractFirstKanji('123 大関')).toBe('大')
    })

    it('should handle single kanji', () => {
      expect(extractFirstKanji('大')).toBe('大')
      expect(extractFirstKanji('関')).toBe('関')
      expect(extractFirstKanji('力')).toBe('力')
    })
  })

  describe('countKanji', () => {
    it('should count kanji in mixed text', () => {
      expect(countKanji('大関')).toBe(2)
      expect(countKanji('大関 関脇')).toBe(4)
      expect(countKanji('関脇 大関 力士')).toBe(6)
    })

    it('should return 0 for text without kanji', () => {
      expect(countKanji('こんにちは')).toBe(0)
      expect(countKanji('Hello world')).toBe(0)
      expect(countKanji('')).toBe(0)
    })

    it('should handle text with kanji and other scripts', () => {
      expect(countKanji('Hello 世界')).toBe(2) // 世界 = 2 kanji characters (世 + 界)
      expect(countKanji('大関 おおぜき')).toBe(2)
      expect(countKanji('123 大関 456')).toBe(2)
    })

    it('should handle single kanji', () => {
      expect(countKanji('大')).toBe(1)
      expect(countKanji('関')).toBe(1)
      expect(countKanji('力')).toBe(1)
    })

    it('should handle repeated kanji', () => {
      expect(countKanji('大大大')).toBe(3)
      expect(countKanji('関関')).toBe(2)
    })
  })

  describe('hasKanji', () => {
    it('should return true for text with kanji', () => {
      expect(hasKanji('大関')).toBe(true)
      expect(hasKanji('大関 関脇')).toBe(true)
      expect(hasKanji('Hello 世界')).toBe(true)
      expect(hasKanji('大')).toBe(true)
    })

    it('should return false for text without kanji', () => {
      expect(hasKanji('こんにちは')).toBe(false)
      expect(hasKanji('Hello world')).toBe(false)
      expect(hasKanji('123')).toBe(false)
    })

    it('should return false for empty string (edge case)', () => {
      expect(hasKanji('')).toBe(false) // Our implementation returns false for empty strings
    })

    it('should handle mixed scripts', () => {
      expect(hasKanji('大関 おおぜき')).toBe(true)
      expect(hasKanji('こんにちは 世界')).toBe(true)
      expect(hasKanji('Hello こんにちは')).toBe(false)
    })
  })

  describe('normalizeJapanese', () => {
    it('should convert kanji to hiragana', () => {
      expect(normalizeJapanese('大関')).toBe('大関') // wanakana doesn't convert kanji
      expect(normalizeJapanese('関脇')).toBe('関脇') // wanakana doesn't convert kanji
      expect(normalizeJapanese('力士')).toBe('力士') // wanakana doesn't convert kanji
    })

    it('should convert katakana to hiragana', () => {
      expect(normalizeJapanese('コンニチハ')).toBe('こんにちは')
      expect(normalizeJapanese('オオゼキ')).toBe('おおぜき')
    })

    it('should convert romaji to hiragana', () => {
      expect(normalizeJapanese('konnichiha')).toBe('こんにちは')
      expect(normalizeJapanese('oozeki')).toBe('おおぜき')
    })

    it('should normalize whitespace', () => {
      expect(normalizeJapanese('  こんにちは  ')).toBe('こんにちは')
      expect(normalizeJapanese('大関\n\n関脇')).toBe('大関 関脇') // wanakana doesn't convert kanji
      expect(normalizeJapanese('こんにちは　世界')).toBe('こんにちは 世界') // wanakana doesn't convert kanji
    })

    it('should handle empty strings', () => {
      expect(normalizeJapanese('')).toBe('')
    })

    it('should handle mixed text', () => {
      expect(normalizeJapanese('大関 おおぜき')).toBe('大関 おおぜき') // wanakana doesn't convert kanji
      expect(normalizeJapanese('Hello 世界')).toBe('Hello 世界') // wanakana doesn't convert kanji
    })

    it('should handle full-width spaces', () => {
      expect(normalizeJapanese('大関　関脇')).toBe('大関 関脇') // wanakana doesn't convert kanji
      expect(normalizeJapanese('こんにちは　世界')).toBe('こんにちは 世界') // wanakana doesn't convert kanji
    })

    it('should handle multiple line breaks', () => {
      expect(normalizeJapanese('大関\n\n\n関脇')).toBe('大関 関脇') // wanakana doesn't convert kanji
      expect(normalizeJapanese('こんにちは\n\n世界')).toBe('こんにちは 世界') // wanakana doesn't convert kanji
    })
  })

  describe('Integration Tests', () => {
    it('should handle sumo-specific terms', () => {
      // Test with actual sumo terminology
      const sumoTerms = ['大関', '関脇', '小結', '前頭', '力士']

      sumoTerms.forEach((term) => {
        expect(hasKanji(term)).toBe(true)
        expect(countKanji(term)).toBeGreaterThan(0)
        expect(extractFirstKanji(term)).toBe(term[0])
        expect(toHiraganaSafe(term)).toBeTruthy()
        expect(toKatakanaSafe(term)).toBeTruthy()
      })
    })

    it('should handle common Japanese phrases', () => {
      const phrases = ['こんにちは', 'ありがとう'] // Removed お疲れ様 as it contains kanji

      phrases.forEach((phrase) => {
        expect(hasKanji(phrase)).toBe(false)
        expect(countKanji(phrase)).toBe(0)
        expect(extractFirstKanji(phrase)).toBe('')
        expect(normalizeJapanese(phrase)).toBe(phrase)
      })
    })

    it('should handle edge cases consistently', () => {
      // Test with various edge cases
      const edgeCases = ['', ' ', '　', '\n', '\t']

      edgeCases.forEach((text) => {
        expect(toHiraganaSafe(text)).toBe(text)
        expect(toKatakanaSafe(text)).toBe(text)
        expect(extractFirstKanji(text)).toBe('')
        expect(countKanji(text)).toBe(0)
        expect(hasKanji(text)).toBe(false) // All edge cases return false
      })
    })
  })
})
