import fs from 'node:fs'
import path from 'node:path'

import { DATA_PATHS } from '@/config/data'
import type { DivisionType, MatchupData } from '@/types'
import { logDebug } from '@/utils/logger'

/**
 * CSV column structure - defines the order and names of columns
 */
const CSV_COLUMNS = [
  'rank',
  'record',
  'kanji',
  'hiragana',
  'name',
  'result',
  'technique',
  'result',
  'name',
  'hiragana',
  'kanji',
  'record',
  'rank',
] as const

/**
 * CSV headers for matchup data
 */
const CSV_HEADERS = ['', '', '東', '', 'East', '', '', '', 'West', '', '西', '', '']

/**
 * CSV subheaders for matchup data
 */
const CSV_SUBHEADERS = CSV_COLUMNS.map((col) => col.charAt(0).toUpperCase() + col.slice(1))

/**
 * Extracts player data in the correct column order
 * @param player - Player data (east or west)
 * @returns Array of player values in CSV column order
 */
function extractPlayerData(player: MatchupData['east'] | MatchupData['west']): string[] {
  return [
    player.rank || '',
    player.record || '',
    player.kanji || '',
    player.hiragana || '',
    player.name || '',
    player.result || '',
  ]
}

/**
 * Extracts the winning technique from a matchup
 * @param matchup - Matchup data
 * @returns Winning technique or empty string
 */
function getWinningTechnique(matchup: MatchupData): string {
  const winner = matchup.east.result === 'W' ? matchup.east : matchup.west.result === 'W' ? matchup.west : null
  return winner?.technique || ''
}

/**
 * Builds a single CSV row from matchup data
 * @param matchup - Single matchup data
 * @returns Array of cell values for the row
 */
function buildMatchupRow(matchup: MatchupData): string[] {
  const eastData = extractPlayerData(matchup.east)
  const westData = extractPlayerData(matchup.west)
  const winningTechnique = getWinningTechnique(matchup)

  return [
    ...eastData,
    winningTechnique,
    ...westData.slice().reverse(), // Reverse west data to match column order
  ]
}

/**
 * Converts matchup data to CSV string
 * @param matchups - Array of parsed matchup data
 * @returns CSV content as string
 */
export function matchupDataToCSV(matchups: MatchupData[]): string {
  const rows = [
    CSV_HEADERS.join('\t'),
    CSV_SUBHEADERS.join('\t'),
    ...matchups.map((matchup) => buildMatchupRow(matchup).join('\t')),
  ]

  return rows.join('\n')
}

/**
 * Ensures directory exists, creating it if necessary
 * @param dirPath - Directory path to ensure exists
 */
function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

/**
 * Generates filename for matchup CSV
 * @param day - Tournament day
 * @param divisionId - Division identifier
 * @param divisionName - Human-readable division name
 * @returns Generated filename
 */
function generateMatchupFilename(day: number, divisionId: DivisionType, divisionName: string): string {
  const paddedDay = day.toString().padStart(2, '0')
  return `day_${paddedDay}_${divisionId}_${divisionName.toLowerCase()}.csv`
}

/**
 * Saves matchup data to a CSV file
 * @param matchups - Array of parsed matchup data
 * @param divisionName - Human-readable division name
 * @param divisionId - Division identifier
 * @param day - Tournament day
 * @param outputDir - Custom output directory (optional, defaults to DATA_PATHS.OUTPUT_DIR)
 */
export async function saveMatchupCSV(
  matchups: MatchupData[],
  divisionName: string,
  divisionId: DivisionType,
  day: number,
  outputDir?: string,
): Promise<void> {
  const csvDir = outputDir || DATA_PATHS.OUTPUT_DIR
  ensureDirectoryExists(csvDir)

  const csvContent = matchupDataToCSV(matchups)
  const filename = generateMatchupFilename(day, divisionId, divisionName)
  const filepath = path.join(csvDir, filename)

  fs.writeFileSync(filepath, csvContent, 'utf8')
  logDebug(`Saved matchup CSV: ${filepath}`)
}
