import { beforeEach, describe, expect, it, vi } from 'vitest'

import { formatDivisionJson, formatDivisionList, formatDivisionTable } from '@/cli/formatters'
import { Side } from '@/constants'

describe('CLI Formatters', () => {
  const mockRikishi = [
    {
      id: 1,
      shikona: {
        english: 'Hakuho',
        kanji: '白鵬',
        hiragana: 'はくほう',
        romaji: 'Hakuhō',
      },
      rank: {
        division: 'Yokozuna',
        position: undefined,
        side: undefined,
      },
    },
    {
      id: 2,
      shikona: {
        english: 'Kisenosato',
        kanji: '稀勢の里',
        hiragana: 'きせのさと',
        romaji: 'Kisenosato',
      },
      rank: {
        division: 'Maegashira',
        position: 5,
        side: Side.EAST,
      },
    },
    {
      id: 3,
      shikona: {
        english: 'NoRankRikishi',
        kanji: '無階級',
        hiragana: 'むかいきゅう',
        romaji: 'Mukakyū',
      },
      rank: undefined,
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('formatDivisionJson', () => {
    it('should output JSON formatted rikishi data', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      formatDivisionJson(mockRikishi)

      expect(consoleSpy).toHaveBeenCalledWith(JSON.stringify(mockRikishi, null, 2))
      consoleSpy.mockRestore()
    })

    it('should handle empty array', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      formatDivisionJson([])

      expect(consoleSpy).toHaveBeenCalledWith('[]')
      consoleSpy.mockRestore()
    })
  })

  describe('formatDivisionList', () => {
    it('should output numbered list with rank information', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      formatDivisionList(mockRikishi)

      expect(consoleSpy).toHaveBeenCalledTimes(3)
      expect(consoleSpy).toHaveBeenNthCalledWith(1, '1. Hakuho (白鵬) - Yokozuna ()')
      expect(consoleSpy).toHaveBeenNthCalledWith(2, '2. Kisenosato (稀勢の里) - Maegashira #5 (East)')
      expect(consoleSpy).toHaveBeenNthCalledWith(3, '3. NoRankRikishi (無階級) - No rank data')
    })

    it('should handle empty array', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      formatDivisionList([])

      expect(consoleSpy).not.toHaveBeenCalled()
    })

    it('should handle rikishi without position', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const rikishiWithoutPosition = [
        {
          id: 4,
          shikona: {
            english: 'TestRikishi',
            kanji: 'テスト',
            hiragana: 'てすと',
            romaji: 'Test',
          },
          rank: {
            division: 'Yokozuna',
            position: undefined,
            side: Side.EAST,
          },
        },
      ]

      formatDivisionList(rikishiWithoutPosition)

      expect(consoleSpy).toHaveBeenCalledWith('1. TestRikishi (テスト) - Yokozuna (East)')
      consoleSpy.mockRestore()
    })
  })

  describe('formatDivisionTable', () => {
    it('should output formatted table', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      formatDivisionTable(mockRikishi)

      expect(consoleSpy).toHaveBeenCalledTimes(1)
      // The exact table format depends on the formatTable utility
      // We just verify it was called with the expected data structure
      const callArgs = consoleSpy?.mock?.calls?.[0]?.[0] ?? ''
      expect(callArgs).toContain('Yokozuna')
      expect(callArgs).toContain('Hakuho')
      expect(callArgs).toContain('白鵬')
    })

    it('should handle empty array', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      formatDivisionTable([])

      expect(consoleSpy).toHaveBeenCalledTimes(1)
      // Should still call console.log with an empty table
    })

    it('should handle rikishi without rank data', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const rikishiWithoutRank = [
        {
          id: 5,
          shikona: {
            english: 'NoRankRikishi',
            kanji: '無階級',
            hiragana: 'むかいきゅう',
            romaji: 'Mukakyū',
          },
          rank: undefined,
        },
      ]

      formatDivisionTable(rikishiWithoutRank)

      expect(consoleSpy).toHaveBeenCalledTimes(1)
      const callArgs = consoleSpy?.mock?.calls?.[0]?.[0] ?? ''
      expect(callArgs).toContain('NoRankRikishi')
      expect(callArgs).toContain('無階級')
      expect(callArgs).toContain('Mukakyū')
    })
  })
})
