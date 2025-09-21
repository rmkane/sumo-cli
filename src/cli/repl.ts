import readline from 'node:readline'

import type { Command } from 'commander'

/**
 * Shows help information for interactive mode
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

/**
 * Launches interactive REPL mode
 */
export function launchInteractiveMode(program: Command): void {
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
