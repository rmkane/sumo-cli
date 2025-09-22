import fs from 'node:fs'

import { DATA_DIRS, DATA_PATHS } from '@/config/data'
import type { DivisionType, Rikishi } from '@/types'
import { getDivisionName, getDivisionType } from '@/utils/division'
import { logDebug, logError } from '@/utils/logger'
import { sortRikishi } from '@/utils/sorting'

/**
 * Loads rikishi data for a specific division from JSON file.
 *
 * @param division - Division identifier
 * @returns Array of rikishi data
 */
function loadRikishiData(division: DivisionType): Rikishi[] {
  const divisionName = getDivisionName(division)
  const filename = `${DATA_PATHS.USER_DATA_DIR}/${DATA_DIRS.JSON}/${division}_${divisionName}_rikishi.json`

  try {
    const data = JSON.parse(fs.readFileSync(filename, 'utf8'))
    const rikishiData = data.rikishi || []
    logDebug(`Loaded ${rikishiData.length} rikishi from ${filename}`)
    return rikishiData
  } catch (error) {
    throw new Error(
      `Failed to load rikishi data for division ${division} from ${filename}: ${error instanceof Error ? error.message : String(error)}`,
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
    const division = getDivisionType(divisionName.toLowerCase())
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
