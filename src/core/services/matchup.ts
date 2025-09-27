import { type Cheerio, load } from 'cheerio'
import { type Element } from 'domhandler'

import { MatchResult } from '@/constants'
import { determineResult, extractWinningTechnique, parseRank, parseRecord } from '@/core/parsers'
import { validateAndLogHTMLDate } from '@/core/services/matchup-validator'
import { findRikishiAcrossDivisions } from '@/core/services/rikishi-lookup'
import { getDivisionByRank } from '@/core/utils/division'
import { logWarning } from '@/core/utils/logger'
import type { DivisionType, MatchupData, RikishiName, RikishiRank, RikishiRecord } from '@/types'

// Re-export the main functions for backward compatibility
export { parseRank, parseRecord, determineResult, extractWinningTechnique } from '@/core/parsers'
export { fetchMatchupData } from '@/core/services/matchup-fetcher'
export { validateHTMLDate, validateAndLogHTMLDate } from '@/core/services/matchup-validator'

/**
 * Parses HTML content to extract matchup data from the torikumi table.
 *
 * @param html - Raw HTML content from the sumo website
 * @param division - Division identifier for rikishi lookup
 * @param requestedDay - Optional day number for validation
 * @returns Array of parsed MatchupData objects
 */
export function parseMatchupHTML(html: string, division: DivisionType, requestedDay?: number): MatchupData[] {
  const $ = load(html)
  const matchups: MatchupData[] = []

  // Validate HTML date if requested day is provided
  if (requestedDay !== undefined) {
    if (!validateAndLogHTMLDate(html, requestedDay)) {
      // Return empty array to prevent CSV creation when validation fails
      return []
    }
  }

  // Find the torikumi table
  const table = $('#torikumi_table')
  if (table.length === 0) {
    logWarning('No torikumi table found in HTML')
    return matchups
  }

  // Process each row (skip the first header row)
  table
    .find('tbody tr')
    .slice(1)
    .each((_, row) => {
      const $row = $(row)
      const matchup = parseMatchupRow($row, division)

      if (!matchup) {
        logWarning('Failed to parse matchup row')
        return
      }

      matchups.push(matchup)
    })

  return matchups
}

/**
 * Parses a single matchup row from the HTML table.
 *
 * @param $row - Cheerio object representing the table row
 * @param division - Division identifier for rikishi lookup
 * @returns Parsed MatchupData object or null if parsing fails
 */
function parseMatchupRow($row: Cheerio<Element>, division: DivisionType): MatchupData | null {
  try {
    // East rikishi is always the first td, west rikishi is always the last td
    const $tds = $row.find('td')
    if ($tds.length < 2) {
      return null
    }

    const $eastPlayer = $tds.first()
    const $westPlayer = $tds.last()

    const eastPlayer = parsePlayer($eastPlayer, division)
    const westPlayer = parsePlayer($westPlayer, division)

    if (!eastPlayer || !westPlayer) {
      return null
    }

    // Only include matchups where both players have valid data
    if (!eastPlayer.name.kanji || !westPlayer.name.kanji || !eastPlayer.rank.division || !westPlayer.rank.division) {
      return null
    }

    // Determine win/loss results
    const eastResult = determineResult($eastPlayer)
    const westResult = determineResult($westPlayer)

    // Extract winning techniques if there are recorded wins
    const eastTechnique = eastResult === MatchResult.WIN ? extractWinningTechnique($eastPlayer) : undefined
    const westTechnique = westResult === MatchResult.WIN ? extractWinningTechnique($westPlayer) : undefined

    return {
      east: { ...eastPlayer, result: eastResult, technique: eastTechnique },
      west: { ...westPlayer, result: westResult, technique: westTechnique },
    }
  } catch (error) {
    logWarning(`Error parsing matchup row: ${error instanceof Error ? error.message : String(error)}`)
    return null
  }
}

/**
 * Parses a single player from the HTML.
 *
 * @param $player - Cheerio object representing the player cell
 * @param division - Division identifier for rikishi lookup
 * @returns Parsed player data or null if parsing fails
 */
function parsePlayer(
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
      rank,
      record,
    }
  } catch (error) {
    logWarning(`Error parsing player: ${error instanceof Error ? error.message : String(error)}`)
    return null
  }
}
