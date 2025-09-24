import path from 'node:path'

import { Command } from 'commander'

import { DATA_DIRS, DATA_PATHS } from '@/config/data.js'

export function createListCommand(program: Command): Command {
  return program
    .command('list')
    .description('List available data files')
    .action((_options, command) => {
      const parentOptions = command.parent?.opts() || {}
      const outputDir = parentOptions.outputDir || DATA_PATHS.OUTPUT_DIR
      const isCustom = parentOptions.outputDir && parentOptions.outputDir !== DATA_PATHS.OUTPUT_DIR

      console.log('\nData storage locations:')
      console.log(`📁 ${path.resolve(DATA_PATHS.USER_DATA_DIR, DATA_DIRS.JSON)} - Rikishi data by division (cached)`)
      console.log(`📁 ${path.resolve(DATA_PATHS.USER_DATA_DIR, DATA_DIRS.CACHE)} - Raw HTML data (cached)`)
      console.log(`📁 ${path.resolve(DATA_PATHS.USER_DATA_DIR, DATA_DIRS.LOGS)} - Application logs`)

      console.log('\nOutput locations:')
      console.log(`📁 ${path.resolve(outputDir)} - CSV output files (${isCustom ? 'custom' : 'default'})`)
    })
}
