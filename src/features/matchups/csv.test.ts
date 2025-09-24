import { describe, expect, it } from 'vitest'

import { matchupDataToCSV } from '@/features/matchups/csv'
import type { MatchupData } from '@/types'

describe('CSV Utilities', () => {
  describe('matchupDataToCSV', () => {
    it('should generate CSV with technique column for winner', () => {
      const matchups: MatchupData[] = [
        {
          east: {
            rank: 'Maegashira #18',
            record: '0-1',
            kanji: '獅司',
            hiragana: 'しし',
            name: 'Shishi',
            result: 'L',
            technique: undefined,
          },
          west: {
            rank: 'Juryo #1',
            record: '1-0',
            kanji: '大青山',
            hiragana: 'おおあおやま',
            name: 'Oaoyama',
            result: 'W',
            technique: 'uwate-nage',
          },
        },
      ]

      const csv = matchupDataToCSV(matchups)
      const lines = csv.split('\n')

      // Check headers
      expect(lines[0]).toContain('東')
      expect(lines[0]).toContain('West')
      expect(lines[0]).toContain('西')

      // Check subheaders
      expect(lines[1]).toContain('Technique')

      // Check data row
      const dataRow = lines[2].split('\t')
      expect(dataRow[5]).toBe('L') // East result
      expect(dataRow[6]).toBe('uwate-nage') // Technique (from winner)
      expect(dataRow[7]).toBe('W') // West result
    })

    it('should handle matchup with east winner technique', () => {
      const matchups: MatchupData[] = [
        {
          east: {
            rank: 'Maegashira #17',
            record: '1-0',
            kanji: '竜電',
            hiragana: 'りゅうでん',
            name: 'Ryuden',
            result: 'W',
            technique: 'hataki-komi',
          },
          west: {
            rank: 'Maegashira #16',
            record: '0-1',
            kanji: '友風',
            hiragana: 'ともかぜ',
            name: 'Tomokaze',
            result: 'L',
            technique: undefined,
          },
        },
      ]

      const csv = matchupDataToCSV(matchups)
      const lines = csv.split('\n')
      const dataRow = lines[2].split('\t')

      expect(dataRow[5]).toBe('W') // East result
      expect(dataRow[6]).toBe('hataki-komi') // Technique (from east winner)
      expect(dataRow[7]).toBe('L') // West result
    })

    it('should handle matchup with no technique', () => {
      const matchups: MatchupData[] = [
        {
          east: {
            rank: 'Maegashira #15',
            record: '0-0',
            kanji: '力士A',
            hiragana: 'りきしA',
            name: 'RikishiA',
            result: '',
            technique: undefined,
          },
          west: {
            rank: 'Maegashira #14',
            record: '0-0',
            kanji: '力士B',
            hiragana: 'りきしB',
            name: 'RikishiB',
            result: '',
            technique: undefined,
          },
        },
      ]

      const csv = matchupDataToCSV(matchups)
      const lines = csv.split('\n')
      const dataRow = lines[2].split('\t')

      expect(dataRow[5]).toBe('') // East result
      expect(dataRow[6]).toBe('') // No technique
      expect(dataRow[7]).toBe('') // West result
    })
  })
})
