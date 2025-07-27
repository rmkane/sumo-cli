import type { DivisionType, Rikishi } from './types';
import { Division } from './constants';

import { saveJSON } from './utils/file';
import { getKeyByValue } from './utils/object';
import { fetchResults } from './services/fetcher';

/**
 * Main entry point for the application.
 * Processes all sumo divisions and extracts rikishi data.
 */
main();

/**
 * Orchestrates the processing of all sumo divisions in parallel.
 * Handles command line arguments and error handling.
 */
async function main(): Promise<void> {
  try {
    const forceRefresh = process.argv.includes('--refresh');
    console.log(
      `Starting App${forceRefresh ? ' (force refresh enabled)' : ''}`
    );

    // Process all divisions in parallel
    const divisionPromises = Object.entries(Division).map(
      ([divisionName, divisionId]) =>
        processDivision(divisionName, divisionId, forceRefresh)
    );

    // Wait for all divisions to complete
    await Promise.all(divisionPromises);

    console.log('\n=== All divisions processed successfully ===');
  } catch (error) {
    console.error('Fatal error in main:', error);
    process.exit(1);
  }
}

/**
 * Processes a single sumo division by fetching, parsing, and saving rikishi data.
 * Downloads are automatically queued with rate limiting by the fetcher service.
 *
 * @param divisionName - Human-readable division name
 * @param divisionId - Division identifier for API calls
 * @param forceRefresh - Whether to bypass cache and fetch fresh data
 */
async function processDivision(
  divisionName: string,
  divisionId: DivisionType,
  forceRefresh: boolean
): Promise<void> {
  console.log(`\n=== Processing ${divisionName} (${divisionId}) ===`);

  const wasFetched = await fetchResults(divisionId, forceRefresh);
  await saveResults(wasFetched.results, divisionId);

  console.log(
    `Fetched ${wasFetched.results.length} rikishi for ${divisionName}`
  );
}

/**
 * Saves processed rikishi data to a JSON file with metadata.
 *
 * @param results - Array of parsed rikishi data
 * @param division - Division identifier
 */
async function saveResults(
  results: Rikishi[],
  division: DivisionType
): Promise<void> {
  const divisionName = getKeyByValue(Division, division);
  const filename = `./data/json/${divisionName.toLowerCase()}_rikishi.json`;

  const data = {
    division: divisionName,
    divisionId: division,
    timestamp: new Date().toISOString(),
    count: results.length,
    rikishi: results,
  };

  await saveJSON(filename, data, 'rikishi');
}
