import { describe, expect, it } from 'vitest'

import type { Rikishi } from '@/types'

import { getDivisionHierarchyOrder, sortByName, sortDivision, sortRank, sortRikishi, sortSide } from './sorting'

describe('Sorting Utils', () => {
  const fallbackRank = { division: 'Unknown', position: 0 }

  const mockRikishi: Rikishi[] = [
    {
      id: 1,
      kanji: '白鵬',
      hiragana: 'はくほう',
      romaji: 'Hakuhō',
      english: 'Hakuho',
      rank: { division: 'Yokozuna', position: 0 },
    },
    {
      id: 2,
      kanji: '琴櫻',
      hiragana: 'ことざくら',
      romaji: 'Kotozakura',
      english: 'Kotozakura',
      rank: { division: 'Ozeki', position: 0 },
    },
    {
      id: 3,
      kanji: '阿炎',
      hiragana: 'あび',
      romaji: 'Abi',
      english: 'Abi',
      rank: { division: 'Maegashira', position: 1 },
    },
    {
      id: 4,
      kanji: '玉鷲',
      hiragana: 'たまわし',
      romaji: 'Tamawashi',
      english: 'Tamawashi',
      rank: { division: 'Maegashira', position: 1 },
    },
    {
      id: 5,
      kanji: '正代',
      hiragana: 'しょうだい',
      romaji: 'Shōdai',
      english: 'Shodai',
      rank: { division: 'Maegashira', position: 2 },
    },
    {
      id: 6,
      kanji: '隆の勝',
      hiragana: 'たかのしょう',
      romaji: 'Takanoshō',
      english: 'Takanosho',
      rank: undefined, // No rank
    },
  ]

  describe('getDivisionHierarchyOrder', () => {
    it('should return correct hierarchy order for known divisions', () => {
      expect(getDivisionHierarchyOrder('Yokozuna')).toBe(1)
      expect(getDivisionHierarchyOrder('Ozeki')).toBe(2)
      expect(getDivisionHierarchyOrder('Sekiwake')).toBe(3)
      expect(getDivisionHierarchyOrder('Komusubi')).toBe(4)
      expect(getDivisionHierarchyOrder('Maegashira')).toBe(5)
      expect(getDivisionHierarchyOrder('Juryo')).toBe(6)
      expect(getDivisionHierarchyOrder('Makushita')).toBe(7)
      expect(getDivisionHierarchyOrder('Sandanme')).toBe(8)
      expect(getDivisionHierarchyOrder('Jonidan')).toBe(9)
      expect(getDivisionHierarchyOrder('Jonokuchi')).toBe(10)
    })

    it('should return 999 for unknown divisions', () => {
      expect(getDivisionHierarchyOrder('Unknown')).toBe(999)
      expect(getDivisionHierarchyOrder('Invalid')).toBe(999)
    })
  })

  describe('sortDivision', () => {
    it('should sort by division hierarchy', () => {
      const sorted = [...mockRikishi].sort(sortDivision)

      // Yokozuna should come first
      expect(sorted[0].rank?.division).toBe('Yokozuna')
      // Ozeki should come second
      expect(sorted[1].rank?.division).toBe('Ozeki')
      // Maegashira should come after
      expect(sorted[2].rank?.division).toBe('Maegashira')
      expect(sorted[3].rank?.division).toBe('Maegashira')
      expect(sorted[4].rank?.division).toBe('Maegashira')
      // Rikishi without rank should come last
      expect(sorted[5].rank).toBeUndefined()
    })

    it('should return 0 for same division', () => {
      const result = sortDivision(mockRikishi[2], mockRikishi[3]) // Both Maegashira
      expect(result).toBe(0)
    })
  })

  describe('sortRank', () => {
    it('should sort by rank position', () => {
      const maegashiraRikishi = mockRikishi.filter((r) => r.rank?.division === 'Maegashira')
      const sorted = [...maegashiraRikishi].sort(sortRank)

      // Position 1 should come before position 2
      expect(sorted[0].rank?.position).toBe(1)
      expect(sorted[1].rank?.position).toBe(1)
      expect(sorted[2].rank?.position).toBe(2)
    })

    it('should put rikishi without rank at the end', () => {
      const result = sortRank(mockRikishi[0], mockRikishi[5]) // Yokozuna (position 0) vs no rank (position 999)
      expect(result).toBeLessThan(0) // Yokozuna should come first
    })
  })

  describe('sortSide', () => {
    it('should sort by side (East before West)', () => {
      const eastRikishi: Rikishi = {
        ...mockRikishi[0],
        rank: { ...(mockRikishi[0].rank ?? fallbackRank), side: 'East' },
      }
      const westRikishi: Rikishi = {
        ...mockRikishi[1],
        rank: { ...(mockRikishi[1].rank ?? fallbackRank), side: 'West' },
      }

      const result = sortSide(eastRikishi, westRikishi)
      expect(result).toBeLessThan(0) // East should come before West
    })

    it('should return 0 for same side', () => {
      const eastRikishi1: Rikishi = {
        ...mockRikishi[0],
        rank: { ...(mockRikishi[0].rank ?? fallbackRank), side: 'East' },
      }
      const eastRikishi2: Rikishi = {
        ...mockRikishi[1],
        rank: { ...(mockRikishi[1].rank ?? fallbackRank), side: 'East' },
      }

      const result = sortSide(eastRikishi1, eastRikishi2)
      expect(result).toBe(0)
    })

    it('should put rikishi without side at the end', () => {
      const eastRikishi: Rikishi = {
        ...mockRikishi[0],
        rank: { ...(mockRikishi[0].rank ?? fallbackRank), side: 'East' },
      }
      const noSideRikishi: Rikishi = {
        ...mockRikishi[1],
        rank: { ...(mockRikishi[1].rank ?? fallbackRank), side: undefined },
      }

      const result = sortSide(eastRikishi, noSideRikishi)
      expect(result).toBeLessThan(0) // East should come before no side
    })
  })

  describe('sortByName', () => {
    it('should sort alphabetically by English name', () => {
      const sorted = [...mockRikishi].sort(sortByName)

      expect(sorted[0].english).toBe('Abi')
      expect(sorted[1].english).toBe('Hakuho')
      expect(sorted[2].english).toBe('Kotozakura')
      expect(sorted[3].english).toBe('Shodai')
      expect(sorted[4].english).toBe('Takanosho')
      expect(sorted[5].english).toBe('Tamawashi')
    })

    it('should be case insensitive', () => {
      const rikishiA: Rikishi = { ...mockRikishi[0], english: 'hakuho' }
      const rikishiB: Rikishi = { ...mockRikishi[1], english: 'KOTOZAKURA' }

      const result = sortByName(rikishiA, rikishiB)
      expect(result).toBeLessThan(0) // 'hakuho' should come before 'KOTOZAKURA'
    })
  })

  describe('sortRikishi', () => {
    it('should sort by division, then rank, then side, then name', () => {
      const sorted = [...mockRikishi].sort(sortRikishi)

      // First: Yokozuna (highest division)
      expect(sorted[0].english).toBe('Hakuho')
      expect(sorted[0].rank?.division).toBe('Yokozuna')

      // Second: Ozeki
      expect(sorted[1].english).toBe('Kotozakura')
      expect(sorted[1].rank?.division).toBe('Ozeki')

      // Third: Maegashira positions (sorted by position, then name)
      expect(sorted[2].english).toBe('Abi')
      expect(sorted[2].rank?.division).toBe('Maegashira')
      expect(sorted[2].rank?.position).toBe(1)

      expect(sorted[3].english).toBe('Tamawashi')
      expect(sorted[3].rank?.division).toBe('Maegashira')
      expect(sorted[3].rank?.position).toBe(1)

      expect(sorted[4].english).toBe('Shodai')
      expect(sorted[4].rank?.division).toBe('Maegashira')
      expect(sorted[4].rank?.position).toBe(2)

      // Last: No rank
      expect(sorted[5].english).toBe('Takanosho')
      expect(sorted[5].rank).toBeUndefined()
    })

    it('should handle rikishi with same division and rank by sorting by name', () => {
      const sameRankRikishi = mockRikishi.filter((r) => r.rank?.division === 'Maegashira' && r.rank?.position === 1)
      const sorted = [...sameRankRikishi].sort(sortRikishi)

      expect(sorted[0].english).toBe('Abi')
      expect(sorted[1].english).toBe('Tamawashi')
    })
  })
})
