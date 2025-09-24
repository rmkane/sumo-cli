import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { Command } from 'commander'

import { DATA_PATHS } from '@/config/data.js'
import { validateHTMLDate } from '@/services/matchup'
import { generateMatchupFilename } from '@/utils/filename'

export function createValidateCommand(program: Command): Command {
  return (
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

          // Check if HTML file exists (HTML files are stored in 'html' directory, not 'cache')
          const htmlPath = join(
            DATA_PATHS.USER_DATA_DIR,
            'html',
            generateMatchupFilename(dayNum, 1, 'makuuchi', 'html'),
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
  )
}
