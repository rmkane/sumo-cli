import { type Cheerio } from 'cheerio'
import { type Element } from 'domhandler'

import { DIVISION, SIDE } from '@/constants'
import { parseRank, parseRecord } from '@/core/parsers'
import { findRikishiAcrossDivisions } from '@/core/services/rikishi-lookup'
import { logWarning } from '@/core/utils/logger'
import type { BanzukeSlot, Division, MakuuchiRank, RikishiRecord, RikishiShikona } from '@/types'

/**
 * Parses a single player from the HTML.
 *
 * @param $player - Cheerio object representing the player cell
 * @param division - Division identifier for rikishi lookup
 * @returns Parsed player data or null if parsing fails
 */
export function parseRikishi(
  $player: Cheerio<Element>,
  division: Division,
): {
  shikona: RikishiShikona
  current: BanzukeSlot
  record: RikishiRecord
} | null {
  try {
    // Extract rank
    const rankText = $player.find('.rank').text().trim()
    const current = parseRank(rankText, division)

    // Extract name (kanji) - it's inside a span within an anchor tag
    const kanji = $player.find('.name span').text().trim()

    // Extract record/performance
    const recordText = $player.find('.perform').text().trim()
    const record = parseRecord(recordText)

    // Prefer the division parsed from rank, fall back to the requested division
    const lookupDivision = current?.division ?? division

    // Look up rikishi data to get hiragana and English name
    const rikishiData = findRikishiAcrossDivisions(kanji, lookupDivision)
    const hiragana = rikishiData?.shikona.hiragana ?? kanji
    const name = rikishiData?.shikona.english ?? kanji
    const romaji = rikishiData?.shikona.romaji ?? kanji

    // Only warn for non-empty names that weren't found
    if (!rikishiData && kanji.trim()) {
      logWarning(`Rikishi not found in JSON: "${kanji}" (division: ${lookupDivision})`)
    }

    return {
      shikona: {
        english: name,
        kanji,
        hiragana,
        romaji,
      },
      current: current ?? {
        division: DIVISION.MAKUUCHI,
        side: SIDE.EAST,
        rank: { kind: 'Maegashira', number: 1 } as MakuuchiRank,
      },
      record,
    }
  } catch (error) {
    logWarning(`Error parsing player: ${error instanceof Error ? error.message : String(error)}`)
    return null
  }
}
