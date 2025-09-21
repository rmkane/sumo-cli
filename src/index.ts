import { parseArgs } from '@/cli/args'
import { processAllDivisions } from '@/services/division-processor'
import { processDayMatchups } from '@/services/matchup-processor'

/**
 * Main entry point for the application.
 * Processes all sumo divisions and extracts rikishi data.
 */
main()

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

