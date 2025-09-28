import fs from 'node:fs'

import { DATA_DIRS, DATA_PATHS } from '@/config/data'
import { DIVISION_TO_NUMBER } from '@/constants'
import { getDivision, getDivisionName } from '@/core/utils/division'
import { logDebug, logError } from '@/core/utils/logger'
import { sortRikishi } from '@/core/utils/sorting'
import type { Division, Rikishi } from '@/types'

/**
 * Loads rikishi data for a specific division from JSON file.
 *
 * @param division - Division identifier
 * @returns Array of rikishi data
 */
function loadRikishiData(division: Division): Rikishi[] {
  const divisionName = getDivisionName(division)
  const divisionNumber = DIVISION_TO_NUMBER[division]
  const filename = `${DATA_PATHS.USER_DATA_DIR}/${DATA_DIRS.JSON}/${divisionNumber}_${divisionName}_rikishi.json`

  try {
    const data = JSON.parse(fs.readFileSync(filename, 'utf8'))
    const rikishiData = data.rikishi ?? []
    logDebug(`Loaded ${rikishiData.length} rikishi from ${filename}`)
    return rikishiData
  } catch (error) {
    throw new Error(
      `Failed to load rikishi data for division ${divisionNumber} from ${filename}: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

/**
 * Lists all rikishi in a division sorted by English name alphabetically
 *
 * @param divisionName - English division name (e.g., 'makuuchi', 'juryo')
 * @param format - Output format ('table', 'list', 'json')
 * @returns Array of rikishi data sorted by English name
 */
// eslint-disable-next-line no-unused-vars
export async function listDivisionRikishi(divisionName: string, _format: string = 'table'): Promise<Rikishi[]> {
  try {
    const division = getDivision(divisionName.toLowerCase())
    const rikishiData = loadRikishiData(division)

    // Sort by division hierarchy, then rank, then English name alphabetically
    const sortedRikishi = rikishiData.sort(sortRikishi)

    logDebug(`Sorted ${sortedRikishi.length} rikishi by division, rank, then name for division ${divisionName}`)
    return sortedRikishi
  } catch (error) {
    logError('listing division rikishi', error)
    throw error
  }
}
