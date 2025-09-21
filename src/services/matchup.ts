import { load } from 'cheerio'
import fs from 'node:fs'
import path from 'node:path'
import type { DivisionType, Rikishi } from '../types'
import { Division, RankMapping } from '../constants'
import { RateLimitedQueue } from '../classes/queue'
import {
  ensureCacheDirectory,
  getCachePath,
  readFromCache,
  writeToCache,
} from '../utils/cache'
import { fetchHTML } from '../utils/html'
import { kanjiToNumber } from '../utils/japanese'

// Configuration constants
const MATCHUP_BASE_URL = 'https://www.sumo.or.jp/ResultData/torikumi'

// Global queue for rate-limited downloads
const downloadQueue = new RateLimitedQueue(2000)

// Cache for rikishi data by division
const rikishiDataCache = new Map<DivisionType, Rikishi[]>()

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
 * Loads rikishi data for a specific division from JSON file.
 *
 * @param division - Division identifier
 * @returns Array of rikishi data
 */
function loadRikishiData(division: DivisionType): Rikishi[] {
  if (rikishiDataCache.has(division)) {
    return rikishiDataCache.get(division)!
  }

  const divisionName = getDivisionName(division)
  const filename = `./data/json/${division}_${divisionName}_rikishi.json`

  try {
    const data = JSON.parse(fs.readFileSync(filename, 'utf8'))
    const rikishiData = data.rikishi || []
    rikishiDataCache.set(division, rikishiData)
    return rikishiData
  } catch (error) {
    console.warn(`Error loading rikishi data for division ${division}:`, error)
    return []
  }
}

/**
 * Looks up rikishi data by kanji name within a division.
 *
 * @param kanji - Kanji name to search for
 * @param division - Division to search in
 * @returns Rikishi data or null if not found
 */
function lookupRikishiByKanji(kanji: string, division: DivisionType): Rikishi | null {
  // First try exact match in the current division
  const rikishiData = loadRikishiData(division)
  let rikishi = rikishiData.find(r => r.kanji === kanji)

  if (rikishi) {
    return rikishi
  }

  // If not found, try searching in all divisions
  for (const [divisionName, divisionId] of Object.entries(Division)) {
    if (divisionId === division) continue // Skip current division

    const otherDivisionData = loadRikishiData(divisionId as DivisionType)
    rikishi = otherDivisionData.find(r => r.kanji === kanji)

    if (rikishi) {
      return rikishi
    }
  }

  return null
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
  const url = `${MATCHUP_BASE_URL}/${division}/${day}/`
  const cachePath = getCachePath(`day_${day}_${division}_${getDivisionName(division)}.html`)

  let html: string
  let fromServer = false

  try {
    await ensureCacheDirectory()

    // Try cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = await readFromCache(cachePath)
      if (cached) {
        html = cached
        fromServer = false
      } else {
        html = await downloadFromServer(division, day, url, cachePath, false)
        fromServer = true
      }
    } else {
      html = await downloadFromServer(division, day, url, cachePath, true)
      fromServer = true
    }
  } catch (error) {
    console.error(`Error fetching matchup data for division ${division} day ${day}:`, error)
    throw error
  }

  return { html, fromServer }
}

/**
 * Downloads matchup content from server with rate limiting and caching.
 *
 * @param division - Division identifier for logging
 * @param day - Tournament day for logging
 * @param url - URL to download from
 * @param cachePath - Path to cache the downloaded content
 * @param isForceRefresh - Whether this is a force refresh download
 * @returns Downloaded HTML content
 */
async function downloadFromServer(
  division: DivisionType,
  day: number,
  url: string,
  cachePath: string,
  isForceRefresh: boolean,
): Promise<string> {
  return downloadQueue.add(async () => {
    console.log(`${isForceRefresh ? 'Force ' : ''}Downloading ${getDivisionName(division)} day ${day} matchups...`)
    const content = await fetchHTML(url)
    await writeToCache(cachePath, content)
    return content
  })
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

/**
 * Translates Japanese rank text to English format.
 *
 * @param rankText - Japanese rank text (e.g., "前頭十八枚目")
 * @returns English rank format (e.g., "Maegashira #18")
 */
function translateRank(rankText: string): string {
  const cleanRank = rankText.trim()

  // Find the matching rank in our mapping
  for (const rankEntry of RankMapping) {
    if (cleanRank.startsWith(rankEntry.kanji)) {
      const division = rankEntry.english
      let position = 0

      // Extract position from remaining text (e.g., "六枚目" -> 6)
      const remainingText = cleanRank.replace(rankEntry.kanji, '').trim()

      if (remainingText) {
        // Remove "枚目" suffix if present
        const positionText = remainingText.replace('枚目', '')
        if (positionText) {
          position = kanjiToNumber(positionText)
        }
      }

      if (position > 0) {
        return `${division} #${position}`
      } else {
        return division
      }
    }
  }

  // Fallback for unknown ranks
  return cleanRank
}

/**
 * Translates Japanese record text to English format.
 *
 * @param recordText - Japanese record text (e.g., "（6勝2敗）")
 * @returns English record format (e.g., "(6-2)")
 */
function translateRecord(recordText: string): string {
  if (!recordText) return ''

  // Extract wins and losses from pattern like "（6勝2敗）"
  const match = recordText.match(/（(\d+)勝(\d+)敗）/)
  if (match) {
    const wins = match[1]
    const losses = match[2]
    return `(${wins}-${losses})`
  }

  // Fallback - return original text
  return recordText
}

/**
 * Gets the division name from division ID.
 *
 * @param division - Division identifier
 * @returns Division name
 */
function getDivisionName(division: DivisionType): string {
  const divisionNames = {
    [Division.MAKUUCHI]: 'makuuchi',
    [Division.JURYO]: 'juryo',
    [Division.MAKUSHITA]: 'makushita',
    [Division.SANDANME]: 'sandanme',
    [Division.JONIDAN]: 'jonidan',
    [Division.JONOKUCHI]: 'jonokuchi',
  }
  return divisionNames[division] || 'unknown'
}

/**
 * Determines the division based on the rank string.
 * Based on the logic from basho.js.
 *
 * @param rank - Rank string (e.g., "Maegashira #17", "Juryo #10")
 * @returns Division identifier or null if not found
 */
function getDivisionByRank(rank: string): DivisionType | null {
  const match = rank.match(/([A-Za-z]+)(?:\s#(\d+))?/)
  if (!match) {
    return null
  }

  const [, divisionName] = match

  // Map rank names to division IDs
  const rankToDivision: Record<string, DivisionType> = {
    'Yokozuna': Division.MAKUUCHI,
    'Ozeki': Division.MAKUUCHI,
    'Sekiwake': Division.MAKUUCHI,
    'Komusubi': Division.MAKUUCHI,
    'Maegashira': Division.MAKUUCHI,
    'Juryo': Division.JURYO,
    'Makushita': Division.MAKUSHITA,
    'Sandanme': Division.SANDANME,
    'Jonidan': Division.JONIDAN,
    'Jonokuchi': Division.JONOKUCHI,
  }

  return rankToDivision[divisionName] || null
}
