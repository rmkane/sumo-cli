import { join } from 'node:path'

import { DATA_PATHS } from '@/config/data'
import { DIVISION_TO_NUMBER } from '@/constants'
import { fetchResults } from '@/core/services/stats-service'
import { processAllDivisions as processAllDivisionsUtil } from '@/core/utils/division-iterator'
import { saveJSON } from '@/core/utils/file'
import { generateRikishiFilename } from '@/core/utils/filename'
import { logProcessingComplete, logProcessingStart } from '@/core/utils/logger'
import { getKeyByValue } from '@/core/utils/object'
import type { Division, DivisionNumber, Rikishi } from '@/types'

/**
 * Processes a single sumo division by fetching, parsing, and saving rikishi data.
 * Downloads are automatically queued with rate limiting by the stats service.
 *
 * @param divisionName - Human-readable division name
 * @param divisionId - Division identifier for API calls
 * @param forceRefresh - Whether to bypass cache and fetch fresh data
 */
export async function processDivision(
  divisionName: Division,
  divisionId: DivisionNumber,
  forceRefresh: boolean,
): Promise<void> {
  logProcessingStart('division processing', `${divisionName} (${divisionId})`)

  const wasFetched = await fetchResults(divisionName, divisionId, forceRefresh)
  await saveResults(wasFetched.results, divisionId)

  logProcessingComplete('rikishi', wasFetched.results.length, divisionName)
}

/**
 * Processes all divisions in parallel.
 *
 * @param forceRefresh - Whether to bypass cache and fetch fresh data
 * @returns Object containing data directory and number of files created
 */
export async function processAllDivisions(forceRefresh: boolean): Promise<{ dataDir: string; filesCreated: number }> {
  // Process all divisions in parallel using the utility
  await processAllDivisionsUtil((divisionName, divisionId) => processDivision(divisionName, divisionId, forceRefresh))

  return {
    dataDir: DATA_PATHS.USER_DATA_DIR,
    filesCreated: 6, // Always 6 divisions
  }
}

function generateRikishiFilenameLocal(division: DivisionNumber): string {
  const divisionName = getKeyByValue(DIVISION_TO_NUMBER, division) as Division
  const filename = generateRikishiFilename(divisionName, division, 'json')
  return join(DATA_PATHS.USER_DATA_DIR, 'json', filename)
}

/**
 * Saves processed rikishi data to a JSON file with metadata.
 *
 * @param results - Array of parsed rikishi data
 * @param division - Division identifier
 */
async function saveResults(results: Rikishi[], division: DivisionNumber): Promise<void> {
  const divisionName = getKeyByValue(DIVISION_TO_NUMBER, division)
  const filename = generateRikishiFilenameLocal(division)

  const data = {
    division: divisionName,
    divisionId: division,
    timestamp: new Date().toISOString(),
    count: results.length,
    rikishi: results,
  }

  await saveJSON(filename, data, 'rikishi')
}
