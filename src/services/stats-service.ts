import { type Cheerio, load } from 'cheerio'
import { type Element } from 'domhandler'

import { ranksDictionaryJp } from '@/dict'
import type { DivisionType, Rikishi, RikishiRank, Side } from '@/types'
import { downloadStatsData } from '@/utils/cache-manager'
import { getDivisionName } from '@/utils/division'
import { convertDiacriticsToAscii, kanjiToNumber, toRomajiWithMacrons } from '@/utils/japanese'
import { capitalize, unwrapText } from '@/utils/string'

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
        records.push(parseRecord($leftBox, rankText, division, 'East'))
      }

      // Parse right cell if it has div.box (West side)
      const $rightBox = $rightCell.find('div.box')
      if ($rightBox.length > 0) {
        records.push(parseRecord($rightBox, rankText, division, 'West'))
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
function parseRecord(
  $box: Cheerio<Element>,
  rankText: string,
  division?: DivisionType,
  side?: 'East' | 'West',
): Rikishi {
  const href = $box.find('a').attr('href') || ''
  const id = +(href.match(/\d+/)?.[0] || '0')

  const rank = parseRank(rankText, division, side)

  const kanji = $box.find('a span').text().trim() || $box.find('a').text().trim()
  const hiragana = unwrapText($box.find('.hoshi_br').text())
  const romaji = capitalize(toRomajiWithMacrons(hiragana))
  const english = convertDiacriticsToAscii(romaji)

  return {
    id,
    kanji,
    hiragana,
    romaji,
    english,
    rank,
  }
}

/**
 * Parses a position string from rank text.
 *
 * @param positionText - Position text (e.g., "筆頭", "二枚目", "六枚目", etc.)
 * @returns Position number (0 if not found)
 */
function parsePosition(positionText: string): number | undefined {
  if (!positionText) {
    return undefined
  }

  // Handle special cases
  if (positionText === '筆頭') {
    return 1 // "筆頭" means "first" or "top"
  }

  // Handle "X枚目" format (e.g., "二枚目", "三枚目")
  const match = positionText.match(/^(.+)枚目$/)
  if (match) {
    const numberText = match[1]
    const result = kanjiToNumber(numberText)
    return result > 0 ? result : undefined
  }

  // Try to parse as a direct number
  const result = kanjiToNumber(positionText)
  return result > 0 ? result : undefined
}

/**
 * Parses a rank string from HTML and converts it to a Rank object.
 *
 * @param rankText - Raw rank text from HTML (e.g., "横綱", "大関", "前頭六枚目", etc.)
 * @param division - Division type for context
 * @param side - Side of the ranking (East or West)
 * @returns Rank object with division, position, and side
 */
function parseRank(rankText: string, division?: DivisionType, side?: Side): RikishiRank | undefined {
  // Clean the rank text
  const cleanRank = rankText.trim()

  // Get division name from division ID
  const divisionName = division ? getDivisionName(division) : 'unknown'
  const divisionCapitalized = divisionName.charAt(0).toUpperCase() + divisionName.slice(1)

  // Handle specific rank formats from the HTML
  if (cleanRank === '筆頭') {
    return { division: divisionCapitalized, position: 1, side }
  }

  // Handle other rank formats (e.g., "序ノ口十八枚目") - check ranks dictionary first
  for (const [kanji, english] of Object.entries(ranksDictionaryJp)) {
    if (cleanRank.startsWith(kanji)) {
      const division = english.charAt(0).toUpperCase() + english.slice(1)

      // Extract position from remaining text
      const remainingText = cleanRank.replace(kanji, '').trim()

      // Check if remaining text matches "X枚目" pattern
      const match = remainingText.match(/^(.+)枚目$/)
      if (match) {
        const positionText = match[1]
        const position = parsePosition(positionText)
        return position !== undefined ? { division, position, side } : { division, side }
      }

      // Try to parse remaining text as position
      const position = parsePosition(remainingText)
      return position !== undefined ? { division, position, side } : { division, side }
    }
  }

  // Handle "X枚目" format (e.g., "二枚目", "三枚目") - only if no rank match found
  const match = cleanRank.match(/^(.+)枚目$/)
  if (match) {
    const positionText = match[1]
    const position = parsePosition(positionText)
    // Only include position if it's meaningful (not undefined)
    return position !== undefined
      ? { division: divisionCapitalized, position, side }
      : { division: divisionCapitalized, side }
  }

  // If no rank pattern matched, use the division parameter as fallback
  if (division) {
    return { division: divisionCapitalized, side }
  }

  // Fallback for unknown ranks
  return undefined
}
