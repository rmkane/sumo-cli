import { Command } from 'commander'

import { handleStatsCommand } from '@/features/stats/command-handler'

export function createStatsCommand(program: Command): Command {
  return (
    program
      .command('stats')
      .description('Download rikishi statistics for all divisions and save as JSON files')
      // eslint-disable-next-line no-unused-vars
      .action(async (_options) => {
        const globalOptions = program.opts()
        const context = {
          forceRefresh: globalOptions.forceRefresh ?? false,
        }
        await handleStatsCommand(context)
      })
  )
}
