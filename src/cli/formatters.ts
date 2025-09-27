import type { TableColumn } from '@/core/utils/table.js'
import { formatTable } from '@/core/utils/table.js'
import type { Rikishi } from '@/types.js'

/**
 * Formats rikishi data as JSON output
 * @param rikishiList - Array of rikishi data
 */
export function formatDivisionJson(rikishiList: Rikishi[]): void {
  console.log(JSON.stringify(rikishiList, null, 2))
}

/**
 * Formats rikishi data as a numbered list with rank information
 * @param rikishiList - Array of rikishi data
 */
export function formatDivisionList(rikishiList: Rikishi[]): void {
  rikishiList.forEach((rikishi, index: number) => {
    const rankInfo = rikishi.rank
      ? `${rikishi.rank.division}${rikishi.rank.position !== undefined && rikishi.rank.position !== null && rikishi.rank.position !== 0 ? ` #${rikishi.rank.position}` : ''} (${rikishi.rank.side ?? ''})`
      : 'No rank data'
    console.log(`${index + 1}. ${rikishi.name.english} (${rikishi.name.kanji}) - ${rankInfo}`)
  })
}

/**
 * Formats rikishi data as a structured table
 * @param rikishiList - Array of rikishi data
 */
export function formatDivisionTable(rikishiList: Rikishi[]): void {
  const columns: TableColumn[] = [
    { field: 'division', align: 'left' },
    { field: 'rank', align: 'right', title: 'No' },
    { field: 'side', align: 'center' },
    { field: 'name', align: 'left' },
    { field: 'kanji', align: 'left' },
    { field: 'romaji', align: 'left' },
  ]

  const tableData = rikishiList.map((rikishi) => ({
    division: rikishi.rank ? rikishi.rank.division : '-',
    rank: rikishi.rank?.position ?? '-',
    side: rikishi.rank?.side ?? '-',
    name: rikishi.name.english,
    kanji: rikishi.name.kanji,
    romaji: rikishi.name.romaji,
  }))

  console.log(formatTable(columns, tableData))
}
