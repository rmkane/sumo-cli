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
    const rankInfo = `${rikishi.current.division}${typeof rikishi.current.rank === 'string' ? '' : ` #${rikishi.current.rank.number}`} (${rikishi.current.side})`
    console.log(`${index + 1}. ${rikishi.shikona.english} (${rikishi.shikona.kanji}) - ${rankInfo}`)
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
    division: rikishi.current.division,
    rank: typeof rikishi.current.rank === 'string' ? rikishi.current.rank : rikishi.current.rank.number,
    side: rikishi.current.side,
    name: rikishi.shikona.english,
    kanji: rikishi.shikona.kanji,
    romaji: rikishi.shikona.romaji,
  }))

  console.log(formatTable(columns, tableData))
}
