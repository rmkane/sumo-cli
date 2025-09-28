import { parseHTMLDate } from '@/core/parsers'
import { logDebug, logWarning } from '@/core/utils/logger'

/**
 * Validates that the HTML content matches the requested day.
 *
 * @param html - Raw HTML content from the sumo website
 * @param requestedDay - The day that was requested
 * @returns Object containing validation results and extracted metadata
 */
export function validateHTMLDate(
  html: string,
  requestedDay: number,
): {
  isValid: boolean
  actualDay: number | undefined
  actualDate: string | undefined
  warnings: string[]
} {
  return parseHTMLDate(html, requestedDay)
}

/**
 * Validates HTML content and logs warnings if validation fails.
 *
 * @param html - Raw HTML content
 * @param requestedDay - The day that was requested
 * @returns True if validation passes, false otherwise
 */
export function validateAndLogHTMLDate(html: string, requestedDay: number): boolean {
  const validation = validateHTMLDate(html, requestedDay)

  if (!validation.isValid) {
    logWarning(`HTML date validation failed for day ${requestedDay}:`)
    validation.warnings.forEach((warning) => logWarning(`  - ${warning}`))

    if (validation.actualDay !== undefined) {
      logWarning(`  - HTML contains day ${validation.actualDay} data instead of requested day ${requestedDay}`)
    }
    if (validation.actualDate !== undefined) {
      logWarning(`  - HTML date: ${validation.actualDate}`)
    }

    return false
  } else {
    logDebug(`HTML date validation passed for day ${requestedDay}`)
    return true
  }
}
