#!/usr/bin/env node
import path from 'node:path'

import { Command } from 'commander'

import { DATA_DIRS, DATA_PATHS } from '@/config/data.js'
import { processAllDivisions } from '@/services/division-processor.js'
import { processDayMatchups } from '@/services/matchup-processor.js'
import { logError, logSuccess } from '@/utils/logger.js'

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

// Process all divisions command
program
  .command('process-all')
  .description('Process all sumo divisions and extract rikishi data')
  .action(async (options) => {
    try {
      console.log('Starting full division processing...')
      await processAllDivisions(options.forceRefresh)
      logSuccess('All divisions processed successfully')
    } catch (error) {
      logError('processing all divisions', error)
      process.exit(1)
    }
  })

// Process specific day command
program
  .command('process-day <day>')
  .description('Process matchup data for a specific tournament day (1-15)')
  .action(async (day, options) => {
    try {
      const dayNum = parseInt(day, 10)
      if (isNaN(dayNum) || dayNum < 1 || dayNum > 15) {
        console.error('Error: Day must be a number between 1 and 15')
        process.exit(1)
      }

      console.log(`Starting day ${dayNum} processing...`)
      await processDayMatchups(dayNum, options.forceRefresh, options.outputDir)
      logSuccess(`Day ${dayNum} processed successfully`)
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

// Parse command line arguments
program.parse()
