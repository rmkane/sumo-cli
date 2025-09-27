import { promises as fs } from 'node:fs'
import path from 'node:path'

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_DELIMITER = '\t'
const DEFAULT_NEWLINE = '\n' as const
const DEFAULT_ENSURE_TRAILING_NEWLINE = true

// ============================================================================
// Types
// ============================================================================

/**
 * Represents a CSV column header
 */
export type CSVHeader<K extends string = string> = {
  /** Unique identifier for the column */
  id: K
  /** Display title for the column */
  title: string
}

/**
 * Options for writing CSV data
 */
export type WriteCSVOptions<K extends string = string> = {
  /** Column headers for the CSV */
  headers: ReadonlyArray<CSVHeader<K>>
  /** Data rows to write */
  rows: ReadonlyArray<Record<K, string>>
  /**
   * If provided, writes to this path and resolves void.
   * If omitted, returns the CSV string instead.
   */
  path?: string
  /**
   * Optional header rows that appear *above* the main header row.
   * Each inner array is a row of headers.
   */
  extraHeaderRows?: ReadonlyArray<ReadonlyArray<CSVHeader<K>>>
  /** Field delimiter (default: tab) */
  delimiter?: string
  /** Line ending style (default: Unix) */
  newline?: '\n' | '\r\n'
  /** Whether to ensure file ends with newline (default: true) */
  ensureTrailingNewline?: boolean
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Escapes a cell value for CSV/TSV format
 * @param cell - The cell value to escape
 * @param delimiter - The field delimiter
 * @param newline - The line ending style
 * @returns Escaped cell value
 */
const escapeCell = (cell: string, delimiter: string, newline: string): string => {
  // Quote if cell contains delimiter, quote, or newline
  if (cell.includes(delimiter) || cell.includes('"') || cell.includes('\n') || cell.includes('\r')) {
    return `"${cell.replace(/"/g, '""')}"`
  }
  // Normalize newlines inside cells to keep structure consistent
  return cell.replace(/\r?\n/g, newline)
}

/**
 * Ensures directory exists, creating it if necessary
 * @param filePath - File path - will ensure the parent directory exists
 */
async function ensureDirectoryExists(filePath: string | undefined): Promise<void> {
  if (filePath === undefined || filePath === '') return

  const dirPath = path.dirname(filePath)
  try {
    await fs.access(dirPath)
  } catch {
    await fs.mkdir(dirPath, { recursive: true })
  }
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Writes CSV data to file or returns as string
 *
 * @param options - Configuration options for CSV generation
 * @returns Promise<void> if writing to file, Promise<string> if returning content
 *
 * @example
 * ```typescript
 * // Write to file
 * await writeCSV({
 *   headers: [{ id: 'name', title: 'Name' }],
 *   rows: [{ name: 'John' }],
 *   path: './output.csv'
 * })
 *
 * // Return as string
 * const csvString = await writeCSV({
 *   headers: [{ id: 'name', title: 'Name' }],
 *   rows: [{ name: 'John' }]
 * })
 * ```
 */
export async function writeCSV<K extends string = string>({
  headers,
  rows,
  path,
  extraHeaderRows = [],
  delimiter = DEFAULT_DELIMITER,
  newline = DEFAULT_NEWLINE,
  ensureTrailingNewline = DEFAULT_ENSURE_TRAILING_NEWLINE,
}: WriteCSVOptions<K>): Promise<void | string> {
  await ensureDirectoryExists(path)

  const headerRow = headers.map((h) => h.title).join(delimiter)
  const prefaceRows = extraHeaderRows.map((r) => r.map((h) => h.title).join(delimiter))

  const dataRows = rows.map((row) =>
    headers.map((h) => escapeCell(row[h.id] ?? '', delimiter, newline)).join(delimiter),
  )

  let content = [...prefaceRows, headerRow, ...dataRows].join(newline)
  if (ensureTrailingNewline) content += newline

  if (path !== undefined && path !== '') {
    await fs.writeFile(path, content, 'utf8')
    return // void
  }
  return content // string
}
