import fs from 'node:fs'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { DIVISION, SIDE } from '@/constants'
import { listDivisionRikishi } from '@/core/services/division-service'
import { getAvailableDivisions } from '@/core/utils/division'
import type { MakuuchiRank, Rikishi } from '@/types'

// Mock fs module
vi.mock('node:fs')
const mockFs = vi.mocked(fs)

// Mock logger
vi.mock('@/utils/logger', () => ({
  logDebug: vi.fn(),
  logError: vi.fn(),
}))

describe('Division Service', () => {
  const mockRikishiData: Rikishi[] = [
    {
      id: 1,
      shikona: {
        kanji: '朝乃山',
        hiragana: 'あさのやま',
        romaji: 'Asanoyama',
        english: 'Asanoyama',
      },
      current: {
        division: DIVISION.MAKUUCHI,
        side: SIDE.EAST,
        rank: { kind: 'Maegashira', number: 1 } as MakuuchiRank,
      },
    },
    {
      id: 2,
      shikona: {
        kanji: '大関',
        hiragana: 'おおぜき',
        romaji: 'Ozeki',
        english: 'Ozeki',
      },
      current: {
        division: DIVISION.MAKUUCHI,
        side: SIDE.WEST,
        rank: 'Ozeki',
      },
    },
    {
      id: 3,
      shikona: {
        kanji: '関脇',
        hiragana: 'せきわけ',
        romaji: 'Sekiwake',
        english: 'Sekiwake',
      },
      current: {
        division: DIVISION.MAKUUCHI,
        side: SIDE.EAST,
        rank: 'Sekiwake',
      },
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('listDivisionRikishi', () => {
    it('should load and sort rikishi data by English name', async () => {
      const mockData = {
        division: 'Makuuchi',
        timestamp: '2025-01-01T00:00:00.000Z',
        count: 3,
        rikishi: mockRikishiData,
      }

      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockData))

      const result = await listDivisionRikishi('makuuchi')

      expect(result).toHaveLength(3)
      expect(result[0]?.shikona.english).toBe('Ozeki') // Ozeki comes first (higher rank)
      expect(result[1]?.shikona.english).toBe('Sekiwake') // Sekiwake comes second
      expect(result[2]?.shikona.english).toBe('Asanoyama') // Maegashira comes last
    })

    it('should handle case-insensitive sorting', async () => {
      const mixedCaseData: Rikishi[] = [
        {
          id: 1,
          shikona: {
            kanji: '朝乃山',
            hiragana: 'あさのやま',
            romaji: 'Asanoyama',
            english: 'asanoyama', // lowercase
          },
          current: {
            division: DIVISION.MAKUUCHI,
            side: SIDE.EAST,
            rank: { kind: 'Maegashira', number: 1 } as MakuuchiRank,
          },
        },
        {
          id: 2,
          shikona: {
            kanji: '大関',
            hiragana: 'おおぜき',
            romaji: 'Ozeki',
            english: 'OZEKI', // uppercase
          },
          current: { division: DIVISION.MAKUUCHI, side: SIDE.WEST, rank: 'Ozeki' },
        },
      ]

      const mockData = {
        division: 'Makuuchi',
        timestamp: '2025-01-01T00:00:00.000Z',
        count: 2,
        rikishi: mixedCaseData,
      }

      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockData))

      const result = await listDivisionRikishi('makuuchi')

      expect(result[0]?.shikona.english).toBe('OZEKI') // Ozeki comes first (higher rank)
      expect(result[1]?.shikona.english).toBe('asanoyama') // Maegashira comes second
    })

    it('should throw error for invalid division name', async () => {
      await expect(listDivisionRikishi('invalid')).rejects.toThrow(
        'Invalid division name: invalid. Available divisions: makuuchi, juryo, makushita, sandanme, jonidan, jonokuchi',
      )
    })

    it('should handle file not found error', async () => {
      mockFs.readFileSync.mockImplementation(() => {
        throw new Error('ENOENT: no such file or directory')
      })

      await expect(listDivisionRikishi('makuuchi')).rejects.toThrow('Failed to load rikishi data for division 1')
    })

    it('should handle empty rikishi array', async () => {
      const mockData = {
        division: 'Makuuchi',
        timestamp: '2025-01-01T00:00:00.000Z',
        count: 0,
        rikishi: [],
      }

      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockData))

      const result = await listDivisionRikishi('makuuchi')

      expect(result).toHaveLength(0)
    })
  })

  describe('getAvailableDivisions', () => {
    it('should return all available division names', () => {
      const divisions = getAvailableDivisions()

      expect(divisions).toEqual(['makuuchi', 'juryo', 'makushita', 'sandanme', 'jonidan', 'jonokuchi'])
    })
  })
})
