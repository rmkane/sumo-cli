import fs from 'node:fs'
import path from 'node:path'

import type { MatchupData } from '@/services/matchup'
import type { DivisionType } from '@/types'

/**
 * CSV headers for matchup data
 */
const CSV_HEADERS = ['', '', '東', '', 'East', '', '', '', 'West', '', '西', '', '']

/**
 * CSV subheaders for matchup data
 */
const CSV_SUBHEADERS = [
  'Rank',
  'Record',
  'Kanji',
  'Hiragana',
  'Name',
  'Result',
  'Technique',
  'Result',
  'Name',
  'Hiragana',
  'Kanji',
  'Record',
  'Rank',
]

/**
 * Extracts the winning technique from a matchup
 * @param matchup - Matchup data
 * @returns Winning technique or empty string
 */
function getWinningTechnique(matchup: MatchupData): string {
  if (matchup.east.result === 'W') {
    return matchup.east.technique || ''
  }
  if (matchup.west.result === 'W') {
    return matchup.west.technique || ''
  }
  return ''
}

/**
 * Builds a single CSV row from matchup data
 * @param matchup - Single matchup data
 * @returns Array of cell values for the row
 */
function buildMatchupRow(matchup: MatchupData): string[] {
  const winningTechnique = getWinningTechnique(matchup)

  return [
    matchup.east.rank || '',
    matchup.east.record || '',
    matchup.east.kanji || '',
    matchup.east.hiragana || '',
    matchup.east.name || '',
    matchup.east.result || '',
    winningTechnique,
    matchup.west.result || '',
    matchup.west.name || '',
    matchup.west.hiragana || '',
    matchup.west.kanji || '',
    matchup.west.record || '',
    matchup.west.rank || '',
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
 * Saves matchup data to a CSV file
 * @param matchups - Array of parsed matchup data
 * @param divisionName - Human-readable division name
 * @param divisionId - Division identifier
 * @param day - Tournament day
 */
export async function saveMatchupCSV(
  matchups: MatchupData[],
  divisionName: string,
  divisionId: DivisionType,
  day: number,
): Promise<void> {
  // Create CSV directory if it doesn't exist
  const csvDir = './data/csv'
  if (!fs.existsSync(csvDir)) {
    fs.mkdirSync(csvDir, { recursive: true })
  }

  // Generate CSV content
  const csvContent = matchupDataToCSV(matchups)

  // Save to file
  const paddedDay = day.toString().padStart(2, '0')
  const filename = `day_${paddedDay}_${divisionId}_${divisionName.toLowerCase()}.csv`
  const filepath = path.join(csvDir, filename)

  fs.writeFileSync(filepath, csvContent, 'utf8')
  console.log(`Saved matchup CSV: ${filepath}`)
}
