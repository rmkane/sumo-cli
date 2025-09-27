import { load } from 'cheerio'

import { isDayAvailable } from '@/core/services/tournament'

/**
 * Parses and validates HTML content to extract date information.
 *
 * @param html - Raw HTML content from the sumo website
 * @param requestedDay - The day that was requested
 * @returns Object containing validation results and extracted metadata
 */
export function parseHTMLDate(
  html: string,
  requestedDay: number,
): {
  isValid: boolean
  actualDay: number | undefined
  actualDate: string | undefined
  warnings: string[]
} {
  const $ = load(html)
  const warnings: string[] = []

  // Extract actual day from hidden form fields
  const actualDayValue = $('#day').val()
  const actualDay = actualDayValue !== undefined ? parseInt(actualDayValue.toString(), 10) : undefined

  // Extract date from the day header
  const dayHeaderText = $('#dayHead').text().trim()
  const dateMatch = dayHeaderText.match(/令和(\d+)年(\d+)月(\d+)日/)

  const actualDate = dateMatch
    ? [dateMatch[1], dateMatch[2], dateMatch[3]].map((value) => value?.padStart(2, '0')).join('-')
    : undefined

  // Extract tournament day name
  const tournamentDayText = $('.mdDate').text().trim()
  const dayNameMatch = tournamentDayText.match(/令和七年九月場所:(.+)/)
  const dayName = dayNameMatch ? dayNameMatch[1] : null

  // Smart validation: Check if the requested day should be available
  const shouldBeAvailable = isDayAvailable(requestedDay, actualDate)

  if (actualDay !== null && actualDay !== requestedDay) {
    if (shouldBeAvailable) {
      warnings.push(`Requested day ${requestedDay} but HTML contains day ${actualDay} - data should be available`)
    } else {
      warnings.push(`Requested day ${requestedDay} but HTML contains day ${actualDay} - data not yet available`)
    }
  }

  // Validate day name consistency (but be lenient if day number matches)
  if (dayName !== undefined && actualDay !== undefined) {
    const expectedDayNames: { [key: number]: string } = {
      1: '初日',
      2: '二日目',
      3: '三日目',
      4: '四日目',
      5: '五日目',
      6: '六日目',
      7: '七日目',
      8: '中日',
      9: '九日目',
      10: '十日目',
      11: '十一日目',
      12: '十二日目',
      13: '十三日目',
      14: '十四日目',
      15: '千秋楽',
    }

    const expectedDayName = expectedDayNames[actualDay]
    if (expectedDayName !== undefined && dayName !== expectedDayName) {
      // Only warn if the day number also doesn't match - this could be a website update delay
      if (actualDay !== requestedDay) {
        warnings.push(`Day ${actualDay} should be "${expectedDayName}" but HTML shows "${dayName}"`)
      }
    }
  }

  // Check if we're requesting future data using JST
  const nowJST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }))
  const currentYear = nowJST.getFullYear()
  const currentMonth = nowJST.getMonth() + 1
  const currentDay = nowJST.getDate()

  if (actualDate !== undefined) {
    const [year = 0, month = 0, day = 0] = actualDate?.split('-').map(Number) ?? []
    const htmlDate = new Date(year, month - 1, day)

    // Sumo matchups are announced the day before, so allow data up to 1 day in the future
    const maxAllowedDate = new Date(nowJST)
    maxAllowedDate.setDate(maxAllowedDate.getDate() + 1)

    if (htmlDate > maxAllowedDate) {
      warnings.push(
        `HTML date ${actualDate} is too far in the future (current JST: ${currentYear}-${currentMonth.toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')})`,
      )
    }
  }

  const isValid = warnings.length === 0

  return {
    isValid,
    actualDay,
    actualDate,
    warnings,
  }
}
