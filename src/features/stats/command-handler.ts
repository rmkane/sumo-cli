import { processAllDivisions } from '@/core/services/division-processor'
import { logDebug, logError } from '@/core/utils/logger'

export interface StatsCommandContext {
  forceRefresh: boolean
}

/**
 * Handles stats command business logic and console output
 */
export async function handleStatsCommand(context: StatsCommandContext): Promise<void> {
  try {
    logDebug('Starting full division processing...')
    const result = await processAllDivisions(context.forceRefresh)
    console.log(
      `✅ Rikishi statistics downloaded successfully - ${result.filesCreated} JSON files created in ${result.dataDir}`,
    )
  } catch (error) {
    logError('processing all divisions', error)
    process.exit(1)
  }
}
