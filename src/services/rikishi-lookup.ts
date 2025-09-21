import fs from 'node:fs'

import type { DivisionType, Rikishi } from '@/types'
import { Division } from '@/constants'
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
    return rikishiDataCache.get(division)!
  }

  const divisionName = getDivisionName(division)
  const filename = `./data/json/${division}_${divisionName}_rikishi.json`

  try {
    const data = JSON.parse(fs.readFileSync(filename, 'utf8'))
    const rikishiData = data.rikishi || []
    rikishiDataCache.set(division, rikishiData)
    return rikishiData
  } catch (error) {
    console.warn(`Error loading rikishi data for division ${division}:`, error)
    return []
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
  // First try exact match in the current division
  const rikishiData = loadRikishiData(division)
  let rikishi = rikishiData.find(r => r.kanji === kanji)

  if (rikishi) {
    return rikishi
  }

  // If not found, try searching in all divisions
  for (const [divisionName, divisionId] of Object.entries(Division)) {
    if (divisionId === division) continue // Skip current division

    const otherDivisionData = loadRikishiData(divisionId as DivisionType)
    rikishi = otherDivisionData.find(r => r.kanji === kanji)

    if (rikishi) {
      return rikishi
    }
  }

  return null
}
