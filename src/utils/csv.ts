import fs from 'node:fs'
import path from 'node:path'

import type { MatchupData } from '@/services/matchup'
import type { DivisionType } from '@/types'

/**
 * Saves matchup data to a CSV file.
 *
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
  const csvContent = generateMatchupCSV(matchups)

  // Save to file
  const paddedDay = day.toString().padStart(2, '0')
  const filename = `day_${paddedDay}_${divisionId}_${divisionName.toLowerCase()}.csv`
  const filepath = path.join(csvDir, filename)

  fs.writeFileSync(filepath, csvContent, 'utf8')
  console.log(`Saved matchup CSV: ${filepath}`)
}

/**
 * Generates CSV content from matchup data.
 *
 * @param matchups - Array of parsed matchup data
 * @returns CSV content as string
 */
function generateMatchupCSV(matchups: MatchupData[]): string {
  const headers = ['', '', '東', '', 'East', '', '', 'West', '', '西', '', '']
  const subHeaders = [
    'Rank',
    'Record',
    'Kanji',
    'Hiragana',
    'Name',
    'Result',
    'Result',
    'Name',
    'Hiragana',
    'Kanji',
    'Record',
    'Rank',
  ]

  const rows = [
    headers.join('\t'),
    subHeaders.join('\t'),
    ...matchups.map((matchup) =>
      [
        matchup.east.rank || '',
        matchup.east.record || '',
        matchup.east.kanji || '',
        matchup.east.hiragana || '',
        matchup.east.name || '',
        matchup.east.result || '',
        matchup.west.result || '',
        matchup.west.name || '',
        matchup.west.hiragana || '',
        matchup.west.kanji || '',
        matchup.west.record || '',
        matchup.west.rank || '',
      ].join('\t'),
    ),
  ]

  return rows.join('\n')
}
