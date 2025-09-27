import { Command } from 'commander'

import { handleMatchupsCommand } from '@/features/matchups/command-handler'

export function createMatchupsCommand(program: Command): Command {
  return (
    program
      .command('matchups <day>')
      .description('Download matchup data for a specific tournament day (1-15) and save as CSV files')
      // eslint-disable-next-line no-unused-vars
      .action(async (day, _options) => {
        const globalOptions = program.opts()
        const context = {
          day,
          forceRefresh: globalOptions.forceRefresh || false,
          outputDir: globalOptions.outputDir,
        }
        await handleMatchupsCommand(context)
      })
  )
}
