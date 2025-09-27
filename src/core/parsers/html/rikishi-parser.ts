import { type Cheerio } from 'cheerio'
import { type Element } from 'domhandler'

import { parseRank, parseRecord } from '@/core/parsers'
import { findRikishiAcrossDivisions } from '@/core/services/rikishi-lookup'
import { getDivisionByRank } from '@/core/utils/division'
import { logWarning } from '@/core/utils/logger'
import type { DivisionType, RikishiName, RikishiRank, RikishiRecord } from '@/types'

/**
 * Parses a single player from the HTML.
 *
 * @param $player - Cheerio object representing the player cell
 * @param division - Division identifier for rikishi lookup
 * @returns Parsed player data or null if parsing fails
 */
export function parseRikishi(
  $player: Cheerio<Element>,
  division: DivisionType,
): {
  name: RikishiName
  rank: RikishiRank
  record: RikishiRecord
} | null {
  try {
    // Extract rank
    const rankText = $player.find('.rank').text().trim()
    const rank = parseRank(rankText, division)

    // Extract name (kanji) - it's inside a span within an anchor tag
    const kanji = $player.find('.name span').text().trim()

    // Extract record/performance
    const recordText = $player.find('.perform').text().trim()
    const record = parseRecord(recordText)

    // Determine the correct division based on the rank
    const rankDivision = getDivisionByRank(rankText)

    // Look up rikishi data to get hiragana and English name
    const rikishiData = findRikishiAcrossDivisions(kanji, rankDivision ?? division)
    const hiragana = rikishiData?.name.hiragana ?? kanji
    const name = rikishiData?.name.english ?? kanji
    const romaji = rikishiData?.name.romaji ?? kanji

    // Only warn for non-empty names that weren't found
    if (!rikishiData && kanji.trim()) {
      logWarning(`Rikishi not found in JSON: "${kanji}" (rank: ${rank}, division: ${rankDivision ?? division})`)
    }

    return {
      name: {
        english: name,
        kanji,
        hiragana,
        romaji,
      },
      rank: rank ?? { division: '', side: undefined },
      record,
    }
  } catch (error) {
    logWarning(`Error parsing player: ${error instanceof Error ? error.message : String(error)}`)
    return null
  }
}
