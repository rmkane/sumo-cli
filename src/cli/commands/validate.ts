import { Command } from 'commander'

import { handleValidateCommand } from '@/features/validate/command-handler'

export function createValidateCommand(program: Command): Command {
  return (
    program
      .command('validate <day>')
      .description('Validate HTML metadata for a specific tournament day')
      // eslint-disable-next-line no-unused-vars
      .action(async (day, _options) => {
        const context = {
          day,
        }
        await handleValidateCommand(context)
      })
  )
}
