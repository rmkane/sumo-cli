export const TZ_ASIA_TOKYO = 'Asia/Tokyo'
export const TZ_UTC = 'UTC'

/**
 * Internationalized date formatter with configurable options
 */
export interface DateFormatOptions {
  locale?: string
  timeZone?: string
  format?: 'short' | 'medium' | 'long' | 'full'
  includeTime?: boolean
  showTimeZone?: boolean
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Build format options for date formatting
 * @param timeZone - The timezone to use
 * @param format - The date format style
 * @param includeTime - Whether to include time formatting
 * @returns Format options for Intl.DateTimeFormat
 */
function buildFormatOptions(
  timeZone: string,
  format: 'short' | 'medium' | 'long' | 'full',
  includeTime: boolean,
): Intl.DateTimeFormatOptions {
  const formatOptions: Intl.DateTimeFormatOptions = { timeZone }

  if (includeTime) {
    // For date + time, use individual date options (can't use dateStyle with time options)
    formatOptions.hour = '2-digit'
    formatOptions.minute = '2-digit'

    switch (format) {
      case 'short':
        formatOptions.year = '2-digit'
        formatOptions.month = 'numeric'
        formatOptions.day = 'numeric'
        break
      case 'medium':
        formatOptions.year = 'numeric'
        formatOptions.month = 'short'
        formatOptions.day = 'numeric'
        break
      case 'long':
        formatOptions.year = 'numeric'
        formatOptions.month = 'long'
        formatOptions.day = 'numeric'
        break
      case 'full':
        formatOptions.year = 'numeric'
        formatOptions.month = 'long'
        formatOptions.day = 'numeric'
        formatOptions.weekday = 'long'
        break
    }
  } else {
    // For date only, use dateStyle
    formatOptions.dateStyle = format
  }

  return formatOptions
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Format a date with internationalization support
 * @param date - The date to format
 * @param options - Formatting options
 * @returns Formatted date string
 */
export function formatDate(date: Date, options: DateFormatOptions = {}): string {
  const {
    locale = 'en-US',
    timeZone = TZ_ASIA_TOKYO,
    format = 'medium',
    includeTime = false,
    showTimeZone = true,
  } = options

  const formatOptions = buildFormatOptions(timeZone, format, includeTime)

  const formatted = includeTime
    ? date.toLocaleString(locale, formatOptions)
    : date.toLocaleDateString(locale, formatOptions)

  // Add timezone suffix if requested
  if (showTimeZone && timeZone) {
    return `${formatted} (${timeZone})`
  }

  return formatted
}

/**
 * Format a date for tournament display (JST timezone)
 * @param date - The date to format
 * @returns Formatted date string with JST timezone
 */
export function formatTournamentDate(date: Date): string {
  return formatDate(date, {
    locale: 'en-US',
    timeZone: TZ_ASIA_TOKYO,
    format: 'medium',
    showTimeZone: true,
  })
}
