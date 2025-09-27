import { describe, expect, it } from 'vitest'

import { generateMatchupFilename, generateRikishiFilename } from '@/utils/filename'

describe('Filename Utils', () => {
  describe('generateMatchupFilename', () => {
    it('should generate correct filename for single digit day', () => {
      const result = generateMatchupFilename(5, 1, 'makuuchi', 'csv')
      expect(result).toBe('day_05_1_makuuchi.csv')
    })

    it('should generate correct filename for double digit day', () => {
      const result = generateMatchupFilename(15, 2, 'juryo', 'html')
      expect(result).toBe('day_15_2_juryo.html')
    })

    it('should handle different divisions and extensions', () => {
      const result = generateMatchupFilename(3, 6, 'jonokuchi', 'json')
      expect(result).toBe('day_03_6_jonokuchi.json')
    })

    it('should lowercase division names', () => {
      const result = generateMatchupFilename(1, 1, 'MAKUUCHI', 'csv')
      expect(result).toBe('day_01_1_makuuchi.csv')
    })

    it('should handle edge case day 1', () => {
      const result = generateMatchupFilename(1, 1, 'makuuchi', 'csv')
      expect(result).toBe('day_01_1_makuuchi.csv')
    })
  })

  describe('generateRikishiFilename', () => {
    it('should generate correct filename for makuuchi', () => {
      const result = generateRikishiFilename(1, 'makuuchi', 'json')
      expect(result).toBe('1_makuuchi_rikishi.json')
    })

    it('should generate correct filename for juryo', () => {
      const result = generateRikishiFilename(2, 'juryo', 'csv')
      expect(result).toBe('2_juryo_rikishi.csv')
    })

    it('should lowercase division names', () => {
      const result = generateRikishiFilename(3, 'MAKUSHITA', 'json')
      expect(result).toBe('3_makushita_rikishi.json')
    })

    it('should handle all division types', () => {
      const divisions = [
        { id: 1, name: 'makuuchi' },
        { id: 2, name: 'juryo' },
        { id: 3, name: 'makushita' },
        { id: 4, name: 'sandanme' },
        { id: 5, name: 'jonidan' },
        { id: 6, name: 'jonokuchi' },
      ]

      divisions.forEach(({ id, name }) => {
        const result = generateRikishiFilename(id, name, 'json')
        expect(result).toBe(`${id}_${name}_rikishi.json`)
      })
    })

    it('should handle different file extensions', () => {
      const extensions = ['json', 'csv', 'html', 'txt']

      extensions.forEach((ext) => {
        const result = generateRikishiFilename(1, 'makuuchi', ext)
        expect(result).toBe(`1_makuuchi_rikishi.${ext}`)
      })
    })
  })
})
