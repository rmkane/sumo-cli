import { type Cheerio } from 'cheerio'
import { type Element } from 'domhandler'

import { MatchResult } from '@/constants'
import { parseResult, parseRikishi, parseWinningTechnique } from '@/core/parsers'
import { logWarning } from '@/core/utils/logger'
import type { Division, MatchupData } from '@/types'

/**
 * Parses a single matchup row from the HTML table.
 *
 * @param $row - Cheerio object representing the table row
 * @param division - Division identifier for rikishi lookup
 * @returns Parsed MatchupData object or null if parsing fails
 */
export function parseMatchupRow($row: Cheerio<Element>, division: Division): MatchupData | null {
  try {
    // East rikishi is always the first td, west rikishi is always the last td
    const $tds = $row.find('td')
    if ($tds.length < 2) {
      return null
    }

    const $eastPlayer = $tds.first()
    const $westPlayer = $tds.last()

    const eastPlayer = parseRikishi($eastPlayer, division)
    const westPlayer = parseRikishi($westPlayer, division)

    if (eastPlayer === null || westPlayer === null) {
      return null
    }

    // Only include matchups where both players have valid data
    if (
      eastPlayer.shikona.kanji === '' ||
      westPlayer.shikona.kanji === '' ||
      eastPlayer.current?.division === undefined ||
      westPlayer.current?.division === undefined
    ) {
      return null
    }

    // Determine win/loss results
    const eastResult = parseResult($eastPlayer)
    const westResult = parseResult($westPlayer)

    // Extract winning techniques if there are recorded wins
    const eastTechnique = eastResult === MatchResult.WIN ? parseWinningTechnique($eastPlayer) : undefined
    const westTechnique = westResult === MatchResult.WIN ? parseWinningTechnique($westPlayer) : undefined

    return {
      east: { ...eastPlayer, result: eastResult, technique: eastTechnique },
      west: { ...westPlayer, result: westResult, technique: westTechnique },
    }
  } catch (error) {
    logWarning(`Error parsing matchup row: ${error instanceof Error ? error.message : String(error)}`)
    return null
  }
}
