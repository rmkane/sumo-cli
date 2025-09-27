import type { DivisionType } from '@/types'
import { downloadMatchupData } from '@/utils/cache-manager'
import { logError } from '@/utils/logger'

/**
 * Fetches matchup data for a specific division and day, using cache when possible.
 * Downloads are queued with rate limiting to be respectful to the server.
 *
 * @param division - Division identifier
 * @param day - Tournament day (1-15)
 * @param forceRefresh - Whether to bypass cache
 * @returns Object containing HTML content and whether data was fetched from server
 */
export async function fetchMatchupData(
  division: DivisionType,
  day: number,
  forceRefresh: boolean = false,
): Promise<{ html: string; fromServer: boolean }> {
  try {
    const { content: html, fromServer } = await downloadMatchupData(division, day, forceRefresh)
    return { html, fromServer }
  } catch (error) {
    logError(`fetching matchup data for division ${division} day ${day}`, error)
    throw error
  }
}
