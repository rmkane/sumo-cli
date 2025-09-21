import { getAllJapaneseRanks, lookupRank } from '@/dict'
import { kanjiToNumber } from '@/utils/japanese'

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
  if (!baseRank) {
    return cleanRank
  }

  const english = lookupRank(baseRank)
  if (!english) {
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
  if (lookupRank(rankText)) {
    return rankText
  }

  // Check for prefixes using dictionary function
  const possibleRanks = getAllJapaneseRanks()

  return possibleRanks.find((rank) => rankText.startsWith(rank)) || null
}

/**
 * Translates Japanese record text to English format.
 *
 * @param recordText - Japanese record text (e.g., "（6勝2敗）", "（1勝0敗3休）")
 * @returns English record format (e.g., "(6-2)", "(1-0-3)")
 */
export function translateRecord(recordText: string): string {
  if (!recordText) return ''

  // Extract wins, losses, and rest days from pattern like "（6勝2敗）" or "（1勝0敗3休）"
  const matchWithRest = recordText.match(/（(\d+)勝(\d+)敗(\d+)休）/)
  if (matchWithRest) {
    const wins = matchWithRest[1]
    const losses = matchWithRest[2]
    const rest = matchWithRest[3]
    return `(${wins}-${losses}-${rest})`
  }

  // Extract wins and losses from pattern like "（6勝2敗）"
  const match = recordText.match(/（(\d+)勝(\d+)敗）/)
  if (match) {
    const wins = match[1]
    const losses = match[2]
    return `(${wins}-${losses})`
  }

  // Fallback - return original text
  return recordText
}
