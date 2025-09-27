import { processDayMatchups } from '@/features/matchups/processor'
import { logDebug, logError } from '@/utils/logger'

export interface MatchupsCommandContext {
  day: string
  forceRefresh: boolean
  outputDir?: string
}

/**
 * Handles matchups command business logic and console output
 */
export async function handleMatchupsCommand(context: MatchupsCommandContext): Promise<void> {
  try {
    const dayNum = parseInt(context.day, 10)
    if (isNaN(dayNum) || dayNum < 1 || dayNum > 15) {
      console.error('Error: Day must be a number between 1 and 15')
      process.exit(1)
    }

    logDebug(`Starting day ${dayNum} processing...`)
    const result = await processDayMatchups(dayNum, context.forceRefresh, context.outputDir)

    if (result.filesCreated === 0) {
      console.log(`❌ Day ${dayNum} data not available - tournament may not have reached this day yet`)
      console.log(`   Use 'sumo-cli validate ${dayNum}' to check HTML metadata for details`)
    } else {
      console.log(
        `✅ Matchup data downloaded successfully - ${result.filesCreated} CSV files created in ${result.outputDir}`,
      )
    }
  } catch (error) {
    logError(`processing day ${context.day}`, error)
    process.exit(1)
  }
}
