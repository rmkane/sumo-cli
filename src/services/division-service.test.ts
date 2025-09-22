import fs from 'node:fs'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Division } from '@/constants'
import { listDivisionRikishi } from '@/services/division-service'
import type { Rikishi } from '@/types'
import { getAvailableDivisions } from '@/utils/division'

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
      kanji: '朝乃山',
      hiragana: 'あさのやま',
      romaji: 'Asanoyama',
      english: 'Asanoyama',
      rank: { position: 1, division: 'makuuchi' },
    },
    {
      id: 2,
      kanji: '大関',
      hiragana: 'おおぜき',
      romaji: 'Ozeki',
      english: 'Ozeki',
      rank: { position: 2, division: 'makuuchi' },
    },
    {
      id: 3,
      kanji: '関脇',
      hiragana: 'せきわけ',
      romaji: 'Sekiwake',
      english: 'Sekiwake',
      rank: { position: 3, division: 'makuuchi' },
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
        divisionId: Division.MAKUUCHI,
        timestamp: '2025-01-01T00:00:00.000Z',
        count: 3,
        rikishi: mockRikishiData,
      }

      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockData))

      const result = await listDivisionRikishi('makuuchi')

      expect(result).toHaveLength(3)
      expect(result[0].english).toBe('Asanoyama')
      expect(result[1].english).toBe('Ozeki')
      expect(result[2].english).toBe('Sekiwake')
    })

    it('should handle case-insensitive sorting', async () => {
      const mixedCaseData: Rikishi[] = [
        {
          id: 1,
          kanji: '朝乃山',
          hiragana: 'あさのやま',
          romaji: 'Asanoyama',
          english: 'asanoyama', // lowercase
          rank: { position: 1, division: 'makuuchi' },
        },
        {
          id: 2,
          kanji: '大関',
          hiragana: 'おおぜき',
          romaji: 'Ozeki',
          english: 'OZEKI', // uppercase
          rank: { position: 2, division: 'makuuchi' },
        },
      ]

      const mockData = {
        division: 'Makuuchi',
        divisionId: Division.MAKUUCHI,
        timestamp: '2025-01-01T00:00:00.000Z',
        count: 2,
        rikishi: mixedCaseData,
      }

      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockData))

      const result = await listDivisionRikishi('makuuchi')

      expect(result[0].english).toBe('asanoyama')
      expect(result[1].english).toBe('OZEKI')
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
        divisionId: Division.MAKUUCHI,
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
