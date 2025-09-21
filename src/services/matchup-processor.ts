import { DATA_PATHS } from '@/config/data'
import { processDivision } from '@/services/division-processor'
import { fetchMatchupData, parseMatchupHTML } from '@/services/matchup'
import type { DivisionType } from '@/types'
import { saveMatchupCSV } from '@/utils/csv'
import { processAllDivisions } from '@/utils/division-iterator'
import { logDebug, logError, logProcessingComplete, logProcessingStart } from '@/utils/logger'

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
  divisionName: string,
  divisionId: DivisionType,
  day: number,
  forceRefresh: boolean,
  outputDir?: string,
): Promise<void> {
  logProcessingStart('matchups', `${divisionName} day ${day}`)

  try {
    const matchupData = await fetchMatchupData(divisionId, day, forceRefresh)
    const parsedMatchups = parseMatchupHTML(matchupData.html, divisionId)

    // Save matchup data as CSV
    await saveMatchupCSV(parsedMatchups, divisionName, divisionId, day, outputDir)

    logProcessingComplete('matchups', parsedMatchups.length, `${divisionName} day ${day}`)
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
  await processAllDivisions((divisionName, divisionId) =>
    processDivisionMatchups(divisionName, divisionId, day, forceRefresh, outputDir),
  )

  // Return output directory info (use default if not specified)
  const finalOutputDir = outputDir || DATA_PATHS.OUTPUT_DIR
  return {
    outputDir: finalOutputDir,
    filesCreated: 6, // Always 6 divisions
  }
}
