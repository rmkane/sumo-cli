#!/usr/bin/env node
import { Command } from 'commander'

import { createDivisionCommand } from '@/cli/commands/division.js'
import { createDownloadMatchupsCommand } from '@/cli/commands/download-matchups.js'
import { createDownloadStatsCommand } from '@/cli/commands/download-stats.js'
import { createListCommand } from '@/cli/commands/list.js'
import { createTournamentCommand } from '@/cli/commands/tournament.js'
import { createValidateCommand } from '@/cli/commands/validate.js'
import { launchInteractiveMode } from '@/cli/repl.js'

import packageJson from '../../package.json'

const program = new Command()

program
  .name('sumo-cli')
  .description('Professional CLI tool for sumo rikishi data extraction and processing')
  .version(packageJson.version)

// Global options
program
  .option('-f, --force-refresh', 'Force refresh of cached data')
  .option('-v, --verbose', 'Enable verbose logging')
  .option('-o, --output-dir <path>', 'Custom output directory for CSV files', './output')
  .option('-i, --interactive', 'Launch interactive REPL mode')

// Register all commands
createDownloadStatsCommand(program)
createDownloadMatchupsCommand(program)
createTournamentCommand(program)
createDivisionCommand(program)
createValidateCommand(program)
createListCommand(program)

// Check for interactive mode before parsing
const args = process.argv.slice(2)
if (args.includes('-i') || args.includes('--interactive')) {
  launchInteractiveMode(program)
} else if (args.length === 0) {
  // Show help when no arguments provided
  program.help()
} else {
  // Parse command line arguments
  program.parse()
}
