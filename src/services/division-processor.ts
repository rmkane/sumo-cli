import { join } from 'node:path'

import { DATA_PATHS } from '@/config/data'
import { Division } from '@/constants'
import { fetchResults } from '@/services/stats-service'
import type { DivisionType, Rikishi } from '@/types'
import { processAllDivisions as processAllDivisionsUtil } from '@/utils/division-iterator'
import { saveJSON } from '@/utils/file'
import { generateRikishiFilename } from '@/utils/filename'
import { logProcessingComplete, logProcessingStart } from '@/utils/logger'
import { getKeyByValue } from '@/utils/object'

/**
 * Processes a single sumo division by fetching, parsing, and saving rikishi data.
 * Downloads are automatically queued with rate limiting by the stats service.
 *
 * @param divisionName - Human-readable division name
 * @param divisionId - Division identifier for API calls
 * @param forceRefresh - Whether to bypass cache and fetch fresh data
 */
export async function processDivision(
  divisionName: string,
  divisionId: DivisionType,
  forceRefresh: boolean,
): Promise<void> {
  logProcessingStart('division processing', `${divisionName} (${divisionId})`)

  const wasFetched = await fetchResults(divisionId, forceRefresh)
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

function generateRikishiFilenameLocal(division: DivisionType): string {
  const divisionName = getKeyByValue(Division, division)
  const filename = generateRikishiFilename(division, divisionName, 'json')
  return join(DATA_PATHS.USER_DATA_DIR, 'json', filename)
}

/**
 * Saves processed rikishi data to a JSON file with metadata.
 *
 * @param results - Array of parsed rikishi data
 * @param division - Division identifier
 */
async function saveResults(results: Rikishi[], division: DivisionType): Promise<void> {
  const divisionName = getKeyByValue(Division, division)
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
