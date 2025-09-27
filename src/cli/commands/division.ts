import { Command } from 'commander'

import { handleDivisionCommand } from '@/features/division/command-handler'

export function createDivisionCommand(program: Command): Command {
  return program
    .command('division <division>')
    .description('List all rikishi in a division in English alphabetical order')
    .option('-f, --format <format>', 'Output format: table, list, json', 'table')
    .action(async (division, options) => {
      const context = {
        division,
        format: options.format ?? 'table',
      }
      await handleDivisionCommand(context)
    })
}
