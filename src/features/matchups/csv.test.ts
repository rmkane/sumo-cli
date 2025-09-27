import { describe, expect, it } from 'vitest'

import { matchupDataToCSVObjects } from '@/features/matchups/csv'
import type { MatchupData } from '@/types'

describe('CSV Utilities', () => {
  describe('matchupDataToCSVObjects', () => {
    it('should generate CSV objects with technique column for winner', () => {
      const matchups: MatchupData[] = [
        {
          east: {
            name: {
              english: 'Shishi',
              kanji: '獅司',
              hiragana: 'しし',
            },
            rank: {
              division: 'Maegashira',
              position: 18,
            },
            record: { wins: 0, losses: 1 },
            result: 'L',
            technique: undefined,
          },
          west: {
            name: {
              english: 'Oaoyama',
              kanji: '大青山',
              hiragana: 'おおあおやま',
            },
            rank: {
              division: 'Juryo',
              position: 1,
            },
            record: { wins: 1, losses: 0 },
            result: 'W',
            technique: 'uwate-nage',
          },
        },
      ]

      const csvObjects = matchupDataToCSVObjects(matchups)
      const firstRow = csvObjects[0]

      // Check that the technique comes from the winner (west in this case)
      expect(firstRow.eastResult).toBe('L')
      expect(firstRow.technique).toBe('uwate-nage') // Technique from west winner
      expect(firstRow.westResult).toBe('W')
    })

    it('should handle matchup with east winner technique', () => {
      const matchups: MatchupData[] = [
        {
          east: {
            name: {
              english: 'Ryuden',
              kanji: '竜電',
              hiragana: 'りゅうでん',
            },
            rank: {
              division: 'Maegashira',
              position: 17,
            },
            record: { wins: 1, losses: 0 },
            result: 'W',
            technique: 'hataki-komi',
          },
          west: {
            name: {
              english: 'Tomokaze',
              kanji: '友風',
              hiragana: 'ともかぜ',
            },
            rank: {
              division: 'Maegashira',
              position: 16,
            },
            record: { wins: 0, losses: 1 },
            result: 'L',
            technique: undefined,
          },
        },
      ]

      const csvObjects = matchupDataToCSVObjects(matchups)
      const firstRow = csvObjects[0]

      expect(firstRow.eastResult).toBe('W')
      expect(firstRow.technique).toBe('hataki-komi') // Technique from east winner
      expect(firstRow.westResult).toBe('L')
    })

    it('should handle matchup with no technique', () => {
      const matchups: MatchupData[] = [
        {
          east: {
            name: {
              english: 'RikishiA',
              kanji: '力士A',
              hiragana: 'りきしA',
            },
            rank: {
              division: 'Maegashira',
              position: 15,
            },
            record: { wins: 0, losses: 0 },
            result: '',
            technique: undefined,
          },
          west: {
            name: {
              english: 'RikishiB',
              kanji: '力士B',
              hiragana: 'りきしB',
            },
            rank: {
              division: 'Maegashira',
              position: 14,
            },
            record: { wins: 0, losses: 0 },
            result: '',
            technique: undefined,
          },
        },
      ]

      const csvObjects = matchupDataToCSVObjects(matchups)
      const firstRow = csvObjects[0]

      expect(firstRow.eastResult).toBe('')
      expect(firstRow.technique).toBe('') // No technique
      expect(firstRow.westResult).toBe('')
    })
  })
})
