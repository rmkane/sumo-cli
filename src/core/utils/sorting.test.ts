import { describe, expect, it } from 'vitest'

import { DIVISION, SIDE } from '@/constants'
import type { MakuuchiRank, NumberedRank, Rikishi } from '@/types'

import { sortByName, sortRikishi } from './sorting'

describe('Sorting Utils', () => {
  const mockRikishi: Rikishi[] = [
    {
      id: 1,
      shikona: {
        kanji: '白鵬',
        hiragana: 'はくほう',
        romaji: 'Hakuhō',
        english: 'Hakuho',
      },
      current: { division: DIVISION.MAKUUCHI, side: SIDE.EAST, rank: 'Yokozuna' },
    },
    {
      id: 2,
      shikona: {
        kanji: '琴櫻',
        hiragana: 'ことざくら',
        romaji: 'Kotozakura',
        english: 'Kotozakura',
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
        kanji: '阿炎',
        hiragana: 'あび',
        romaji: 'Abi',
        english: 'Abi',
      },
      current: {
        division: DIVISION.MAKUUCHI,
        side: SIDE.EAST,
        rank: { kind: 'Maegashira', number: 1 } as MakuuchiRank,
      },
    },
    {
      id: 4,
      shikona: {
        kanji: '玉鷲',
        hiragana: 'たまわし',
        romaji: 'Tamawashi',
        english: 'Tamawashi',
      },
      current: {
        division: DIVISION.MAKUUCHI,
        side: SIDE.WEST,
        rank: { kind: 'Maegashira', number: 1 } as MakuuchiRank,
      },
    },
    {
      id: 5,
      shikona: {
        kanji: '正代',
        hiragana: 'しょうだい',
        romaji: 'Shōdai',
        english: 'Shodai',
      },
      current: {
        division: DIVISION.MAKUUCHI,
        side: SIDE.EAST,
        rank: { kind: 'Maegashira', number: 2 } as MakuuchiRank,
      },
    },
    {
      id: 6,
      shikona: {
        kanji: '隆の勝',
        hiragana: 'たかのしょう',
        romaji: 'Takanoshō',
        english: 'Takanosho',
      },
      current: {
        division: DIVISION.JURYO,
        side: SIDE.EAST,
        rank: { kind: 'Numbered', number: 1 } as NumberedRank,
      },
    },
  ]

  describe('sortByName', () => {
    it('should sort alphabetically by English name', () => {
      const sorted = [...mockRikishi].sort(sortByName)

      expect(sorted[0]?.shikona.english).toBe('Abi')
      expect(sorted[1]?.shikona.english).toBe('Hakuho')
      expect(sorted[2]?.shikona.english).toBe('Kotozakura')
      expect(sorted[3]?.shikona.english).toBe('Shodai')
      expect(sorted[4]?.shikona.english).toBe('Takanosho')
      expect(sorted[5]?.shikona.english).toBe('Tamawashi')
    })

    it('should be case insensitive', () => {
      const rikishiA: Rikishi = {
        ...mockRikishi[0],
        shikona: { ...mockRikishi[0]?.shikona, english: 'hakuho' },
      }
      const rikishiB: Rikishi = {
        ...mockRikishi[1],
        shikona: { ...mockRikishi[1]?.shikona, english: 'KOTOZAKURA' },
      }

      const result = sortByName(rikishiA, rikishiB)
      expect(result).toBeLessThan(0) // 'hakuho' should come before 'KOTOZAKURA'
    })
  })

  describe('sortRikishi', () => {
    it('should sort by division hierarchy, then rank, then side, then name', () => {
      const sorted = [...mockRikishi].sort(sortRikishi)

      // First: Yokozuna (highest division)
      expect(sorted[0]?.shikona.english).toBe('Hakuho')
      expect(sorted[0]?.current.division).toBe(DIVISION.MAKUUCHI)
      expect(sorted[0]?.current.rank).toBe('Yokozuna')

      // Second: Ozeki
      expect(sorted[1]?.shikona.english).toBe('Kotozakura')
      expect(sorted[1]?.current.division).toBe(DIVISION.MAKUUCHI)
      expect(sorted[1]?.current.rank).toBe('Ozeki')

      // Third: Maegashira positions (sorted by position, then side, then name)
      expect(sorted[2]?.shikona.english).toBe('Abi')
      expect(sorted[2]?.current.division).toBe(DIVISION.MAKUUCHI)
      expect(sorted[2]?.current.rank).toEqual({ kind: 'Maegashira', number: 1 })
      expect(sorted[2]?.current.side).toBe(SIDE.EAST)

      expect(sorted[3]?.shikona.english).toBe('Tamawashi')
      expect(sorted[3]?.current.division).toBe(DIVISION.MAKUUCHI)
      expect(sorted[3]?.current.rank).toEqual({ kind: 'Maegashira', number: 1 })
      expect(sorted[3]?.current.side).toBe(SIDE.WEST)

      expect(sorted[4]?.shikona.english).toBe('Shodai')
      expect(sorted[4]?.current.division).toBe(DIVISION.MAKUUCHI)
      expect(sorted[4]?.current.rank).toEqual({ kind: 'Maegashira', number: 2 })

      // Last: Juryo
      expect(sorted[5]?.shikona.english).toBe('Takanosho')
      expect(sorted[5]?.current.division).toBe(DIVISION.JURYO)
      expect(sorted[5]?.current.rank).toEqual({ kind: 'Numbered', number: 1 })
    })

    it('should handle rikishi with same division and rank by sorting by side then name', () => {
      const sameRankRikishi = mockRikishi.filter(
        (r) =>
          r.current.division === DIVISION.MAKUUCHI &&
          typeof r.current.rank !== 'string' &&
          r.current.rank.kind === 'Maegashira' &&
          r.current.rank.number === 1,
      )
      const sorted = [...sameRankRikishi].sort(sortRikishi)

      expect(sorted[0]?.shikona.english).toBe('Abi') // East comes before West
      expect(sorted[1]?.shikona.english).toBe('Tamawashi')
    })
  })
})
