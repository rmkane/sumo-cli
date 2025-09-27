import fs from 'node:fs'

import { DATA_DIRS, DATA_PATHS } from '@/config/data'
import { Division } from '@/constants'
import { getDivisionName } from '@/core/utils/division'
import { logDebug, logWarning } from '@/core/utils/logger'
import type { DivisionType, Rikishi } from '@/types'

// Cache for rikishi data by division
const rikishiDataCache = new Map<DivisionType, Rikishi[]>()

/**
 * Loads rikishi data for a specific division from JSON file.
 *
 * @param division - Division identifier
 * @returns Array of rikishi data
 */
function loadRikishiData(division: DivisionType): Rikishi[] {
  if (rikishiDataCache.has(division)) {
    const cachedData = rikishiDataCache.get(division)
    if (!cachedData) {
      throw new Error(`Cache inconsistency: division ${division} marked as present but data is undefined`)
    }
    return cachedData
  }

  const divisionName = getDivisionName(division)
  const filename = `${DATA_PATHS.USER_DATA_DIR}/${DATA_DIRS.JSON}/${division}_${divisionName}_rikishi.json`

  try {
    const data = JSON.parse(fs.readFileSync(filename, 'utf8'))
    const rikishiData = data.rikishi ?? []
    rikishiDataCache.set(division, rikishiData)
    return rikishiData
  } catch (error) {
    throw new Error(
      `Failed to load rikishi data for division ${division} from ${filename}: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

/**
 * Searches for rikishi data by kanji name across all divisions.
 * First searches the specified division, then searches all other divisions.
 *
 * @param kanji - Kanji name to search for
 * @param division - Preferred division to search first
 * @returns Rikishi data or null if not found
 */
export function findRikishiAcrossDivisions(kanji: string, division: DivisionType): Rikishi | null {
  // First try exact match in the current division
  const rikishi = lookupRikishiByKanji(kanji, division)
  if (rikishi) {
    return rikishi
  }
  logDebug(`Rikishi not found in current division ${division}: ${kanji}`)

  // If not found, try searching in all other divisions
  for (const [, divisionId] of Object.entries(Division)) {
    if (divisionId === division) continue // Skip current division

    const otherRikishi = lookupRikishiByKanji(kanji, divisionId as DivisionType)
    if (otherRikishi) {
      logDebug(`Found rikishi in different division: ${kanji} in ${divisionId}`)
      return otherRikishi
    }
  }

  logWarning(`Rikishi not found in any division: ${kanji}`)
  return null
}

/**
 * Looks up rikishi data by kanji name within a specific division.
 *
 * @param kanji - Kanji name to search for
 * @param division - Division to search in
 * @returns Rikishi data or null if not found
 */
function lookupRikishiByKanji(kanji: string, division: DivisionType): Rikishi | null {
  try {
    const rikishiData = loadRikishiData(division)
    return rikishiData.find((r) => r.name.kanji === kanji) ?? null
  } catch (error) {
    // Log warning but don't throw - let caller decide how to handle
    logWarning(
      `Failed to load data for division ${division}: ${error instanceof Error ? error.message : String(error)}`,
    )
    return null
  }
}
