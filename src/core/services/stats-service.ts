import { parseRikishiFromHTML } from '@/core/parsers'
import { downloadStatsData } from '@/core/utils/cache-manager'
import type { Division, DivisionNumber, Rikishi } from '@/types'

/**
 * Fetches rikishi data for a division, using cache when possible.
 * Downloads are queued with rate limiting to be respectful to the server.
 *
 * @param division - Division identifier
 * @param forceRefresh - Whether to bypass cache
 * @returns Object containing results and whether data was fetched from server
 */
export async function fetchResults(
  divisionName: Division,
  divisionId: DivisionNumber,
  forceRefresh: boolean = false,
): Promise<{ results: Rikishi[]; fromServer: boolean }> {
  try {
    const { content: html, fromServer } = await downloadStatsData(divisionName, divisionId, forceRefresh)
    const results = parseRikishiFromHTML(html, divisionName)
    return { results, fromServer }
  } catch (error) {
    console.error(`Error fetching results for division ${divisionName}:`, error)
    throw error
  }
}
