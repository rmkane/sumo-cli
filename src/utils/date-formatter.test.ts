import { describe, expect, it } from 'vitest'

import { TZ_ASIA_TOKYO, TZ_UTC, formatDate, formatTournamentDate } from '@/utils/date-formatter.js'

describe('Date Formatter', () => {
  const testDate = new Date('2025-09-14T00:00:00Z')

  it('should format tournament dates correctly', () => {
    const result = formatTournamentDate(testDate)
    expect(result).toContain('Sep 14, 2025')
    expect(result).toContain(TZ_ASIA_TOKYO)
  })

  it('should format dates with custom options', () => {
    const result = formatDate(testDate, {
      locale: 'en-US',
      timeZone: TZ_UTC,
      format: 'short',
      showTimeZone: false,
    })
    expect(result).toBe('9/14/25')
  })

  it('should format dates with time included', () => {
    const result = formatDate(testDate, {
      locale: 'en-US',
      timeZone: TZ_ASIA_TOKYO,
      format: 'medium',
      includeTime: true,
      showTimeZone: true,
    })
    expect(result).toContain('Sep 14, 2025')
    expect(result).toContain(TZ_ASIA_TOKYO)
    expect(result).toMatch(/\d{2}:\d{2}/) // Should contain time format
  })

  it('should handle different locales', () => {
    const result = formatDate(testDate, {
      locale: 'ja-JP',
      timeZone: TZ_ASIA_TOKYO,
      format: 'medium',
      showTimeZone: false,
    })
    // Japanese date format can vary, so check for year and month
    expect(result).toContain('2025')
    expect(result).toContain('9')
    expect(result).toContain('14')
  })
})
