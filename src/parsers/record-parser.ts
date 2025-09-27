import { safeParseInt, strictParseInt } from '@/services/matchup-utils'
import type { RikishiRecord } from '@/types'

/**
 * Parses a single record from the HTML.
 *
 * @param recordText - Record text from the HTML
 * @returns Parsed record data or null if parsing fails
 */
export function parseRecord(recordText: string): RikishiRecord {
  if (!recordText) return { wins: 0, losses: 0 }

  // Extract wins, losses, and rest days from pattern like "（6勝2敗）" or "（1勝0敗3休）"
  const matchWithRest = recordText.match(/（(\d+)勝(\d+)敗(\d+)休）/)
  if (matchWithRest) {
    const wins = matchWithRest[1]
    const losses = matchWithRest[2]
    const rest = matchWithRest[3]
    return { wins: strictParseInt(wins), losses: strictParseInt(losses), rest: safeParseInt(rest) }
  }

  // Extract wins and losses from pattern like "（6勝2敗）"
  const match = recordText.match(/（(\d+)勝(\d+)敗）/)
  if (match) {
    const wins = match[1]
    const losses = match[2]
    return { wins: strictParseInt(wins), losses: strictParseInt(losses) }
  }

  // Fallback - return original text
  return { wins: 0, losses: 0 }
}
