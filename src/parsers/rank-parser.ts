import { JapaneseTerms } from '@/constants'
import { ranksDictionaryJp } from '@/dict'
import type { DivisionType, RikishiRank, SideType } from '@/types'
import { getDivisionName } from '@/utils/division'
import { kanjiToNumber } from '@/utils/japanese'

/**
 * Parses a rank string into structured rank information.
 *
 * @param rankText - Japanese rank text from the HTML
 * @param side - Optional side of the ranking (East or West)
 * @returns Structured rank information
 */
export function parseRank(rankText: string, division?: DivisionType, side?: SideType): RikishiRank | undefined {
  const cleanRank = rankText.trim()

  // Handle specific rank formats
  if (cleanRank === JapaneseTerms.HITTOU) {
    if (!division) return undefined
    const divisionNameStr = getDivisionName(division)
    return { division: divisionNameStr, position: 1, side }
  }

  // Handle Japanese rank formats using the ranks dictionary
  for (const [kanji, english] of Object.entries(ranksDictionaryJp)) {
    if (cleanRank.startsWith(kanji)) {
      const divisionName = english.charAt(0).toUpperCase() + english.slice(1)

      // Extract position from remaining text
      const remainingText = cleanRank.replace(kanji, '').trim()

      // Check if remaining text matches "X枚目" pattern
      const match = remainingText.match(/^(.+)枚目$/)
      if (match) {
        const positionText = match[1]
        const position = parsePosition(positionText)
        return position !== undefined ? { division: divisionName, position, side } : { division: divisionName, side }
      }

      // Try to parse remaining text as position
      const position = parsePosition(remainingText)
      return position !== undefined ? { division: divisionName, position, side } : { division: divisionName, side }
    }
  }

  // Handle "X枚目" format (e.g., "二枚目", "三枚目") - only if no rank match found
  const match = cleanRank.match(/^(.+)枚目$/)
  if (match) {
    const positionText = match[1]
    const position = parsePosition(positionText)
    if (!division) return undefined
    const divisionNameStr = getDivisionName(division)
    return position !== undefined ? { division: divisionNameStr, position, side } : { division: divisionNameStr, side }
  }

  // Fallback - use the division parameter
  if (!division) return undefined
  const divisionNameStr = getDivisionName(division)
  return { division: divisionNameStr, side }
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
