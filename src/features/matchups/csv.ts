import path from 'node:path'

import { DATA_PATHS } from '@/config/data'
import { MatchResult } from '@/constants'
import type { DivisionType, MatchupData, RikishiRank, RikishiRecord } from '@/types'
import { type CSVHeader, writeCSV } from '@/utils/csv'
import { generateMatchupFilename } from '@/utils/filename'
import { logDebug } from '@/utils/logger'

/**
 * CSV headers configuration for matchup data
 */
const CSV_GROUP_HEADERS: CSVHeader[] = [
  { id: 'eastHiragana', title: '' },
  { id: 'eastKanji', title: '東' },
  { id: 'eastRank', title: '' },
  { id: 'eastRecord', title: '' },
  { id: 'eastName', title: 'East' },
  { id: 'eastResult', title: '' },
  { id: 'technique', title: '' },
  { id: 'westResult', title: '' },
  { id: 'westName', title: 'West' },
  { id: 'westRecord', title: '' },
  { id: 'westRank', title: '' },
  { id: 'westKanji', title: '西' },
  { id: 'westHiragana', title: '' },
]

/**
 * CSV subheaders for matchup data
 */
const CSV_HEADERS: CSVHeader[] = [
  { id: 'eastHiragana', title: 'Hiragana' },
  { id: 'eastKanji', title: 'Kanji' },
  { id: 'eastRank', title: 'Rank' },
  { id: 'eastRecord', title: 'Record' },
  { id: 'eastName', title: 'Name' },
  { id: 'eastResult', title: 'Result' },
  { id: 'technique', title: 'Technique' },
  { id: 'westResult', title: 'Result' },
  { id: 'westName', title: 'Name' },
  { id: 'westRecord', title: 'Record' },
  { id: 'westRank', title: 'Rank' },
  { id: 'westKanji', title: 'Kanji' },
  { id: 'westHiragana', title: 'Hiragana' },
]

/**
 * Converts matchup data to CSV-compatible objects
 * @param matchups - Array of parsed matchup data
 * @returns Array of objects suitable for CSV writing
 */
export function matchupDataToCSVObjects(matchups: MatchupData[]): Record<string, string>[] {
  return matchups.map((matchup) => {
    const winner =
      matchup.east.result === MatchResult.WIN
        ? matchup.east
        : matchup.west.result === MatchResult.WIN
          ? matchup.west
          : null
    const winningTechnique = winner?.technique || ''

    return {
      eastHiragana: matchup.east.name.hiragana || '',
      eastKanji: matchup.east.name.kanji || '',
      eastRank: formatRank(matchup.east.rank),
      eastRecord: formatBashoRecord(matchup.east.record),
      eastName: matchup.east.name.english || '',
      eastResult: matchup.east.result || '',
      technique: winningTechnique,
      westResult: matchup.west.result || '',
      westName: matchup.west.name.english || '',
      westRecord: formatBashoRecord(matchup.west.record),
      westRank: formatRank(matchup.west.rank),
      westKanji: matchup.west.name.kanji || '',
      westHiragana: matchup.west.name.hiragana || '',
    }
  })
}

function formatBashoRecord(record: RikishiRecord): string {
  if (!record) return ''
  const { wins, losses, rest } = record
  return `(${[wins, losses, rest].filter((n) => n != undefined).join('-')})`
}

function formatRank(rank: RikishiRank): string {
  if (!rank || !rank.division) return ''

  if (rank.position) {
    return `${rank.division} #${rank.position}`
  } else {
    return rank.division
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
