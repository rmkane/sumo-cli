import path from 'node:path'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DATA_DIRS, DATA_PATHS } from '@/config/data'
import { Division, MatchResult, Side } from '@/constants'
import { getDivisionName } from '@/core/utils/division'
import { ensureDirectory, saveJSON } from '@/core/utils/file'
import { generateMatchupFilename } from '@/core/utils/filename'
import { logDebug } from '@/core/utils/logger'
import { saveMatchupJSON } from '@/features/matchups/json'
import type { DivisionType, MatchupData } from '@/types'

// Mock dependencies
vi.mock('@/core/utils/file')
vi.mock('@/core/utils/filename')
vi.mock('@/core/utils/logger')

describe('Matchup JSON Utilities', () => {
  const mockMatchups: MatchupData[] = [
    {
      east: {
        name: {
          english: 'East Rikishi',
          kanji: '東力士',
          hiragana: 'ひがしりきし',
          romaji: 'Higashi Rikishi',
        },
        rank: {
          division: 'Makuuchi',
          side: Side.EAST,
        },
        record: { wins: 1, losses: 0 },
        result: MatchResult.WIN,
        technique: 'Oshidashi',
      },
      west: {
        name: {
          english: 'West Rikishi',
          kanji: '西力士',
          hiragana: 'にしりきし',
          romaji: 'Nishi Rikishi',
        },
        rank: {
          division: 'Makuuchi',
          side: Side.WEST,
        },
        record: { wins: 0, losses: 1 },
        result: MatchResult.LOSS,
      },
    },
  ]

  const mockDivisionName = 'Makuuchi'
  const mockDivisionId: DivisionType = Division.MAKUUCHI
  const mockDay = 1

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('saveMatchupJSON', () => {
    it('should save matchup data to default JSON directory', async () => {
      const mockFilename = 'day1-makuuchi.json'
      const expectedDir = path.join(DATA_PATHS.USER_DATA_DIR, DATA_DIRS.JSON)
      const expectedFilepath = path.join(expectedDir, mockFilename)

      vi.mocked(generateMatchupFilename).mockReturnValue(mockFilename)
      vi.mocked(ensureDirectory).mockResolvedValue(undefined)
      vi.mocked(saveJSON).mockResolvedValue(undefined)
      vi.mocked(logDebug).mockImplementation(() => {})

      await saveMatchupJSON(mockMatchups, mockDivisionName, mockDivisionId, mockDay)

      expect(ensureDirectory).toHaveBeenCalledWith(expectedDir)
      expect(generateMatchupFilename).toHaveBeenCalledWith(mockDay, mockDivisionId, mockDivisionName, 'json')
      expect(saveJSON).toHaveBeenCalledWith(expectedFilepath, mockMatchups, 'matchups')
      expect(logDebug).toHaveBeenCalledWith(`Saved matchup JSON: ${expectedFilepath}`)
    })

    it('should save matchup data to custom output directory', async () => {
      const customOutputDir = '/custom/output/dir'
      const mockFilename = 'day1-makuuchi.json'
      const expectedFilepath = path.join(customOutputDir, mockFilename)

      vi.mocked(generateMatchupFilename).mockReturnValue(mockFilename)
      vi.mocked(ensureDirectory).mockResolvedValue(undefined)
      vi.mocked(saveJSON).mockResolvedValue(undefined)
      vi.mocked(logDebug).mockImplementation(() => {})

      await saveMatchupJSON(mockMatchups, mockDivisionName, mockDivisionId, mockDay, customOutputDir)

      expect(ensureDirectory).toHaveBeenCalledWith(customOutputDir)
      expect(generateMatchupFilename).toHaveBeenCalledWith(mockDay, mockDivisionId, mockDivisionName, 'json')
      expect(saveJSON).toHaveBeenCalledWith(expectedFilepath, mockMatchups, 'matchups')
      expect(logDebug).toHaveBeenCalledWith(`Saved matchup JSON: ${expectedFilepath}`)
    })

    it('should handle empty matchup array', async () => {
      const emptyMatchups: MatchupData[] = []
      const mockFilename = 'day1-makuuchi.json'
      const expectedDir = path.join(DATA_PATHS.USER_DATA_DIR, DATA_DIRS.JSON)
      const expectedFilepath = path.join(expectedDir, mockFilename)

      vi.mocked(generateMatchupFilename).mockReturnValue(mockFilename)
      vi.mocked(ensureDirectory).mockResolvedValue(undefined)
      vi.mocked(saveJSON).mockResolvedValue(undefined)
      vi.mocked(logDebug).mockImplementation(() => {})

      await saveMatchupJSON(emptyMatchups, mockDivisionName, mockDivisionId, mockDay)

      expect(saveJSON).toHaveBeenCalledWith(expectedFilepath, emptyMatchups, 'matchups')
    })

    it('should handle different division types', async () => {
      const divisions: DivisionType[] = Object.values(Division)

      for (const division of divisions) {
        const divisionName = getDivisionName(division)
        const mockFilename = `day1-${divisionName.toLowerCase()}.json`
        const expectedDir = path.join(DATA_PATHS.USER_DATA_DIR, DATA_DIRS.JSON)
        const expectedFilepath = path.join(expectedDir, mockFilename)

        vi.mocked(generateMatchupFilename).mockReturnValue(mockFilename)
        vi.mocked(ensureDirectory).mockResolvedValue(undefined)
        vi.mocked(saveJSON).mockResolvedValue(undefined)
        vi.mocked(logDebug).mockImplementation(() => {})

        await saveMatchupJSON(mockMatchups, divisionName, division, mockDay)

        expect(generateMatchupFilename).toHaveBeenCalledWith(mockDay, division, divisionName, 'json')
        expect(saveJSON).toHaveBeenCalledWith(expectedFilepath, mockMatchups, 'matchups')
      }
    })

    it('should handle different tournament days', async () => {
      const days = [1, 5, 10, 15]

      for (const day of days) {
        const mockFilename = `day${day}-makuuchi.json`
        const expectedDir = path.join(DATA_PATHS.USER_DATA_DIR, DATA_DIRS.JSON)
        const expectedFilepath = path.join(expectedDir, mockFilename)

        vi.mocked(generateMatchupFilename).mockReturnValue(mockFilename)
        vi.mocked(ensureDirectory).mockResolvedValue(undefined)
        vi.mocked(saveJSON).mockResolvedValue(undefined)
        vi.mocked(logDebug).mockImplementation(() => {})

        await saveMatchupJSON(mockMatchups, mockDivisionName, mockDivisionId, day)

        expect(generateMatchupFilename).toHaveBeenCalledWith(day, mockDivisionId, mockDivisionName, 'json')
        expect(saveJSON).toHaveBeenCalledWith(expectedFilepath, mockMatchups, 'matchups')
      }
    })

    it('should handle complex matchup data with techniques', async () => {
      const complexMatchups: MatchupData[] = [
        {
          east: {
            name: {
              english: 'Terunofuji',
              kanji: '照ノ富士',
              hiragana: 'てるのふじ',
              romaji: 'Terunofuji',
            },
            rank: { division: 'Makuuchi', side: Side.EAST },
            record: { wins: 1, losses: 0 },
            result: 'W',
            technique: 'Yorikiri',
          },
          west: {
            name: {
              english: 'Takakeisho',
              kanji: '貴景勝',
              hiragana: 'たかけいしょう',
              romaji: 'Takakeisho',
            },
            rank: {
              division: 'Makuuchi',
              side: Side.WEST,
            },
            record: { wins: 0, losses: 1 },
            result: 'L',
          },
        },
        {
          east: {
            name: {
              english: 'Wakatakakage',
              kanji: '若隆景',
              hiragana: 'わかたかかげ',
              romaji: 'Wakatakakage',
            },
            rank: { division: 'Makuuchi', side: Side.EAST },
            record: { wins: 0, losses: 1 },
            result: 'L',
          },
          west: {
            name: {
              english: 'Hoshoryu',
              kanji: '豊昇龍',
              hiragana: 'ほうしょうりゅう',
              romaji: 'Hoshoryu',
            },
            rank: { division: 'Makuuchi', side: Side.WEST },
            record: { wins: 1, losses: 0 },
            result: 'W',
            technique: 'Tsukidashi',
          },
        },
      ]

      const mockFilename = 'day1-makuuchi.json'
      const expectedDir = path.join(DATA_PATHS.USER_DATA_DIR, DATA_DIRS.JSON)
      const expectedFilepath = path.join(expectedDir, mockFilename)

      vi.mocked(generateMatchupFilename).mockReturnValue(mockFilename)
      vi.mocked(ensureDirectory).mockResolvedValue(undefined)
      vi.mocked(saveJSON).mockResolvedValue(undefined)
      vi.mocked(logDebug).mockImplementation(() => {})

      await saveMatchupJSON(complexMatchups, mockDivisionName, mockDivisionId, mockDay)

      expect(saveJSON).toHaveBeenCalledWith(expectedFilepath, complexMatchups, 'matchups')
    })

    it('should propagate errors from ensureDirectory', async () => {
      const error = new Error('Directory creation failed')
      vi.mocked(ensureDirectory).mockRejectedValue(error)

      await expect(saveMatchupJSON(mockMatchups, mockDivisionName, mockDivisionId, mockDay)).rejects.toThrow(
        'Directory creation failed',
      )
    })

    it('should propagate errors from saveJSON', async () => {
      const error = new Error('JSON save failed')
      vi.mocked(ensureDirectory).mockResolvedValue(undefined)
      vi.mocked(saveJSON).mockRejectedValue(error)

      await expect(saveMatchupJSON(mockMatchups, mockDivisionName, mockDivisionId, mockDay)).rejects.toThrow(
        'JSON save failed',
      )
    })

    it('should handle Windows-style paths correctly', async () => {
      const windowsPath = 'C:\\Users\\Test\\Documents\\SumoData'
      const mockFilename = 'day1-makuuchi.json'
      const expectedFilepath = path.join(windowsPath, mockFilename)

      vi.mocked(generateMatchupFilename).mockReturnValue(mockFilename)
      vi.mocked(ensureDirectory).mockResolvedValue(undefined)
      vi.mocked(saveJSON).mockResolvedValue(undefined)
      vi.mocked(logDebug).mockImplementation(() => {})

      await saveMatchupJSON(mockMatchups, mockDivisionName, mockDivisionId, mockDay, windowsPath)

      expect(ensureDirectory).toHaveBeenCalledWith(windowsPath)
      expect(saveJSON).toHaveBeenCalledWith(expectedFilepath, mockMatchups, 'matchups')
    })

    it('should handle Unix-style paths correctly', async () => {
      const unixPath = '/home/user/sumo-data'
      const mockFilename = 'day1-makuuchi.json'
      const expectedFilepath = path.join(unixPath, mockFilename)

      vi.mocked(generateMatchupFilename).mockReturnValue(mockFilename)
      vi.mocked(ensureDirectory).mockResolvedValue(undefined)
      vi.mocked(saveJSON).mockResolvedValue(undefined)
      vi.mocked(logDebug).mockImplementation(() => {})

      await saveMatchupJSON(mockMatchups, mockDivisionName, mockDivisionId, mockDay, unixPath)

      expect(ensureDirectory).toHaveBeenCalledWith(unixPath)
      expect(saveJSON).toHaveBeenCalledWith(expectedFilepath, mockMatchups, 'matchups')
    })

    it('should handle special characters in division names', async () => {
      const specialDivisionNames = [
        'Makuuchi (幕内)',
        'Juryo/序二段',
        'Makushita-三段目',
        'Sandanme & Jonidan',
        'Jonokuchi (序ノ口)',
      ]

      for (const divisionName of specialDivisionNames) {
        const mockFilename = `day1-${divisionName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}.json`
        const expectedDir = path.join(DATA_PATHS.USER_DATA_DIR, DATA_DIRS.JSON)
        const expectedFilepath = path.join(expectedDir, mockFilename)

        vi.mocked(generateMatchupFilename).mockReturnValue(mockFilename)
        vi.mocked(ensureDirectory).mockResolvedValue(undefined)
        vi.mocked(saveJSON).mockResolvedValue(undefined)
        vi.mocked(logDebug).mockImplementation(() => {})

        await saveMatchupJSON(mockMatchups, divisionName, mockDivisionId, mockDay)

        expect(generateMatchupFilename).toHaveBeenCalledWith(mockDay, mockDivisionId, divisionName, 'json')
        expect(saveJSON).toHaveBeenCalledWith(expectedFilepath, mockMatchups, 'matchups')
      }
    })

    it('should handle large matchup datasets', async () => {
      const largeMatchups: MatchupData[] = Array.from({ length: 100 }, (_, i) => ({
        east: {
          name: {
            english: `East Rikishi ${i}`,
            kanji: `東力士${i}`,
            hiragana: `ひがしりきし${i}`,
            romaji: `Higashi Rikishi ${i}`,
          },
          rank: { division: 'Makuuchi', side: 'East' },
          record: { wins: i % 2, losses: (i + 1) % 2 },
          result: i % 2 === 0 ? MatchResult.WIN : MatchResult.LOSS,
          technique: i % 2 === 0 ? 'Oshidashi' : undefined,
        },
        west: {
          name: {
            english: `West Rikishi ${i}`,
            kanji: `西力士${i}`,
            hiragana: `にしりきし${i}`,
            romaji: `Nishi Rikishi ${i}`,
          },
          rank: {
            division: 'Makuuchi',
            side: Side.WEST,
          },
          record: { wins: (i + 1) % 2, losses: i % 2 },
          result: i % 2 === 0 ? MatchResult.LOSS : MatchResult.WIN,
          technique: i % 2 === 0 ? undefined : 'Yorikiri',
        },
      }))

      const mockFilename = 'day1-makuuchi.json'
      const expectedDir = path.join(DATA_PATHS.USER_DATA_DIR, DATA_DIRS.JSON)
      const expectedFilepath = path.join(expectedDir, mockFilename)

      vi.mocked(generateMatchupFilename).mockReturnValue(mockFilename)
      vi.mocked(ensureDirectory).mockResolvedValue(undefined)
      vi.mocked(saveJSON).mockResolvedValue(undefined)
      vi.mocked(logDebug).mockImplementation(() => {})

      await saveMatchupJSON(largeMatchups, mockDivisionName, mockDivisionId, mockDay)

      expect(saveJSON).toHaveBeenCalledWith(expectedFilepath, largeMatchups, 'matchups')
      expect(largeMatchups).toHaveLength(100)
    })
  })
})
