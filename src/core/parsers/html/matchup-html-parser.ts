import { load } from 'cheerio'

import { parseMatchupRow } from '@/core/parsers'
import { validateAndLogHTMLDate } from '@/core/services/matchup-validator'
import { logWarning } from '@/core/utils/logger'
import type { Division, MatchupData } from '@/types'

/**
 * Parses HTML content to extract matchup data from the torikumi table.
 *
 * @param html - Raw HTML content from the sumo website
 * @param division - Division identifier for rikishi lookup
 * @param requestedDay - Optional day number for validation
 * @returns Array of parsed MatchupData objects
 */
export function parseMatchupHTML(html: string, division: Division, requestedDay?: number): MatchupData[] {
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
