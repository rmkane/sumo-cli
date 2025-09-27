import { describe, expect, it } from 'vitest'

import { matchupDataToCSVObjects } from '@/features/matchups/csv'
import type { MatchupData } from '@/types'

describe('CSV Utilities', () => {
  describe('matchupDataToCSVObjects', () => {
    it('should generate CSV objects with technique column for winner', () => {
      const matchups: MatchupData[] = [
        {
          east: {
            rank: 'Maegashira #18',
            record: { wins: 0, losses: 1 },
            kanji: '獅司',
            hiragana: 'しし',
            name: 'Shishi',
            result: 'L',
            technique: undefined,
          },
          west: {
            rank: 'Juryo #1',
            record: { wins: 1, losses: 0 },
            kanji: '大青山',
            hiragana: 'おおあおやま',
            name: 'Oaoyama',
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
            rank: 'Maegashira #17',
            record: { wins: 1, losses: 0 },
            kanji: '竜電',
            hiragana: 'りゅうでん',
            name: 'Ryuden',
            result: 'W',
            technique: 'hataki-komi',
          },
          west: {
            rank: 'Maegashira #16',
            record: { wins: 0, losses: 1 },
            kanji: '友風',
            hiragana: 'ともかぜ',
            name: 'Tomokaze',
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
            rank: 'Maegashira #15',
            record: { wins: 0, losses: 0 },
            kanji: '力士A',
            hiragana: 'りきしA',
            name: 'RikishiA',
            result: '',
            technique: undefined,
          },
          west: {
            rank: 'Maegashira #14',
            record: { wins: 0, losses: 0 },
            kanji: '力士B',
            hiragana: 'りきしB',
            name: 'RikishiB',
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
