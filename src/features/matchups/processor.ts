import { DATA_PATHS } from '@/config/data'
import { parseMatchupHTML } from '@/core/parsers'
import { processDivision } from '@/core/services/division-processor'
import { fetchMatchupData } from '@/core/services/matchup-fetcher'
import { processAllDivisions } from '@/core/utils/division-iterator'
import { logDebug, logError, logProcessingComplete, logProcessingStart, logWarning } from '@/core/utils/logger'
import type { Division, DivisionNumber } from '@/types'

import { saveMatchupCSV } from './csv'
import { saveMatchupJSON } from './json'

/**
 * Processes matchup data for a specific division and day.
 *
 * @param divisionName - Human-readable division name
 * @param divisionId - Division identifier for API calls
 * @param day - Tournament day (1-15)
 * @param forceRefresh - Whether to bypass cache and fetch fresh data
 * @param outputDir - Custom output directory for CSV files
 */
export async function processDivisionMatchups(
  divisionName: Division,
  divisionId: DivisionNumber,
  day: number,
  forceRefresh: boolean,
  outputDir?: string,
): Promise<void> {
  logProcessingStart('matchups', `${divisionName} day ${day}`)

  try {
    const matchupData = await fetchMatchupData(divisionName, divisionId, day, forceRefresh)
    const parsedMatchups = parseMatchupHTML(matchupData.html, divisionName, day)

    // Only save files if we have valid matchups
    if (parsedMatchups.length > 0) {
      // Save JSON data to config directory
      await saveMatchupJSON(parsedMatchups, divisionName, divisionId, day)

      // Save CSV data to output directory
      await saveMatchupCSV(parsedMatchups, divisionName, divisionId, day, outputDir)

      logProcessingComplete('matchups', parsedMatchups.length, `${divisionName} day ${day}`)
    } else {
      logWarning(`No valid matchups found for ${divisionName} day ${day} - skipping file creation`)
    }
  } catch (error) {
    logError(`${divisionName} day ${day}`, error)
    throw error
  }
}

/**
 * Processes matchup data for a specific day across all divisions.
 *
 * @param day - Tournament day (1-15)
 * @param forceRefresh - Whether to bypass cache and fetch fresh data
 * @param outputDir - Custom output directory for CSV files
 * @returns Object containing output directory and number of files created
 */
export async function processDayMatchups(
  day: number,
  forceRefresh: boolean,
  outputDir?: string,
): Promise<{ outputDir: string; filesCreated: number }> {
  logProcessingStart('day matchups', `day ${day}`)

  // First, ensure we have division info cached
  logDebug('Caching division info...')
  await processAllDivisions((divisionName, divisionId) => processDivision(divisionName, divisionId, forceRefresh))

  // Then fetch and process matchup data for each division
  logDebug('Fetching matchup data...')
  let filesCreated = 0
  await processAllDivisions(async (divisionName, divisionId) => {
    const matchupData = await fetchMatchupData(divisionName, divisionId, day, forceRefresh)
    const parsedMatchups = parseMatchupHTML(matchupData.html, divisionName, day)

    if (parsedMatchups.length > 0) {
      // Save JSON data to config directory
      await saveMatchupJSON(parsedMatchups, divisionName, divisionId, day)

      // Save CSV data to output directory
      await saveMatchupCSV(parsedMatchups, divisionName, divisionId, day, outputDir)

      filesCreated++
      logProcessingComplete('matchups', parsedMatchups.length, `${divisionName} day ${day}`)
    } else {
      logWarning(`No valid matchups found for ${divisionName} day ${day} - skipping file creation`)
    }
  })

  // Return output directory info (use default if not specified)
  const finalOutputDir = outputDir ?? DATA_PATHS.OUTPUT_DIR
  return {
    outputDir: finalOutputDir,
    filesCreated,
  }
}
