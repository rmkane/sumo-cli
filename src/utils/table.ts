/**
 * Interface for table column configuration
 */
export interface TableColumn {
  /** Column header text */
  header: string
  /** Column width (minimum width) - optional */
  width?: number
  /** Alignment: 'left', 'right', or 'center' */
  align?: 'left' | 'right' | 'center'
}

/**
 * Calculates the visual width of a string, accounting for wide characters
 * @param str - String to measure
 * @returns Visual width in characters
 */
function getVisualWidth(str: string): number {
  let width = 0
  for (const char of str) {
    const code = char.charCodeAt(0)
    // Wide characters (CJK, emoji, etc.) count as 2
    // But exclude common punctuation like em dash (—) which should count as 1
    if ((code > 0x7f && code !== 0x2014) || (code >= 0x1100 && code <= 0x115f) || (code >= 0x2e80 && code <= 0x9fff)) {
      width += 2
    } else {
      width += 1
    }
  }
  return width
}

/**
 * Formats data as a table with configurable columns
 *
 * @param columns - Array of column configurations
 * @param data - Array of objects with data for each row
 * @param options - Table formatting options
 * @returns Formatted table string
 */
export function formatTable(
  columns: TableColumn[],
  data: Record<string, unknown>[],
  options: {
    /** Character to use for table borders (default: '-') */
    borderChar?: string
    /** Character to use for column separators (default: '|') */
    separatorChar?: string
    /** Whether to show column separators (default: true) */
    showSeparators?: boolean
    /** Whether to show header separator line (default: true) */
    showHeaderSeparator?: boolean
  } = {},
): string {
  const { borderChar = '-', separatorChar = '|', showSeparators = true, showHeaderSeparator = true } = options

  if (data.length === 0) {
    return 'No data to display'
  }

  // Calculate actual column widths based on content
  const actualWidths = columns.map((col) => {
    const headerWidth = getVisualWidth(col.header)
    const dataWidth = Math.max(
      ...data.map((row) => {
        const value = row[col.header] || ''
        return getVisualWidth(String(value))
      }),
    )

    // Use configured width if specified, otherwise use content-based width
    if (col.width !== undefined) {
      return Math.max(col.width, headerWidth, dataWidth)
    }

    // Start with header width, expand only if data needs more space
    return Math.max(headerWidth, dataWidth)
  })

  // Create header row
  const headerRow = columns
    .map((col, index) => {
      const width = actualWidths[index]
      return padText(col.header, width, col.align || 'left')
    })
    .join(showSeparators ? ` ${separatorChar} ` : '  ')

  // Create separator line
  const separatorLine = actualWidths
    .map((width) => borderChar.repeat(width))
    .join(showSeparators ? `-${borderChar}-` : '--')

  // Create data rows
  const dataRows = data.map((row) => {
    return columns
      .map((col, index) => {
        const width = actualWidths[index]
        const value = row[col.header] || ''
        return padText(String(value), width, col.align || 'left')
      })
      .join(showSeparators ? ` ${separatorChar} ` : '  ')
  })

  // Combine all parts
  const parts = [headerRow]
  if (showHeaderSeparator) {
    parts.push(separatorLine)
  }
  parts.push(...dataRows)

  return parts.join('\n')
}

/**
 * Pads text to a specific width with alignment
 *
 * @param text - Text to pad
 * @param width - Target width
 * @param align - Alignment: 'left', 'right', or 'center'
 * @returns Padded text
 */
function padText(text: string, width: number, align: 'left' | 'right' | 'center'): string {
  const visualTextWidth = getVisualWidth(text)
  if (visualTextWidth >= width) {
    // Truncate if too wide (this is a simplified approach)
    return text
  }

  const padding = width - visualTextWidth

  switch (align) {
    case 'right':
      return ' '.repeat(padding) + text
    case 'center': {
      const leftPad = Math.floor(padding / 2)
      const rightPad = padding - leftPad
      return ' '.repeat(leftPad) + text + ' '.repeat(rightPad)
    }
    case 'left':
    default:
      return text + ' '.repeat(padding)
  }
}
