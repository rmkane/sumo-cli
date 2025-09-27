import { type Cheerio, load } from 'cheerio'
import { type Element } from 'domhandler'

import { CssClasses, MatchResult } from '@/constants'
import { lookupKimarite } from '@/dict'
import { findRikishiAcrossDivisions } from '@/services/rikishi-lookup'
import { isDayAvailable } from '@/services/tournament'
import type { DivisionType, MatchResultType, MatchupData, RikishiName, RikishiRank, RikishiRecord } from '@/types'
import { downloadMatchupData } from '@/utils/cache-manager'
import { getDivisionByRank, getDivisionName } from '@/utils/division'
import { logDebug, logError, logWarning } from '@/utils/logger'

const KIMARITE_SUFFIX = '取組解説'

/**
 * Validates that the HTML content matches the requested day.
 *
 * @param html - Raw HTML content from the sumo website
 * @param requestedDay - The day that was requested
 * @returns Object containing validation results and extracted metadata
 */
export function validateHTMLDate(
  html: string,
  requestedDay: number,
): {
  isValid: boolean
  actualDay: number | null
  actualDate: string | null
  warnings: string[]
} {
  const $ = load(html)
  const warnings: string[] = []

  // Extract actual day from hidden form fields
  const actualDayValue = $('#day').val()
  const actualDay = actualDayValue ? parseInt(actualDayValue.toString(), 10) : null

  // Extract date from the day header
  const dayHeaderText = $('#dayHead').text().trim()
  const dateMatch = dayHeaderText.match(/令和(\d+)年(\d+)月(\d+)日/)
  const actualDate = dateMatch
    ? `${dateMatch[1]}-${dateMatch[2].padStart(2, '0')}-${dateMatch[3].padStart(2, '0')}`
    : null

  // Extract tournament day name
  const tournamentDayText = $('.mdDate').text().trim()
  const dayNameMatch = tournamentDayText.match(/令和七年九月場所:(.+)/)
  const dayName = dayNameMatch ? dayNameMatch[1] : null

  // Smart validation: Check if the requested day should be available
  const shouldBeAvailable = isDayAvailable(requestedDay, actualDate)

  if (actualDay !== null && actualDay !== requestedDay) {
    if (shouldBeAvailable) {
      warnings.push(`Requested day ${requestedDay} but HTML contains day ${actualDay} - data should be available`)
    } else {
      warnings.push(`Requested day ${requestedDay} but HTML contains day ${actualDay} - data not yet available`)
    }
  }

  // Validate day name consistency (but be lenient if day number matches)
  if (dayName && actualDay !== null) {
    const expectedDayNames: { [key: number]: string } = {
      1: '初日',
      2: '二日目',
      3: '三日目',
      4: '四日目',
      5: '五日目',
      6: '六日目',
      7: '七日目',
      8: '中日',
      9: '九日目',
      10: '十日目',
      11: '十一日目',
      12: '十二日目',
      13: '十三日目',
      14: '十四日目',
      15: '千秋楽',
    }

    const expectedDayName = expectedDayNames[actualDay]
    if (expectedDayName && dayName !== expectedDayName) {
      // Only warn if the day number also doesn't match - this could be a website update delay
      if (actualDay !== requestedDay) {
        warnings.push(`Day ${actualDay} should be "${expectedDayName}" but HTML shows "${dayName}"`)
      }
    }
  }

  // Check if we're requesting future data using JST
  const nowJST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }))
  const currentYear = nowJST.getFullYear()
  const currentMonth = nowJST.getMonth() + 1
  const currentDay = nowJST.getDate()

  if (actualDate) {
    const [year, month, day] = actualDate.split('-').map(Number)
    const htmlDate = new Date(year, month - 1, day)

    // Sumo matchups are announced the day before, so allow data up to 1 day in the future
    const maxAllowedDate = new Date(nowJST)
    maxAllowedDate.setDate(maxAllowedDate.getDate() + 1)

    if (htmlDate > maxAllowedDate) {
      warnings.push(
        `HTML date ${actualDate} is too far in the future (current JST: ${currentYear}-${currentMonth.toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')})`,
      )
    }
  }

  const isValid = warnings.length === 0

  return {
    isValid,
    actualDay,
    actualDate,
    warnings,
  }
}

/**
 * Extracts and translates the winning technique from a player cell
 * @param $player - Cheerio element representing the player cell
 * @returns English kimarite name or undefined if no technique found
 */
