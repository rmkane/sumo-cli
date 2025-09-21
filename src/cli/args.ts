/**
 * CLI argument parsing utilities
 */

export interface CliArgs {
  day?: number
  forceRefresh: boolean
}

/**
 * Parses command line arguments for CLI functionality.
 */
export function parseArgs(): CliArgs {
  const args = process.argv.slice(2)
  let day: number | undefined
  let forceRefresh = false

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--day' || arg === '-d') {
      const dayValue = args[i + 1]
      if (dayValue && !isNaN(Number(dayValue))) {
        day = Number(dayValue)
        i++ // Skip the next argument since we consumed it
      } else {
        console.error('Error: --day/-d requires a numeric value')
        process.exit(1)
      }
    } else if (arg === '--refresh') {
      forceRefresh = true
    } else if (arg === '--help' || arg === '-h') {
      showHelp()
      process.exit(0)
    }
  }

  return { day, forceRefresh }
}

/**
 * Shows help message and usage information.
 */
function showHelp(): void {
  console.log(`
Usage: npm run dev [options]

Options:
  --day, -d <number>    Specify the day of the tournament (1-15)
  --refresh             Force refresh of cached data
  --help, -h            Show this help message

Examples:
  npm run dev -- --day 1          # Process day 1 matchups
  npm run dev -- --day 5 --refresh # Process day 5 with fresh data
  npm run dev                      # Process all divisions (original behavior)
      `)
}
