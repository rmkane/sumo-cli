import { DIVISION, DIVISION_NAME_TO_DIVISION, JapaneseTerms, SIDE, SIDE_NAME_TO_SIDE } from '@/constants'
import { ranksDictionaryJp } from '@/core/dict'
import { kanjiToNumber } from '@/core/utils/japanese'
import type { BanzukeSlot, Division, MakuuchiRank, NumberedRank, Sanyaku, Side } from '@/types'

/**
 * Parses a rank string into structured rank information.s
 *
 * @param rankText - Japanese rank text from the HTML
 * @param side - Optional side of the ranking (East or West)
 * @returns Structured rank information
 */
export function parseRank(rankText: string, division?: Division, side?: Side): BanzukeSlot | undefined {
  const cleanRank = rankText.trim()

  // Map side to our Side enum
  const sideMap = SIDE_NAME_TO_SIDE

  // Handle specific rank formats
  if (cleanRank === JapaneseTerms.HITTOU) {
    if (!division) return undefined
    return createBanzukeSlot(division, 1, side)
  }

  // Handle Japanese rank formats using the ranks dictionary
  for (const [kanji, english] of Object.entries(ranksDictionaryJp)) {
    if (cleanRank.startsWith(kanji)) {
      // Check if this is a sanyaku rank (yokozuna, ozeki, sekiwake, komusubi)
      if (['yokozuna', 'ozeki', 'sekiwake', 'komusubi'].includes(english)) {
        // This is a sanyaku rank in Makuuchi division
        const sanyakuRank = (english.charAt(0).toUpperCase() + english.slice(1)) as Sanyaku
        return {
          division: DIVISION.MAKUUCHI,
          side: side ? (sideMap[side] ?? SIDE.EAST) : SIDE.EAST,
          rank: sanyakuRank,
        }
      }

      // Check if this is maegashira (前頭) - it's also in Makuuchi division
      if (english === 'maegashira') {
        // Extract position from remaining text
        const remainingText = cleanRank.replace(kanji, '').trim()

        // Check if remaining text matches "X枚目" pattern
        const match = remainingText.match(/^(.+)枚目$/)
        if (match) {
          const positionText = match[1]
          const position = parsePosition(positionText)
          return {
            division: DIVISION.MAKUUCHI,
            side: side ? (sideMap[side] ?? SIDE.EAST) : SIDE.EAST,
            rank: { kind: 'Maegashira', number: position ?? 1 } as MakuuchiRank,
          }
        }

        // Try to parse remaining text as position
        const position = parsePosition(remainingText)
        return {
          division: DIVISION.MAKUUCHI,
          side: side ? (sideMap[side] ?? SIDE.EAST) : SIDE.EAST,
          rank: { kind: 'Maegashira', number: position ?? 1 } as MakuuchiRank,
        }
      }

      // For other ranks, treat them as division names
      const divisionName = english.charAt(0).toUpperCase() + english.slice(1)

      // Extract position from remaining text
      const remainingText = cleanRank.replace(kanji, '').trim()

      // Check if remaining text matches "X枚目" pattern
      const match = remainingText.match(/^(.+)枚目$/)
      if (match) {
        const positionText = match[1]
        const position = parsePosition(positionText)
        return position !== undefined
          ? createBanzukeSlot(divisionName, position, side)
          : createBanzukeSlot(divisionName, undefined, side)
      }

      // Try to parse remaining text as position
      const position = parsePosition(remainingText)
      return position !== undefined
        ? createBanzukeSlot(divisionName, position, side)
        : createBanzukeSlot(divisionName, undefined, side)
    }
  }

  // Handle "X枚目" format (e.g., "二枚目", "三枚目") - only if no rank match found
  const match = cleanRank.match(/^(.+)枚目$/)
  if (match) {
    const positionText = match[1]
    const position = parsePosition(positionText)
    if (!division) return undefined
    return position !== undefined
      ? createBanzukeSlot(division, position, side)
      : createBanzukeSlot(division, undefined, side)
  }

  // Fallback - use the division parameter
  if (!division) return undefined
  return createBanzukeSlot(division, undefined, side)
}

/**
 * Creates a BanzukeSlot from parsed rank information
 */
function createBanzukeSlot(divisionName: string, position?: number, side?: Side): BanzukeSlot | undefined {
  // Map division names to our Division enum
  const division = DIVISION_NAME_TO_DIVISION[divisionName]
  if (!division) return undefined

  // Map side to our Side enum
  const sideMap = SIDE_NAME_TO_SIDE
  const mappedSide = side ? (sideMap[side] ?? SIDE.EAST) : SIDE.EAST

  // Create appropriate rank based on division
  let rank: MakuuchiRank | NumberedRank

  if (division === DIVISION.MAKUUCHI) {
    if (position === undefined) {
      // Default to Maegashira 1 if no position specified
      rank = { kind: 'Maegashira', number: 1 } as MakuuchiRank
    } else if (position <= 4) {
      // Handle sanyaku ranks
      const sanyakuRanks = ['Yokozuna', 'Ozeki', 'Sekiwake', 'Komusubi']
      if (position <= sanyakuRanks.length) {
        rank = sanyakuRanks[position - 1] as Sanyaku
      } else {
        rank = { kind: 'Maegashira', number: position - 4 } as MakuuchiRank
      }
    } else {
      rank = { kind: 'Maegashira', number: position - 4 } as MakuuchiRank
    }
  } else {
    // Other divisions use numbered ranks
    rank = { kind: 'Numbered', number: position ?? 1 } as NumberedRank
  }

  return {
    division,
    side: mappedSide,
    rank,
  }
}

/**
 * Parses a position string from rank text.
 *
 * @param positionText - Position text (e.g., "筆頭", "二枚目", "六枚目", etc.)
 * @returns Position number or undefined if not found
 */
export function parsePosition(positionText: string | undefined): number | undefined {
  if (positionText === undefined) {
    return undefined
  }

  // Handle special cases
  if (positionText === '筆頭') {
    return 1 // "筆頭" means "first" or "top"
  }

  // Handle "X枚目" format (e.g., "二枚目", "三枚目")
  const match = positionText.match(/^(.+)枚目$/)
  if (match) {
    const numberText = match[1]
    const result = kanjiToNumber(numberText ?? '')
    return result > 0 ? result : undefined
  }

  // Try to parse as a direct number
  const result = kanjiToNumber(positionText)
  return result > 0 ? result : undefined
}
