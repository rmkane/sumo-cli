import type { DivisionType } from '@/types'
import { Division } from '@/constants'
import { fetchMatchupData, parseMatchupHTML } from '@/services/matchup'
import { saveMatchupCSV } from '@/utils/csv'
import { processDivision } from '@/services/division-processor'

/**
 * Processes matchup data for a specific division and day.
 *
 * @param divisionName - Human-readable division name
 * @param divisionId - Division identifier for API calls
 * @param day - Tournament day (1-15)
 * @param forceRefresh - Whether to bypass cache and fetch fresh data
 */
export async function processDivisionMatchups(
  divisionName: string,
  divisionId: DivisionType,
  day: number,
  forceRefresh: boolean,
): Promise<void> {
  console.log(`\n=== Processing ${divisionName} day ${day} matchups ===`)

  try {
    const matchupData = await fetchMatchupData(divisionId, day, forceRefresh)
    const parsedMatchups = parseMatchupHTML(matchupData.html, divisionId)

    // Save matchup data as CSV
    await saveMatchupCSV(parsedMatchups, divisionName, divisionId, day)

    console.log(`Processed ${parsedMatchups.length} matchups for ${divisionName} day ${day}`)
  } catch (error) {
    console.error(`Error processing ${divisionName} day ${day}:`, error)
    throw error
  }
}

/**
 * Processes matchup data for a specific day across all divisions.
 *
 * @param day - Tournament day (1-15)
 * @param forceRefresh - Whether to bypass cache and fetch fresh data
 */
export async function processDayMatchups(day: number, forceRefresh: boolean): Promise<void> {
  console.log(`\n=== Processing day ${day} matchups ===`)

  // First, ensure we have division info cached
  console.log('Caching division info...')
  const divisionPromises = Object.entries(Division).map(
    ([divisionName, divisionId]) =>
      processDivision(divisionName, divisionId, forceRefresh),
  )
  await Promise.all(divisionPromises)

  // Then fetch and process matchup data for each division
  console.log('Fetching matchup data...')
  const matchupPromises = Object.entries(Division).map(
    ([divisionName, divisionId]) =>
      processDivisionMatchups(divisionName, divisionId, day, forceRefresh),
  )
  await Promise.all(matchupPromises)
}
