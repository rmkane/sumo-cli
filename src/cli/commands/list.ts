import { Command } from 'commander'

import { handleListCommand } from '@/features/list/command-handler'

export function createListCommand(program: Command): Command {
  return program
    .command('list')
    .description('List available data files')
    .action((_options, command) => {
      const parentOptions = command.parent?.opts() ?? {}
      const context = {
        outputDir: parentOptions.outputDir,
      }
      handleListCommand(context)
    })
}
