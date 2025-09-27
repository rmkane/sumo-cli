import { parseRikishiFromHTML } from '@/core/parsers'
import { downloadStatsData } from '@/core/utils/cache-manager'
import type { DivisionType, Rikishi } from '@/types'

/**
 * Fetches rikishi data for a division, using cache when possible.
 * Downloads are queued with rate limiting to be respectful to the server.
 *
 * @param division - Division identifier
 * @param forceRefresh - Whether to bypass cache
 * @returns Object containing results and whether data was fetched from server
 */
export async function fetchResults(
  division: DivisionType,
  forceRefresh: boolean = false,
): Promise<{ results: Rikishi[]; fromServer: boolean }> {
  try {
    const { content: html, fromServer } = await downloadStatsData(division, forceRefresh)
    const results = parseRikishiFromHTML(html, division)
    return { results, fromServer }
  } catch (error) {
    console.error(`Error fetching results for division ${division}:`, error)
    throw error
  }
}
