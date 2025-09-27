import { getAllJapaneseRanks, lookupRank } from '@/core/dict'
import { kanjiToNumber } from '@/core/utils/japanese'

/**
 * Translates Japanese rank text to English format.
 *
 * @param rankText - Japanese rank text (e.g., "前頭十八枚目")
 * @returns English rank format (e.g., "Maegashira #18")
 */
export function translateRank(rankText: string): string {
  const cleanRank = rankText.trim()

  // Extract the base rank (e.g., "前頭" from "前頭十八枚目")
  const baseRank = extractBaseRank(cleanRank)
  if (baseRank === null || baseRank === '') {
    return cleanRank
  }

  const english = lookupRank(baseRank)
  if (english === undefined) {
    return cleanRank
  }

  const division = english.charAt(0).toUpperCase() + english.slice(1)

  // Extract position from remaining text (e.g., "六枚目" -> 6)
  const remainingText = cleanRank.replace(baseRank, '').trim()
  let position = 0

  if (remainingText) {
    // Remove "枚目" suffix if present
    const positionText = remainingText.replace('枚目', '')
    if (positionText) {
      position = kanjiToNumber(positionText)
    }
  }

  if (position > 0) {
    return `${division} #${position}`
  } else {
    return division
  }
}

/**
 * Extracts the base rank from a full rank string.
 *
 * @param rankText - Full rank text (e.g., "前頭十八枚目")
 * @returns Base rank (e.g., "前頭") or null if not found
 */
function extractBaseRank(rankText: string): string | null {
  // Check for exact matches first (for ranks without positions)
  if (lookupRank(rankText) !== undefined) {
    return rankText
  }

  // Check for prefixes using dictionary function
  const possibleRanks = getAllJapaneseRanks()

  return possibleRanks.find((rank) => rankText.startsWith(rank)) ?? null
}
