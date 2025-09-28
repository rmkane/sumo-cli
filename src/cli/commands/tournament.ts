import { Command } from 'commander'

import { handleTournamentCommand } from '@/features/tournament/command-handler'

export function createTournamentCommand(program: Command): Command {
  return (
    program
      .command('tournament [date]')
      .description('Get current or next tournament information for a given date (YYYY-MM-DD)')
      // eslint-disable-next-line no-unused-vars
      .action(async (date, _options) => {
        const context = {
          date,
        }
        await handleTournamentCommand(context)
      })
  )
}