function extractWinningTechnique($player: Cheerio<Element>): string | undefined {
  // Look for the technique in a sibling .decide cell
  const $decideCell = $player.siblings('.decide')
  if ($decideCell.length === 0) {
    return undefined
  }

  const techniqueLink = $decideCell.find('a.technic')
  if (techniqueLink.length === 0) {
    return undefined
  }

  const japaneseTechnique = techniqueLink.text().trim()
  if (!japaneseTechnique) {
    return undefined
  }

  // Remove "取組解説" suffix if present
  const cleanTechnique = japaneseTechnique.replace(KIMARITE_SUFFIX, '').trim()

  // Look up the English translation
  return lookupKimarite(cleanTechnique)
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
    logError(`fetching matchup data for division ${division} day ${day}`, error)
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
export function parseMatchupHTML(html: string, division: DivisionType, requestedDay?: number): MatchupData[] {
  const $ = load(html)
  const matchups: MatchupData[] = []

  // Validate HTML date if requested day is provided
  if (requestedDay !== undefined) {
    const validation = validateHTMLDate(html, requestedDay)

    if (!validation.isValid) {
      logWarning(`HTML date validation failed for day ${requestedDay}:`)
      validation.warnings.forEach((warning) => logWarning(`  - ${warning}`))

      if (validation.actualDay !== null) {
        logWarning(`  - HTML contains day ${validation.actualDay} data instead of requested day ${requestedDay}`)
      }
      if (validation.actualDate) {
        logWarning(`  - HTML date: ${validation.actualDate}`)
      }

      // Return empty array to prevent CSV creation when validation fails
      return []
    } else {
      logDebug(`HTML date validation passed for day ${requestedDay}`)
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
    const record = parseRecord(recordText) // Parse

    // Determine the correct division based on the rank
    const rankDivision = getDivisionByRank(rankText)

    // Look up rikishi data to get hiragana and English name
    const rikishiData = findRikishiAcrossDivisions(kanji, rankDivision || division)
    const hiragana = rikishiData?.hiragana || kanji
    const name = rikishiData?.english || kanji

    // Only warn for non-empty names that weren't found
    if (!rikishiData && kanji.trim()) {
      logWarning(`Rikishi not found in JSON: "${kanji}" (rank: ${rank}, division: ${rankDivision || division})`)
    }

    return {
      name: {
        english: name,
        kanji,
        hiragana,
      },
      rank,
      record,
    }
  } catch (error) {
    logWarning(`Error parsing player: ${error instanceof Error ? error.message : String(error)}`)
    return null
  }
}

/**
 * Parses a rank string into structured rank information.
 *
 * @param rankText - Japanese rank text from the HTML
 * @param division - Division identifier for context
 * @returns Structured rank information
 */
export function parseRank(rankText: string, division: DivisionType): RikishiRank {
  const cleanRank = rankText.trim()

  // Get division name from division ID
  const divisionName = getDivisionByRank(cleanRank) || division
  const divisionNameStr = getDivisionName(divisionName)

  // Handle specific rank formats
  if (cleanRank === '筆頭') {
    return { division: divisionNameStr, position: 1 }
  }

  // Handle ranks with positions (e.g., "前頭十八枚目")
  const match = cleanRank.match(/^(.+?)(\d+)枚目$/)
  if (match) {
    const position = parseInt(match[2], 10)
    return { division: divisionNameStr, position }
  }

  // Handle ranks without positions (e.g., "横綱", "大関")
  return { division: divisionNameStr }
}

/**
 * Parses a single record from the HTML.
 *
 * @param recordText - Record text from the HTML
 * @returns Parsed record data or null if parsing fails
 */
export function parseRecord(recordText: string): RikishiRecord {
  if (!recordText) return { wins: 0, losses: 0 }

  // Extract wins, losses, and rest days from pattern like "（6勝2敗）" or "（1勝0敗3休）"
  const matchWithRest = recordText.match(/（(\d+)勝(\d+)敗(\d+)休）/)
  if (matchWithRest) {
    const wins = matchWithRest[1]
    const losses = matchWithRest[2]
    const rest = matchWithRest[3]
    return { wins: parseInt(wins, 10), losses: parseInt(losses, 10), rest: parseInt(rest, 10) }
  }

  // Extract wins and losses from pattern like "（6勝2敗）"
  const match = recordText.match(/（(\d+)勝(\d+)敗）/)
  if (match) {
    const wins = match[1]
    const losses = match[2]
    return { wins: parseInt(wins, 10), losses: parseInt(losses, 10) }
  }

  // Fallback - return original text
  return { wins: 0, losses: 0 }
}

/**
 * Determines the win/loss result for a player based on CSS classes.
 *
 * @param $player - Cheerio object representing the player cell
 * @returns 'W' for win, 'L' for loss, '' for no result yet
 */
function determineResult($player: Cheerio<Element>): MatchResultType {
  // Check if the player cell has the 'win' class (completed match - winner)
  if ($player.hasClass(CssClasses.WIN)) {
    return MatchResult.WIN
  }

  // Check if the player cell has the 'player' class but no 'win' class
  // This indicates they lost (since the winner would have 'win' class)
  if ($player.hasClass(CssClasses.PLAYER) && !$player.hasClass(CssClasses.WIN)) {
    // Look for result indicators in the same row to confirm this is a completed match
    const $row = $player.closest('tr')
    const $resultCells = $row.find(`td.${CssClasses.RESULT}`)

    // Check if there are result images indicating completed match
    const hasResultImages = $resultCells.find('img[src*="result_ic"]').length > 0

    if (hasResultImages) {
      return MatchResult.LOSS
    }
  }

  // No result yet (incomplete day)
  return MatchResult.NO_RESULT
}
