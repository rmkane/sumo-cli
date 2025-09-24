import { Command } from 'commander'

import { formatDivisionJson, formatDivisionList, formatDivisionTable } from '@/cli/formatters.js'
import { listDivisionRikishi } from '@/services/division-service.js'
import { getAvailableDivisions, getDivisionNameFromNumber, getDivisionNumberMappings } from '@/utils/division.js'

export function createDivisionCommand(program: Command): Command {
  return program
    .command('division <division>')
    .description('List all rikishi in a division in English alphabetical order')
    .option('-f, --format <format>', 'Output format: table, list, json', 'table')
    .action(async (division, options) => {
      try {
        // Handle both division names (makuuchi) and numbers (1)
        let divisionName: string
        const divisionNum = parseInt(division, 10)

        if (!isNaN(divisionNum) && divisionNum >= 1 && divisionNum <= 6) {
          // Convert number to division name using existing utility
          const nameFromNumber = getDivisionNameFromNumber(divisionNum)
          if (nameFromNumber) {
            divisionName = nameFromNumber
          } else {
            throw new Error(`Invalid division number: ${divisionNum}`)
          }
        } else {
          // Use the provided division name
          divisionName = division.toLowerCase()
        }

        const rikishiList = await listDivisionRikishi(divisionName, options.format)

        if (rikishiList.length === 0) {
          console.log(`No rikishi found for division: ${division}`)
          console.log(`Available divisions: ${getAvailableDivisions().join(', ')}`)
          console.log(`Or use numbers: ${getDivisionNumberMappings().join(', ')}`)
          return
        }

        console.log(`\n🥋 ${divisionName.toUpperCase()} Division - ${rikishiList.length} Rikishi`)
        console.log('='.repeat(50))

        // Check if any rikishi have rank data
        const hasRankData = rikishiList.some((rikishi) => rikishi.rank)
        if (!hasRankData) {
          console.log('ℹ️  Note: Rank data not available in current dataset')
          console.log('')
        }

        // Format output based on requested format
        switch (options.format) {
          case 'json':
            formatDivisionJson(rikishiList)
            break
          case 'list':
            formatDivisionList(rikishiList)
            break
          case 'table':
          default:
            formatDivisionTable(rikishiList)
            break
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes('Invalid division name')) {
          console.error(`❌ Invalid division: "${division}"`)
          console.log(`\nAvailable divisions:`)
          getAvailableDivisions().forEach((div) => {
            console.log(` - ${div}`)
          })
          console.log(`\nOr use numbers:`)
          getDivisionNumberMappings().forEach((mapping) => {
            const [number, name] = mapping.split('=')
            console.log(` - ${number} = ${name}`)
          })
          console.log(`\nExample: sumo-cli division makuuchi or sumo-cli division 1`)
        } else {
          console.error(`❌ Error listing division rikishi:`, error)
          console.log(`Available divisions: ${getAvailableDivisions().join(', ')}`)
          console.log(`Or use numbers: ${getDivisionNumberMappings().join(', ')}`)
        }
        process.exit(1)
      }
    })
}
