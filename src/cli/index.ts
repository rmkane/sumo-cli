#!/usr/bin/env node
import { Command } from 'commander'

import { processAllDivisions } from '../services/division-processor.js'
import { processDayMatchups } from '../services/matchup-processor.js'
import { logError, logSuccess } from '../utils/logger.js'

const program = new Command()

program
  .name('sumo-cli')
  .description('Professional CLI tool for sumo rikishi data extraction and processing')
  .version('1.0.0')

// Global options
program.option('-f, --force-refresh', 'Force refresh of cached data').option('-v, --verbose', 'Enable verbose logging')

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
      await processDayMatchups(dayNum, options.forceRefresh)
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
  .action(() => {
    console.log('Available data files:')
    console.log('📁 data/json/ - Rikishi data by division')
    console.log('📁 data/csv/ - Matchup data by day and division')
    console.log('📁 data/html/ - Raw HTML data')
    console.log('📁 data/logs/ - Application logs')
  })

// Parse command line arguments
program.parse()
