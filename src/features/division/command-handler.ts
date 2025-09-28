import { formatDivisionJson, formatDivisionList, formatDivisionTable } from '@/cli/formatters'
import { listDivisionRikishi } from '@/core/services/division-service'
import { getAvailableDivisions, getDivisionNameFromNumber, getDivisionNumberMappings } from '@/core/utils/division'

export interface DivisionCommandContext {
  division: string
  format: string
}

/**
 * Handles division listing business logic and console output
 */
export async function handleDivisionCommand(context: DivisionCommandContext): Promise<void> {
  try {
    // Handle both division names (makuuchi) and numbers (1)
    let divisionName: string
    const divisionNum = parseInt(context.division, 10)

    if (!isNaN(divisionNum) && divisionNum >= 1 && divisionNum <= 6) {
      // Convert number to division name using existing utility
      const nameFromNumber = getDivisionNameFromNumber(divisionNum)
      if (nameFromNumber !== undefined && nameFromNumber !== '') {
        divisionName = nameFromNumber
      } else {
        throw new Error(`Invalid division number: ${divisionNum}`)
      }
    } else {
      // Use the provided division name
      divisionName = context.division.toLowerCase()
    }

    const rikishiList = await listDivisionRikishi(divisionName, context.format)

    if (rikishiList.length === 0) {
      console.log(`No rikishi found for division: ${context.division}`)
      console.log(`Available divisions: ${getAvailableDivisions().join(', ')}`)
      console.log(`Or use numbers: ${getDivisionNumberMappings().join(', ')}`)
      return
    }

    console.log(`\n🥋 ${divisionName.toUpperCase()} Division - ${rikishiList.length} Rikishi`)
    console.log('='.repeat(50))

    // Format output based on requested format
    switch (context.format) {
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
      console.error(`❌ Invalid division: "${context.division}"`)
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
}
