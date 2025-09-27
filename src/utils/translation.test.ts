import { describe, expect, it } from 'vitest'

import { translateRank } from '@/utils/translation'

describe('Translation Utils', () => {
  describe('translateRank', () => {
    it('should translate Yokozuna', () => {
      const result = translateRank('横綱')
      expect(result).toBe('Yokozuna')
    })

    it('should translate Ozeki', () => {
      const result = translateRank('大関')
      expect(result).toBe('Ozeki')
    })

    it('should translate Sekiwake', () => {
      const result = translateRank('関脇')
      expect(result).toBe('Sekiwake')
    })

    it('should translate Komusubi', () => {
      const result = translateRank('小結')
      expect(result).toBe('Komusubi')
    })

    it('should translate Maegashira with position', () => {
      const result = translateRank('前頭十八枚目')
      expect(result).toBe('Maegashira #18')
    })

    it('should translate Maegashira with single digit position', () => {
      const result = translateRank('前頭六枚目')
      expect(result).toBe('Maegashira #6')
    })

    it('should translate Juryo', () => {
      const result = translateRank('十両')
      expect(result).toBe('Juryo')
    })

    it('should translate Juryo with position', () => {
      const result = translateRank('十両五枚目')
      expect(result).toBe('Juryo #5')
    })

    it('should handle ranks without positions', () => {
      const result = translateRank('幕下')
      expect(result).toBe('Makushita')
    })

    it('should handle unknown ranks by returning original text', () => {
      const result = translateRank('未知の階級')
      expect(result).toBe('未知の階級')
    })

    it('should handle empty string', () => {
      const result = translateRank('')
      expect(result).toBe('')
    })

    it('should handle whitespace', () => {
      const result = translateRank('  横綱  ')
      expect(result).toBe('Yokozuna')
    })

    it('should handle complex position numbers', () => {
      const result = translateRank('前頭十五枚目')
      expect(result).toBe('Maegashira #15')
    })

    it('should handle ranks with different position formats', () => {
      const testCases = [
        { input: '前頭一枚目', expected: 'Maegashira #1' },
        { input: '前頭十枚目', expected: 'Maegashira #10' },
        { input: '前頭二十枚目', expected: 'Maegashira #20' },
      ]

      testCases.forEach(({ input, expected }) => {
        const result = translateRank(input)
        expect(result).toBe(expected)
      })
    })
  })
})
