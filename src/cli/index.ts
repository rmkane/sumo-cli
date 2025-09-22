#!/usr/bin/env node
import path from 'node:path'

import { Command } from 'commander'

import { launchInteractiveMode } from '@/cli/repl.js'
import { DATA_DIRS, DATA_PATHS } from '@/config/data.js'
import { processAllDivisions } from '@/services/division-processor.js'
import { processDayMatchups } from '@/services/matchup-processor.js'
import { getCurrentTournament } from '@/services/tournament'
import { logDebug, logError } from '@/utils/logger.js'

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

      if (result.filesCreated === 0) {
        console.log(`❌ Day ${dayNum} data not available - tournament may not have reached this day yet`)
        console.log(`   Use 'sumo-cli validate ${dayNum}' to check HTML metadata for details`)
      } else {
        console.log(
          `✅ Day ${dayNum} processed successfully - ${result.filesCreated} CSV files created in ${result.outputDir}`,
        )
      }
    } catch (error) {
      logError(`processing day ${day}`, error)
      process.exit(1)
    }
  })

// Tournament info command
program
  .command('tournament [date]')
  .description('Get current or next tournament information for a given date (YYYY-MM-DD)')
  // eslint-disable-next-line no-unused-vars
  .action(async (date, _options) => {
    try {
      let checkDate: Date | undefined
      if (date) {
        const [year, month, day] = date.split('-').map(Number)
        if (isNaN(year) || isNaN(month) || isNaN(day)) {
          console.error('Error: Date must be in YYYY-MM-DD format')
          process.exit(1)
        }
        checkDate = new Date(year, month - 1, day)
      }

      const tournament = getCurrentTournament(checkDate)

      console.log(`\n🏆 Tournament Information:`)
      console.log(`📅 Tournament: ${tournament.tournamentMonth} ${tournament.startDate.getFullYear()}`)
      console.log(`🏟️ Venue: ${tournament.venue.name} (${tournament.venue.location})`)
      console.log(
        `📆 Start Date: ${tournament.startDate.toLocaleDateString('en-US', { timeZone: 'Asia/Tokyo' })} (JST)`,
      )
      console.log(`📆 End Date: ${tournament.endDate.toLocaleDateString('en-US', { timeZone: 'Asia/Tokyo' })} (JST)`)
      console.log(`🎯 Status: ${tournament.isActive ? 'Active' : 'Upcoming'}`)

      if (tournament.dayNumber) {
        console.log(`📊 Current Day: ${tournament.dayNumber}/15`)
      }
    } catch (error) {
      console.error(`Error getting tournament info:`, error)
      process.exit(1)
    }
  })

// Validate HTML data command
program
  .command('validate <day>')
  .description('Validate HTML metadata for a specific tournament day')
  // eslint-disable-next-line no-unused-vars
  .action(async (day, _options) => {
    try {
      const dayNum = parseInt(day, 10)
      if (isNaN(dayNum) || dayNum < 1 || dayNum > 15) {
        console.error('Error: Day must be a number between 1 and 15')
        process.exit(1)
      }

      console.log(`Validating HTML metadata for day ${dayNum}...`)

      // Import the validation function
      const { validateHTMLDate } = await import('@/services/matchup')
      const { readFileSync } = await import('fs')
      const { join } = await import('path')

      // Check if HTML file exists (HTML files are stored in 'html' directory, not 'cache')
      const htmlPath = join(
        DATA_PATHS.USER_DATA_DIR,
        'html',
        `day_${dayNum.toString().padStart(2, '0')}_1_makuuchi.html`,
      )

      try {
        const html = readFileSync(htmlPath, 'utf-8')
        const validation = validateHTMLDate(html, dayNum)

        console.log(`\nValidation Results for Day ${dayNum}:`)
        console.log(`✅ Valid: ${validation.isValid ? 'Yes' : 'No'}`)
        console.log(`📅 Actual Day: ${validation.actualDay || 'Unknown'}`)
        console.log(`📆 Actual Date: ${validation.actualDate || 'Unknown'}`)

        if (validation.warnings.length > 0) {
          console.log(`\n⚠️  Warnings:`)
          validation.warnings.forEach((warning) => console.log(`   - ${warning}`))
        } else {
          console.log(`\n✅ No validation issues found`)
        }
      } catch (error) {
        console.error(`Error reading HTML file: ${error instanceof Error ? error.message : String(error)}`)
        console.log(`Expected file: ${htmlPath}`)
        process.exit(1)
      }
    } catch (error) {
      console.error(`Error validating day ${day}:`, error)
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
