import { type Cheerio, load } from 'cheerio'
import { type Element } from 'domhandler'

import { Side } from '@/constants'
import { parseRank, parseRikishiName } from '@/core/parsers'
import { downloadStatsData } from '@/core/utils/cache-manager'
import type { DivisionType, Rikishi, SideType } from '@/types'

/**
 * Fetches rikishi data for a division, using cache when possible.
 * Downloads are queued with rate limiting to be respectful to the server.
 *
 * @param division - Division identifier
 * @param forceRefresh - Whether to bypass cache
 * @returns Object containing results and whether data was fetched from server
 */
export async function fetchResults(
  division: DivisionType,
  forceRefresh: boolean = false,
): Promise<{ results: Rikishi[]; fromServer: boolean }> {
  try {
    const { content: html, fromServer } = await downloadStatsData(division, forceRefresh)
    const results = parseRikishiFromHTML(html, division)
    return { results, fromServer }
  } catch (error) {
    console.error(`Error fetching results for division ${division}:`, error)
    throw error
  }
}

/**
 * Parses HTML content to extract rikishi data.
 *
 * @param html - Raw HTML content from the sumo website
 * @returns Array of parsed Rikishi objects
 */
export function parseRikishiFromHTML(html: string, division?: DivisionType): Rikishi[] {
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
        records.push(parseRecord($leftBox, rankText, division, Side.EAST))
      }

      // Parse right cell if it has div.box (West side)
      const $rightBox = $rightCell.find('div.box')
      if ($rightBox.length > 0) {
        records.push(parseRecord($rightBox, rankText, division, Side.WEST))
      }
    }
  })

  return records
}

/**
 * Parses a single rikishi record from the HTML table.
 *
 * @param $box - Cheerio object representing the div.box element
 * @param rankText - Rank text from the center td
 * @param division - Division type for context
 * @param side - Side of the ranking (East or West)
 * @returns Parsed Rikishi object
 */
function parseRecord($box: Cheerio<Element>, rankText: string, division?: DivisionType, side?: SideType): Rikishi {
  const href = $box.find('a').attr('href') ?? ''
  const id = +(href.match(/\d+/)?.[0] ?? '0')

  const name = parseRikishiName($box)
  const rank = parseRank(rankText, division, side)

  return {
    id,
    name,
    rank,
  }
}
