import { Command } from 'commander'

import { processAllDivisions } from '@/services/division-processor.js'
import { logDebug, logError } from '@/utils/logger.js'

export function createDownloadStatsCommand(program: Command): Command {
  return (
    program
      .command('download-stats')
      .description('Download rikishi statistics for all divisions and save as JSON files')
      // eslint-disable-next-line no-unused-vars
      .action(async (_options) => {
        try {
          // Get global options from the program
          const globalOptions = program.opts()

          logDebug('Starting full division processing...')
          const result = await processAllDivisions(globalOptions.forceRefresh)
          console.log(
            `✅ Rikishi statistics downloaded successfully - ${result.filesCreated} JSON files created in ${result.dataDir}`,
          )
        } catch (error) {
          logError('processing all divisions', error)
          process.exit(1)
        }
      })
  )
}
