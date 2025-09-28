import path from 'node:path'

import { DATA_DIRS, DATA_PATHS } from '@/config/data'
import { ensureDirectory, saveJSON } from '@/core/utils/file'
import { generateMatchupFilename } from '@/core/utils/filename'
import { logDebug } from '@/core/utils/logger'
import type { Division, DivisionNumber, MatchupData } from '@/types'

/**
 * Saves matchup data to a JSON file in the config directory
 * @param matchups - Array of parsed matchup data
 * @param divisionName - Human-readable division name
 * @param divisionId - Division identifier
 * @param day - Tournament day
 * @param outputDir - Custom output directory (optional, defaults to DATA_PATHS.USER_DATA_DIR/json)
 */
export async function saveMatchupJSON(
  matchups: MatchupData[],
  divisionName: Division,
  divisionId: DivisionNumber,
  day: number,
  outputDir?: string,
): Promise<void> {
  // Use JSON directory in user data directory by default
  const jsonDir = outputDir ?? path.join(DATA_PATHS.USER_DATA_DIR, DATA_DIRS.JSON)
  await ensureDirectory(jsonDir)

  const filename = generateMatchupFilename(day, divisionName, divisionId, 'json')
  const filepath = path.join(jsonDir, filename)

  await saveJSON(filepath, matchups, 'matchups')
  logDebug(`Saved matchup JSON: ${filepath}`)
}
