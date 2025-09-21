import type { DivisionType, Rikishi } from './types'
import { Division } from './constants'

import { saveJSON } from './utils/file'
import { getKeyByValue } from './utils/object'
import { fetchResults } from './services/fetcher'
import { fetchMatchupData, parseMatchupHTML } from './services/matchup'

/**
 * Main entry point for the application.
 * Processes all sumo divisions and extracts rikishi data.
 */
main()

/**
 * Parses command line arguments for CLI functionality.
 */
function parseArgs(): { day?: number; forceRefresh: boolean } {
  const args = process.argv.slice(2)
  let day: number | undefined
  let forceRefresh = false

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--day' || arg === '-d') {
      const dayValue = args[i + 1]
      if (dayValue && !isNaN(Number(dayValue))) {
        day = Number(dayValue)
        i++ // Skip the next argument since we consumed it
      } else {
        console.error('Error: --day/-d requires a numeric value')
        process.exit(1)
      }
    } else if (arg === '--refresh') {
      forceRefresh = true
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
Usage: npm run dev [options]

Options:
  --day, -d <number>    Specify the day of the tournament (1-15)
  --refresh             Force refresh of cached data
  --help, -h            Show this help message

Examples:
  npm run dev -- --day 1          # Process day 1 matchups
  npm run dev -- --day 5 --refresh # Process day 5 with fresh data
  npm run dev                      # Process all divisions (original behavior)
      `)
      process.exit(0)
    }
  }

  return { day, forceRefresh }
}

/**
 * Orchestrates the processing of all sumo divisions in parallel.
 * Handles command line arguments and error handling.
 */
async function main(): Promise<void> {
  try {
    const { day, forceRefresh } = parseArgs()

    if (day !== undefined) {
      console.log(`Starting CLI for day ${day}${forceRefresh ? ' (force refresh enabled)' : ''}`)
      await processDayMatchups(day, forceRefresh)
    } else {
      console.log(`Starting App${forceRefresh ? ' (force refresh enabled)' : ''}`)
      await processAllDivisions(forceRefresh)
    }

    console.log('\n=== Processing completed successfully ===')
  } catch (error) {
    console.error('Fatal error in main:', error)
    process.exit(1)
  }
}

/**
 * Processes all divisions in parallel (original behavior).
 */
async function processAllDivisions(forceRefresh: boolean): Promise<void> {
  // Process all divisions in parallel
  const divisionPromises = Object.entries(Division).map(
    ([divisionName, divisionId]) =>
      processDivision(divisionName, divisionId, forceRefresh),
  )

  // Wait for all divisions to complete
  await Promise.all(divisionPromises)
}

/**
 * Processes matchup data for a specific day across all divisions.
 */
async function processDayMatchups(day: number, forceRefresh: boolean): Promise<void> {
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
  forceRefresh: boolean,
): Promise<void> {
  console.log(`\n=== Processing ${divisionName} (${divisionId}) ===`)

  const wasFetched = await fetchResults(divisionId, forceRefresh)
  await saveResults(wasFetched.results, divisionId)

  console.log(
    `Fetched ${wasFetched.results.length} rikishi for ${divisionName}`,
  )
}

/**
 * Processes matchup data for a specific division and day.
 *
 * @param divisionName - Human-readable division name
 * @param divisionId - Division identifier for API calls
 * @param day - Tournament day (1-15)
 * @param forceRefresh - Whether to bypass cache and fetch fresh data
 */
async function processDivisionMatchups(
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
 * Saves processed rikishi data to a JSON file with metadata.
 *
 * @param results - Array of parsed rikishi data
 * @param division - Division identifier
 */
async function saveResults(
  results: Rikishi[],
  division: DivisionType,
): Promise<void> {
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

/**
 * Saves matchup data to a CSV file.
 *
 * @param matchups - Array of parsed matchup data
 * @param divisionName - Human-readable division name
 * @param divisionId - Division identifier
 * @param day - Tournament day
 */
async function saveMatchupCSV(
  matchups: any[],
  divisionName: string,
  divisionId: DivisionType,
  day: number,
): Promise<void> {
  const fs = await import('node:fs')
  const path = await import('node:path')

  // Create CSV directory if it doesn't exist
  const csvDir = './data/csv'
  if (!fs.existsSync(csvDir)) {
    fs.mkdirSync(csvDir, { recursive: true })
  }

  // Generate CSV content
  const csvContent = generateMatchupCSV(matchups)

  // Save to file
  const filename = `day_${day}_${divisionId}_${divisionName.toLowerCase()}.csv`
  const filepath = path.join(csvDir, filename)

  fs.writeFileSync(filepath, csvContent, 'utf8')
  console.log(`Saved matchup CSV: ${filepath}`)
}

/**
 * Generates CSV content from matchup data.
 *
 * @param matchups - Array of parsed matchup data
 * @returns CSV content as string
 */
function generateMatchupCSV(matchups: any[]): string {
  const headers = [
    '', '', 'East', '', '', '', '', '', '', 'West', '', ''
  ]
  const subHeaders = [
    'Rank', 'Record', 'Kanji', 'Hiragana', 'Name', '', '', 'Name', 'Hiragana', 'Kanji', 'Record', 'Rank'
  ]

  const rows = [
    headers.join('\t'),
    subHeaders.join('\t'),
    ...matchups.map(matchup => [
      matchup.east.rank || '',
      matchup.east.record || '',
      matchup.east.kanji || '',
      matchup.east.hiragana || '',
      matchup.east.name || '',
      '',
      '',
      matchup.west.name || '',
      matchup.west.hiragana || '',
      matchup.west.kanji || '',
      matchup.west.record || '',
      matchup.west.rank || ''
    ].join('\t'))
  ]

  return rows.join('\n')
}
