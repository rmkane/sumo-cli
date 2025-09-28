import fs from 'node:fs'

import { DATA_DIRS, DATA_PATHS } from '@/config/data'
import { DIVISION, DIVISION_TO_NUMBER } from '@/constants'
import { logDebug, logWarning } from '@/core/utils/logger'
import type { Division, Rikishi } from '@/types'

// Cache for rikishi data by division
const rikishiDataCache = new Map<Division, Rikishi[]>()

/**
 * Loads rikishi data for a specific division from JSON file.
 *
 * @param division - Division identifier
 * @returns Array of rikishi data
 */
function loadRikishiData(division: Division): Rikishi[] {
  if (rikishiDataCache.has(division)) {
    const cachedData = rikishiDataCache.get(division)
    if (!cachedData) {
      throw new Error(`Cache inconsistency: division ${division} marked as present but data is undefined`)
    }
    return cachedData
  }

  const divisionNumber = DIVISION_TO_NUMBER[division]
  const filename = `${DATA_PATHS.USER_DATA_DIR}/${DATA_DIRS.JSON}/${divisionNumber}_${division.toLowerCase()}_rikishi.json`

  try {
    const data = JSON.parse(fs.readFileSync(filename, 'utf8'))
    const rikishiData = data.rikishi ?? []
    rikishiDataCache.set(division, rikishiData)
    return rikishiData
  } catch (error) {
    throw new Error(
      `Failed to load rikishi data for division ${divisionNumber} from ${filename}: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

/**
 * Searches for rikishi data by kanji name across all divisions.
 * First searches the specified division, then searches all other divisions.
 *
 * @param kanji - Kanji name to search for
 * @param division - Preferred division to search first
 * @returns Rikishi data or undefined if not found
 */
export function findRikishiAcrossDivisions(kanji: string, division: Division | undefined): Rikishi | undefined {
  if (division === undefined) {
    return undefined
  }

  // First try exact match in the current division
  const rikishi = lookupRikishiByKanji(kanji, division)
  if (rikishi) {
    return rikishi
  }
  logDebug(`Rikishi not found in current division ${division}: ${kanji}`)

  // If not found, try searching in all other divisions
  for (const otherDivision of Object.values(DIVISION)) {
    if (otherDivision === division) continue // Skip current division

    const otherRikishi = lookupRikishiByKanji(kanji, otherDivision as Division)
    if (otherRikishi) {
      logDebug(`Found rikishi in different division: ${kanji} in ${otherDivision}`)
      return otherRikishi
    }
  }

  logWarning(`Rikishi not found in any division: ${kanji}`)
  return undefined
}

/**
 * Looks up rikishi data by kanji name within a specific division.
 *
 * @param kanji - Kanji name to search for
 * @param division - Division to search in
 * @returns Rikishi data or undefined if not found
 */
function lookupRikishiByKanji(kanji: string, division: Division): Rikishi | undefined {
  try {
    const rikishiData = loadRikishiData(division)
    return rikishiData.find((r) => r.shikona.kanji === kanji)
  } catch (error) {
    // Log warning but don't throw - let caller decide how to handle
    logWarning(
      `Failed to load data for division ${division}: ${error instanceof Error ? error.message : String(error)}`,
    )
    return undefined
  }
}
