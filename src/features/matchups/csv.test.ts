import { describe, expect, it } from 'vitest'

import { DIVISION, MatchResult, SIDE } from '@/constants'
import { matchupDataToCSVObjects } from '@/features/matchups/csv'
import type { MatchupData } from '@/types'

describe('CSV Utilities', () => {
  describe('matchupDataToCSVObjects', () => {
    it('should generate CSV objects with technique column for winner', () => {
      const matchups: MatchupData[] = [
        {
          east: {
            shikona: {
              english: 'Shishi',
              kanji: '獅司',
              hiragana: 'しし',
              romaji: 'Shishi',
            },
            current: {
              division: DIVISION.MAKUUCHI,
              side: SIDE.EAST,
              rank: { kind: 'Maegashira', number: 18 },
            },
            record: { wins: 0, losses: 1 },
            result: MatchResult.LOSS,
            technique: undefined,
          },
          west: {
            shikona: {
              english: 'Oaoyama',
              kanji: '大青山',
              hiragana: 'おおあおやま',
              romaji: 'Oaoyama',
            },
            current: {
              division: DIVISION.JURYO,
              side: SIDE.EAST,
              rank: { kind: 'Numbered', number: 1 },
            },
            record: { wins: 1, losses: 0 },
            result: MatchResult.WIN,
            technique: 'uwate-nage',
          },
        },
      ]

      const csvObjects = matchupDataToCSVObjects(matchups)
      const firstRow = csvObjects[0]

      // Check that the technique comes from the winner (west in this case)
      expect(firstRow?.eastResult).toBe(MatchResult.LOSS)
      expect(firstRow?.technique).toBe('uwate-nage') // Technique from west winner
      expect(firstRow?.westResult).toBe(MatchResult.WIN)
    })

    it('should handle matchup with east winner technique', () => {
      const matchups: MatchupData[] = [
        {
          east: {
            shikona: {
              english: 'Ryuden',
              kanji: '竜電',
              hiragana: 'りゅうでん',
              romaji: 'Ryuden',
            },
            current: {
              division: DIVISION.MAKUUCHI,
              side: SIDE.EAST,
              rank: { kind: 'Maegashira', number: 17 },
            },
            record: { wins: 1, losses: 0 },
            result: MatchResult.WIN,
            technique: 'hataki-komi',
          },
          west: {
            shikona: {
              english: 'Tomokaze',
              kanji: '友風',
              hiragana: 'ともかぜ',
              romaji: 'Tomokaze',
            },
            current: {
              division: DIVISION.MAKUUCHI,
              side: SIDE.WEST,
              rank: { kind: 'Maegashira', number: 16 },
            },
            record: { wins: 0, losses: 1 },
            result: MatchResult.LOSS,
            technique: undefined,
          },
        },
      ]

      const csvObjects = matchupDataToCSVObjects(matchups)
      const [firstRow] = csvObjects

      expect(firstRow?.eastResult).toBe(MatchResult.WIN)
      expect(firstRow?.technique).toBe('hataki-komi') // Technique from east winner
      expect(firstRow?.westResult).toBe(MatchResult.LOSS)
    })

    it('should handle matchup with no technique', () => {
      const matchups: MatchupData[] = [
        {
          east: {
            shikona: {
              english: 'RikishiA',
              kanji: '力士A',
              hiragana: 'りきしA',
              romaji: 'RikishiA',
            },
            current: {
              division: DIVISION.MAKUUCHI,
              side: SIDE.EAST,
              rank: { kind: 'Maegashira', number: 15 },
            },
            record: { wins: 0, losses: 0 },
            result: MatchResult.NO_RESULT,
            technique: undefined,
          },
          west: {
            shikona: {
              english: 'RikishiB',
              kanji: '力士B',
              hiragana: 'りきしB',
              romaji: 'RikishiB',
            },
            current: {
              division: DIVISION.MAKUUCHI,
              side: SIDE.WEST,
              rank: { kind: 'Maegashira', number: 14 },
            },
            record: { wins: 0, losses: 0 },
            result: MatchResult.NO_RESULT,
            technique: undefined,
          },
        },
      ]

      const csvObjects = matchupDataToCSVObjects(matchups)
      const [firstRow] = csvObjects

      expect(firstRow?.eastResult).toBe(MatchResult.NO_RESULT)
      expect(firstRow?.technique).toBe('') // No technique
      expect(firstRow?.westResult).toBe(MatchResult.NO_RESULT)
    })
  })
})
