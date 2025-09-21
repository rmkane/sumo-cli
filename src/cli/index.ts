#!/usr/bin/env node
import path from 'node:path'
import readline from 'node:readline'

import { Command } from 'commander'

import { DATA_DIRS, DATA_PATHS } from '@/config/data.js'
import { processAllDivisions } from '@/services/division-processor.js'
import { processDayMatchups } from '@/services/matchup-processor.js'
import { logDebug, logError } from '@/utils/logger.js'

/**
 * Launches interactive REPL mode
 */
function launchInteractiveMode(program: Command): void {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'sumo-cli> ',
  })

  console.log('🎌 Sumo CLI Interactive Mode')
  console.log('Type "help" for available commands, "exit" to quit\n')

  rl.prompt()

  rl.on('line', async (input) => {
    const line = input.trim()

    if (line === 'exit' || line === 'quit') {
      console.log('Goodbye! 👋')
      rl.close()
      return
    }

    if (line === 'help') {
      showInteractiveHelp()
      rl.prompt()
      return
    }

    if (line === 'clear') {
      console.clear()
      rl.prompt()
      return
    }

    if (line === '') {
      rl.prompt()
      return
    }

    try {
      // Parse the input as if it were command line arguments
      // Handle options with values properly (e.g., --output-dir .foo)
      const args = line.split(' ')
      const parsedArgs = []

      for (let i = 0; i < args.length; i++) {
        const arg = args[i]
        if (arg.startsWith('--') && i + 1 < args.length && !args[i + 1].startsWith('-')) {
          // This is an option with a value, combine them
          parsedArgs.push(`${arg}=${args[i + 1]}`)
          i++ // Skip the next argument since we combined it
        } else {
          parsedArgs.push(arg)
        }
      }

      await program.parseAsync(['node', 'sumo-cli', ...parsedArgs])
    } catch (error) {
      console.error(`Error: ${error instanceof Error ? error.message : String(error)}`)
    }

    rl.prompt()
  })

  rl.on('close', () => {
    process.exit(0)
  })
}

/**
 * Shows help for interactive mode
 */
function showInteractiveHelp(): void {
  console.log('\n📖 Interactive Commands:')
  console.log('  help                    Show this help message')
  console.log('  clear                   Clear the screen')
  console.log('  exit, quit              Exit interactive mode')
  console.log('  list                    List data storage locations')
  console.log('  process-all             Process all divisions')
  console.log('  process-day <day>       Process specific tournament day (1-15)')
  console.log('\n📋 Options (use with commands):')
  console.log('  --force-refresh         Force refresh of cached data')
  console.log('  --verbose               Enable verbose logging')
  console.log('  --output-dir <path>     Custom output directory')
  console.log('\n💡 Examples:')
  console.log('  process-all --force-refresh')
  console.log('  process-day 1 --verbose')
  console.log('  process-day 8 --output-dir ./my-data')
  console.log('')
}

const program = new Command()

program
  .name('sumo-cli')
  .description('Professional CLI tool for sumo rikishi data extraction and processing')
  .version('1.0.0')

// Global options
program
  .option('-f, --force-refresh', 'Force refresh of cached data')
  .option('-v, --verbose', 'Enable verbose logging')
  .option('-o, --output-dir <path>', 'Custom output directory for CSV files', './output')
  .option('-i, --interactive', 'Launch interactive REPL mode')

// Process all divisions command
program
  .command('process-all')
  .description('Process all sumo divisions and extract rikishi data')
  // eslint-disable-next-line no-unused-vars
  .action(async (_options) => {
    try {
      // Get global options from the program
      const globalOptions = program.opts()

      logDebug('Starting full division processing...')
      const result = await processAllDivisions(globalOptions.forceRefresh)
      console.log(
        `All divisions processed successfully - ${result.filesCreated} JSON files created in ${result.dataDir}`,
      )
    } catch (error) {
      logError('processing all divisions', error)
      process.exit(1)
    }
  })

// Process specific day command
program
  .command('process-day <day>')
  .description('Process matchup data for a specific tournament day (1-15)')
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
      console.log(
        `Day ${dayNum} processed successfully - ${result.filesCreated} CSV files created in ${result.outputDir}`,
      )
    } catch (error) {
      logError(`processing day ${day}`, error)
      process.exit(1)
    }
  })

// List available data command
program
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

// Check for interactive mode before parsing
const args = process.argv.slice(2)
if (args.includes('-i') || args.includes('--interactive')) {
  launchInteractiveMode(program)
} else {
  // Parse command line arguments
  program.parse()
}
