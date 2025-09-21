import { Division } from '@/constants'
import { fetchResults } from '@/services/stats-service'
import type { DivisionType, Rikishi } from '@/types'
import { saveJSON } from '@/utils/file'
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
  console.log(`\n=== Processing ${divisionName} (${divisionId}) ===`)

  const wasFetched = await fetchResults(divisionId, forceRefresh)
  await saveResults(wasFetched.results, divisionId)

  console.log(`Fetched ${wasFetched.results.length} rikishi for ${divisionName}`)
}

/**
 * Processes all divisions in parallel.
 *
 * @param forceRefresh - Whether to bypass cache and fetch fresh data
 */
export async function processAllDivisions(forceRefresh: boolean): Promise<void> {
  // Process all divisions in parallel
  const divisionPromises = Object.entries(Division).map(([divisionName, divisionId]) =>
    processDivision(divisionName, divisionId, forceRefresh),
  )

  // Wait for all divisions to complete
  await Promise.all(divisionPromises)
}

/**
 * Saves processed rikishi data to a JSON file with metadata.
 *
 * @param results - Array of parsed rikishi data
 * @param division - Division identifier
 */
async function saveResults(results: Rikishi[], division: DivisionType): Promise<void> {
  const divisionName = getKeyByValue(Division, division)
  const filename = `./data/json/${division}_${divisionName.toLowerCase()}_rikishi.json`

  const data = {
    division: divisionName,
    divisionId: division,
    timestamp: new Date().toISOString(),
    count: results.length,
    rikishi: results,
  }

  await saveJSON(filename, data, 'rikishi')
}
