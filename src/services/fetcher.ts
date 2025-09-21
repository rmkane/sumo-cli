import type { DivisionType, Rikishi } from '../types'
import { parseRikishiFromHTML } from './parser'
import { downloadStatsData } from '../utils/cache-manager'

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
    const results = parseRikishiFromHTML(html)
    return { results, fromServer }
  } catch (error) {
    console.error(`Error fetching results for division ${division}:`, error)
    throw error
  }
}

