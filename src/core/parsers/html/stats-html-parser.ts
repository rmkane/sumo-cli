import { load } from 'cheerio'

import { SIDE } from '@/constants'
import type { Division, Rikishi } from '@/types'

import { parseStatsRecord } from './stats-record-parser'

/**
 * Parses HTML content to extract rikishi data.
 *
 * @param html - Raw HTML content from the sumo website
 * @param division - Division type for context
 * @returns Array of parsed Rikishi objects
 */
export function parseRikishiFromHTML(html: string, division?: Division): Rikishi[] {
  const $ = load(html)
  const records: Rikishi[] = []

  // Handle the simple 3-column table structure (second table)
  $('#ew_table_sm tbody tr').each((_, row) => {
    const $row = $(row)
    const $cells = $row.find('td, th')

    // Look for the middle cell which contains the rank
    if ($cells.length === 3) {
      const $leftCell = $cells.eq(0)
      const $rankCell = $cells.eq(1) // Middle cell with rank
      const $rightCell = $cells.eq(2)

      const rankText = $rankCell.text().trim()

      // Parse left cell if it has div.box (East side)
      const $leftBox = $leftCell.find('div.box')
      if ($leftBox.length > 0) {
        records.push(parseStatsRecord($leftBox, rankText, division, SIDE.EAST))
      }

      // Parse right cell if it has div.box (West side)
      const $rightBox = $rightCell.find('div.box')
      if ($rightBox.length > 0) {
        records.push(parseStatsRecord($rightBox, rankText, division, SIDE.WEST))
      }
    }
  })

  return records
}
