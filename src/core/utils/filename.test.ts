import { describe, expect, it } from 'vitest'

import { generateMatchupFilename, generateRikishiFilename } from '@/core/utils/filename'
import { Division, DivisionNumber } from '@/types'

describe('Filename Utils', () => {
  describe('generateMatchupFilename', () => {
    it('should generate correct filename for single digit day', () => {
      const result = generateMatchupFilename(5, 'makuuchi' as Division, 1, 'csv')
      expect(result).toBe('day_05_1_makuuchi.csv')
    })

    it('should generate correct filename for double digit day', () => {
      const result = generateMatchupFilename(15, 'juryo' as Division, 2, 'html')
      expect(result).toBe('day_15_2_juryo.html')
    })

    it('should handle different divisions and extensions', () => {
      const result = generateMatchupFilename(3, 'jonokuchi' as Division, 6, 'json')
      expect(result).toBe('day_03_6_jonokuchi.json')
    })

    it('should lowercase division names', () => {
      const result = generateMatchupFilename(1, 'MAKUUCHI' as Division, 1, 'csv')
      expect(result).toBe('day_01_1_makuuchi.csv')
    })

    it('should handle edge case day 1', () => {
      const result = generateMatchupFilename(1, 'makuuchi' as Division, 1, 'csv')
      expect(result).toBe('day_01_1_makuuchi.csv')
    })
  })

  describe('generateRikishiFilename', () => {
    it('should generate correct filename for makuuchi', () => {
      const result = generateRikishiFilename('Makuuchi', 1, 'json')
      expect(result).toBe('1_makuuchi_rikishi.json')
    })

    it('should generate correct filename for juryo', () => {
      const result = generateRikishiFilename('Juryo', 2, 'csv')
      expect(result).toBe('2_juryo_rikishi.csv')
    })

    it('should lowercase division names', () => {
      const result = generateRikishiFilename('Makushita', 3, 'json')
      expect(result).toBe('3_makushita_rikishi.json')
    })

    it('should handle all division types', () => {
      const divisions: { id: DivisionNumber; name: Division }[] = [
        { id: 1 as DivisionNumber, name: 'Makuuchi' },
        { id: 2 as DivisionNumber, name: 'Juryo' },
        { id: 3 as DivisionNumber, name: 'Makushita' },
        { id: 4 as DivisionNumber, name: 'Sandanme' },
        { id: 5 as DivisionNumber, name: 'Jonidan' },
        { id: 6 as DivisionNumber, name: 'Jonokuchi' },
      ]

      divisions.forEach(({ id, name }) => {
        const result = generateRikishiFilename(name, id, 'json')
        expect(result).toBe(`${id}_${name.toLowerCase()}_rikishi.json`)
      })
    })

    it('should handle different file extensions', () => {
      const extensions = ['json', 'csv', 'html', 'txt']

      extensions.forEach((ext) => {
        const result = generateRikishiFilename('Makuuchi', 1, ext)
        expect(result).toBe(`1_makuuchi_rikishi.${ext}`)
      })
    })
  })
})
