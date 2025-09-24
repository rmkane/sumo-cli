import fs from 'node:fs'
import path from 'node:path'

import { createObjectCsvWriter } from 'csv-writer'

import { DATA_PATHS } from '@/config/data'
import type { DivisionType, MatchupData } from '@/types'
import { generateMatchupFilename } from '@/utils/filename'
import { logDebug } from '@/utils/logger'

/**
 * CSV headers configuration for matchup data
 */
const CSV_HEADERS = [
  { id: 'eastRank', title: '' },
  { id: 'eastRecord', title: '' },
  { id: 'eastKanji', title: '東' },
  { id: 'eastHiragana', title: '' },
  { id: 'eastName', title: 'East' },
  { id: 'eastResult', title: '' },
  { id: 'technique', title: '' },
  { id: 'westResult', title: '' },
  { id: 'westName', title: 'West' },
  { id: 'westHiragana', title: '' },
  { id: 'westKanji', title: '西' },
  { id: 'westRecord', title: '' },
  { id: 'westRank', title: '' },
]

/**
 * CSV subheaders for matchup data
 */
const CSV_SUBHEADERS = [
  { id: 'eastRank', title: 'Rank' },
  { id: 'eastRecord', title: 'Record' },
  { id: 'eastKanji', title: 'Kanji' },
  { id: 'eastHiragana', title: 'Hiragana' },
  { id: 'eastName', title: 'Name' },
  { id: 'eastResult', title: 'Result' },
  { id: 'technique', title: 'Technique' },
  { id: 'westResult', title: 'Result' },
  { id: 'westName', title: 'Name' },
  { id: 'westHiragana', title: 'Hiragana' },
  { id: 'westKanji', title: 'Kanji' },
  { id: 'westRecord', title: 'Record' },
  { id: 'westRank', title: 'Rank' },
]

/**
 * Converts matchup data to CSV-compatible objects
 * @param matchups - Array of parsed matchup data
 * @returns Array of objects suitable for CSV writing
 */
function matchupDataToCSVObjects(matchups: MatchupData[]): Record<string, string>[] {
  return matchups.map((matchup) => {
    const winner = matchup.east.result === 'W' ? matchup.east : matchup.west.result === 'W' ? matchup.west : null
    const winningTechnique = winner?.technique || ''

    return {
      eastRank: matchup.east.rank || '',
      eastRecord: matchup.east.record || '',
      eastKanji: matchup.east.kanji || '',
      eastHiragana: matchup.east.hiragana || '',
      eastName: matchup.east.name || '',
      eastResult: matchup.east.result || '',
      technique: winningTechnique,
      westResult: matchup.west.result || '',
      westName: matchup.west.name || '',
      westHiragana: matchup.west.hiragana || '',
      westKanji: matchup.west.kanji || '',
      westRecord: matchup.west.record || '',
      westRank: matchup.west.rank || '',
    }
  })
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
 * Saves matchup data to a CSV file using csv-writer
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

  const filename = generateMatchupFilename(day, divisionId, divisionName, 'csv')
  const filepath = path.join(csvDir, filename)

  // Create CSV writer with custom headers
  const csvWriter = createObjectCsvWriter({
    path: filepath,
    header: CSV_HEADERS,
  })

  // Convert matchup data to CSV objects
  const csvData = matchupDataToCSVObjects(matchups)

  // Write headers and subheaders manually for custom formatting
  const headerRow = CSV_HEADERS.map((h) => h.title).join('\t')
  const subheaderRow = CSV_SUBHEADERS.map((h) => h.title).join('\t')

  // Write custom headers first
  fs.writeFileSync(filepath, `${headerRow}\n${subheaderRow}\n`, 'utf8')

  // Append data rows using csv-writer
  await csvWriter.writeRecords(csvData)

  logDebug(`Saved matchup CSV: ${filepath}`)
}

/**
 * Legacy function for backward compatibility - converts matchup data to CSV string
 * @param matchups - Array of parsed matchup data
 * @returns CSV content as string
 */
export function matchupDataToCSV(matchups: MatchupData[]): string {
  const csvData = matchupDataToCSVObjects(matchups)

  const headerRow = CSV_HEADERS.map((h) => h.title).join('\t')
  const subheaderRow = CSV_SUBHEADERS.map((h) => h.title).join('\t')
  const dataRows = csvData.map((row) => Object.values(row).join('\t'))

  return [headerRow, subheaderRow, ...dataRows].join('\n')
}
