import { Command } from 'commander'

import { processDayMatchups } from '@/services/matchup-processor.js'
import { logDebug, logError } from '@/utils/logger.js'

export function createDownloadMatchupsCommand(program: Command): Command {
  return (
    program
      .command('download-matchups <day>')
      .description('Download matchup data for a specific tournament day (1-15) and save as CSV files')
      // eslint-disable-next-line no-unused-vars
      .action(async (day, _options) => {
        try {
          const dayNum = parseInt(day, 10)
          if (isNaN(dayNum) || dayNum < 1 || dayNum > 15) {
            console.error('Error: Day must be a number between 1 and 15')
            process.exit(1)
          }

          // Get global options from the program
          const globalOptions = program.opts()

          logDebug(`Starting day ${dayNum} processing...`)
          const result = await processDayMatchups(dayNum, globalOptions.forceRefresh, globalOptions.outputDir)

          if (result.filesCreated === 0) {
            console.log(`❌ Day ${dayNum} data not available - tournament may not have reached this day yet`)
            console.log(`   Use 'sumo-cli validate ${dayNum}' to check HTML metadata for details`)
          } else {
            console.log(
              `✅ Matchup data downloaded successfully - ${result.filesCreated} CSV files created in ${result.outputDir}`,
            )
          }
        } catch (error) {
          logError(`processing day ${day}`, error)
          process.exit(1)
        }
      })
  )
}
