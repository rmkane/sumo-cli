import path from 'node:path'

import { DATA_PATHS } from '@/config/data'
import { JapaneseTerms, MatchResult } from '@/constants'
import type { CSVHeader } from '@/core/utils/csv'
import { writeCSV } from '@/core/utils/csv'
import { generateMatchupFilename } from '@/core/utils/filename'
import { logDebug } from '@/core/utils/logger'
import type { BanzukeSlot, Division, DivisionNumber, MatchupData, RikishiRecord } from '@/types'

/**
 * CSV headers configuration for matchup data
 */
const CSV_GROUP_HEADERS: CSVHeader[] = [
  { id: 'eastRank', title: '' },
  { id: 'eastRecord', title: '' },
  { id: 'eastKanji', title: JapaneseTerms.EAST_JP },
  { id: 'eastHiragana', title: '' },
  { id: 'eastName', title: 'East' },
  { id: 'eastResult', title: '' },
  { id: 'technique', title: '' },
  { id: 'westResult', title: '' },
  { id: 'westName', title: 'West' },
  { id: 'westHiragana', title: '' },
  { id: 'westKanji', title: JapaneseTerms.WEST_JP },
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
    const winner =
      matchup.east.result === MatchResult.WIN
        ? matchup.east
        : matchup.west.result === MatchResult.WIN
          ? matchup.west
          : null
    const winningTechnique = winner?.technique ?? ''

    return {
      eastRank: formatRank(matchup.east.current),
      eastRecord: formatBashoRecord(matchup.east.record),
      eastKanji: matchup.east.shikona.kanji || '',
      eastHiragana: matchup.east.shikona.hiragana || '',
      eastName: matchup.east.shikona.english || '',
      eastResult: matchup.east.result || '',
      technique: winningTechnique,
      westResult: matchup.west.result || '',
      westName: matchup.west.shikona.english || '',
      westHiragana: matchup.west.shikona.hiragana || '',
      westKanji: matchup.west.shikona.kanji || '',
      westRecord: formatBashoRecord(matchup.west.record),
      westRank: formatRank(matchup.west.current),
    }
  })
}

function formatBashoRecord(record: RikishiRecord): string {
  if (record === undefined) return ''
  const { wins, losses, rest } = record
  return `(${[wins, losses, rest].filter((n) => n != undefined).join('-')})`
}

function formatRank(current: BanzukeSlot): string {
  if (!current?.division) return ''

  const { division, rank } = current

  if (typeof rank === 'string') {
    // Sanyaku rank
    return rank
  }

  if (rank?.kind === 'Maegashira' || rank?.kind === 'Numbered') {
    return `${division} #${rank?.number}`
  }

  return division
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
  divisionName: Division,
  divisionId: DivisionNumber,
  day: number,
  outputDir?: string,
): Promise<void> {
  const csvDir = outputDir ?? DATA_PATHS.OUTPUT_DIR
  const filename = generateMatchupFilename(day, divisionName, divisionId, 'csv')
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
