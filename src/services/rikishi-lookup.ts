import fs from 'node:fs'

import { Division } from '@/constants'
import type { DivisionType, Rikishi } from '@/types'
import { getDivisionName } from '@/utils/division'

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
  const filename = `./data/json/${division}_${divisionName}_rikishi.json`

  try {
    const data = JSON.parse(fs.readFileSync(filename, 'utf8'))
    const rikishiData = data.rikishi || []
    rikishiDataCache.set(division, rikishiData)
    return rikishiData
  } catch (error) {
    throw new Error(
      `Failed to load rikishi data for division ${division} from ${filename}: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

/**
 * Looks up rikishi data by kanji name within a division.
 *
 * @param kanji - Kanji name to search for
 * @param division - Division to search in
 * @returns Rikishi data or null if not found
 */
export function lookupRikishiByKanji(kanji: string, division: DivisionType): Rikishi | null {
  try {
    // First try exact match in the current division
    const rikishiData = loadRikishiData(division)
    let rikishi = rikishiData.find((r) => r.kanji === kanji)

    if (rikishi) {
      return rikishi
    }

    // If not found, try searching in all divisions
    for (const [, divisionId] of Object.entries(Division)) {
      if (divisionId === division) continue // Skip current division

      try {
        const otherDivisionData = loadRikishiData(divisionId as DivisionType)
        rikishi = otherDivisionData.find((r) => r.kanji === kanji)

        if (rikishi) {
          return rikishi
        }
      } catch (error) {
        // Log warning but continue searching other divisions
        console.warn(
          `Failed to load data for division ${divisionId}:`,
          error instanceof Error ? error.message : String(error),
        )
      }
    }

    return null
  } catch (error) {
    // If the primary division fails, throw the error
    throw new Error(
      `Failed to lookup rikishi '${kanji}' in division ${division}: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}
