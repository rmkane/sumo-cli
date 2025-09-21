import { load } from 'cheerio'
import type { DivisionType } from '../types'
import { getDivisionByRank } from '../utils/division'
import { translateRank, translateRecord } from '../utils/translation'
import { lookupRikishiByKanji } from './rikishi-lookup'
import { downloadMatchupData } from '../utils/cache-manager'

/**
 * Interface for parsed matchup data
 */
export interface MatchupData {
  east: {
    rank: string
    record: string
    kanji: string
    hiragana: string
    name: string
  }
  west: {
    rank: string
    record: string
    kanji: string
    hiragana: string
    name: string
  }
}


/**
 * Fetches matchup data for a specific division and day, using cache when possible.
 * Downloads are queued with rate limiting to be respectful to the server.
 *
 * @param division - Division identifier
 * @param day - Tournament day (1-15)
 * @param forceRefresh - Whether to bypass cache
 * @returns Object containing HTML content and whether data was fetched from server
 */
export async function fetchMatchupData(
  division: DivisionType,
  day: number,
  forceRefresh: boolean = false,
): Promise<{ html: string; fromServer: boolean }> {
  try {
    const { content: html, fromServer } = await downloadMatchupData(division, day, forceRefresh)
    return { html, fromServer }
  } catch (error) {
    console.error(`Error fetching matchup data for division ${division} day ${day}:`, error)
    throw error
  }
}


/**
 * Parses HTML content to extract matchup data from the torikumi table.
 *
 * @param html - Raw HTML content from the sumo website
 * @param division - Division identifier for rikishi lookup
 * @returns Array of parsed MatchupData objects
 */
export function parseMatchupHTML(html: string, division: DivisionType): MatchupData[] {
  const $ = load(html)
  const matchups: MatchupData[] = []

  // Find the torikumi table
  const table = $('#torikumi_table')
  if (table.length === 0) {
    console.warn('No torikumi table found in HTML')
    return matchups
  }

  // Process each row (skip the first header row)
  table.find('tbody tr').slice(1).each((_, row) => {
    const $row = $(row)
    const matchup = parseMatchupRow($row, division)
    if (matchup) {
      matchups.push(matchup)
    }
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
function parseMatchupRow($row: any, division: DivisionType): MatchupData | null {
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
    if (!eastPlayer.kanji || !westPlayer.kanji || !eastPlayer.rank || !westPlayer.rank) {
      return null
    }

    return {
      east: eastPlayer,
      west: westPlayer,
    }
  } catch (error) {
    console.warn('Error parsing matchup row:', error)
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
function parsePlayer($player: any, division: DivisionType): { rank: string; record: string; kanji: string; hiragana: string; name: string } | null {
  try {
    // Extract rank
    const rankText = $player.find('.rank').text().trim()
    const rank = translateRank(rankText)

    // Extract name (kanji) - it's inside a span within an anchor tag
    const kanji = $player.find('.name span').text().trim()

    // Extract record/performance
    const recordText = $player.find('.perform').text().trim()
    const record = translateRecord(recordText)

    // Determine the correct division based on the rank
    const rankDivision = getDivisionByRank(rank)

    // Look up rikishi data to get hiragana and English name
    const rikishiData = lookupRikishiByKanji(kanji, rankDivision || division)
    const hiragana = rikishiData?.hiragana || kanji
    const name = rikishiData?.english || kanji

    // Only warn for non-empty names that weren't found
    if (!rikishiData && kanji.trim()) {
      console.warn(`Rikishi not found in JSON: "${kanji}" (rank: ${rank}, division: ${rankDivision || division})`)
    }

    return {
      rank,
      record,
      kanji,
      hiragana,
      name,
    }
  } catch (error) {
    console.warn('Error parsing player:', error)
    return null
  }
}


