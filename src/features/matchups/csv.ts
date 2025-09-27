import path from 'node:path'

import { DATA_PATHS } from '@/config/data'
import type { BashoRecord, DivisionType, MatchupData } from '@/types'
import { type CSVHeader, writeCSV } from '@/utils/csv'
import { generateMatchupFilename } from '@/utils/filename'
import { logDebug } from '@/utils/logger'

/**
 * CSV headers configuration for matchup data
 */
const CSV_GROUP_HEADERS: CSVHeader[] = [
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
const CSV_HEADERS: CSVHeader[] = [
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
export function matchupDataToCSVObjects(matchups: MatchupData[]): Record<string, string>[] {
  return matchups.map((matchup) => {
    const winner = matchup.east.result === 'W' ? matchup.east : matchup.west.result === 'W' ? matchup.west : null
    const winningTechnique = winner?.technique || ''

    return {
      eastRank: matchup.east.rank || '',
      eastRecord: formatBashoRecord(matchup.east.record),
      eastKanji: matchup.east.kanji || '',
      eastHiragana: matchup.east.hiragana || '',
      eastName: matchup.east.name || '',
      eastResult: matchup.east.result || '',
      technique: winningTechnique,
      westResult: matchup.west.result || '',
      westName: matchup.west.name || '',
      westHiragana: matchup.west.hiragana || '',
      westKanji: matchup.west.kanji || '',
      westRecord: formatBashoRecord(matchup.west.record),
      westRank: matchup.west.rank || '',
    }
  })
}

function formatBashoRecord(record: BashoRecord): string {
  if (!record) return ''
  const { wins, losses, rest } = record
  return `(${[wins, losses, rest].filter((n) => n != undefined).join('-')})`
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
  const filename = generateMatchupFilename(day, divisionId, divisionName, 'csv')
  const filepath = path.join(csvDir, filename)

  // Convert matchup data to CSV objects
  const csvData = matchupDataToCSVObjects(matchups)

  await writeCSV({
    path: filepath,
    headers: CSV_HEADERS,
    rows: csvData,
    extraHeaderRows: [CSV_GROUP_HEADERS],
  })

  logDebug(`Saved matchup CSV: ${filepath}`)
}
