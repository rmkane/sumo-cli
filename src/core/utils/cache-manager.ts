import fs from 'node:fs/promises'
import path from 'node:path'

import { DATA_PATHS } from '@/config/data'
import { RATE_LIMITS } from '@/config/urls'
import { RateLimitedQueue } from '@/core/classes/queue'
import { fetchHTML } from '@/core/utils/html'
import { logDebug } from '@/core/utils/logger'
import type { Division, DivisionNumber } from '@/types'

// Global queue for rate-limited downloads
const downloadQueue = new RateLimitedQueue(RATE_LIMITS.DOWNLOAD_DELAY_MS)

/**
 * Centralized cache manager that handles downloading and caching of data
 * with automatic subdirectory organization based on file extension.
 */

/**
 * Cache configuration for different data types
 */
const CACHE_CONFIG = {
  html: {
    directory: 'html',
    extension: '.html',
  },
  json: {
    directory: 'json',
    extension: '.json',
  },
} as const

type CacheType = keyof typeof CACHE_CONFIG

/**
 * Downloads content from a URL and caches it with automatic subdirectory organization.
 *
 * @param url - URL to download from
 * @param cacheType - Type of cache (determines subdirectory)
 * @param customFilename - Optional custom filename (without extension)
 * @param forceRefresh - Whether to bypass cache and force download
 * @returns Object containing content and whether it was fetched from server
 */
export async function downloadAndCache(
  url: string,
  cacheType: CacheType,
  customFilename?: string,
  forceRefresh: boolean = false,
): Promise<{ content: string; fromServer: boolean }> {
  const cachePath = getCachePath(url, cacheType, customFilename)

  // Try cache first (unless force refresh)
  if (!forceRefresh) {
    const cached = await readFromCache(cachePath)
    if (cached !== null && cached !== '') {
      return { content: cached, fromServer: false }
    }
  }

  // Download from server
  const content = await downloadFromServer(url)
  await writeToCache(cachePath, content)

  return { content, fromServer: true }
}

/**
 * Downloads matchup data for a specific division and day with proper naming.
 *
 * @param division - Division identifier
 * @param day - Tournament day
 * @param forceRefresh - Whether to bypass cache
 * @returns Object containing HTML content and whether it was fetched from server
 */
export async function downloadMatchupData(
  divisionName: Division,
  divisionId: DivisionNumber,
  day: number,
  forceRefresh: boolean = false,
): Promise<{ content: string; fromServer: boolean }> {
  const url = `https://www.sumo.or.jp/ResultData/torikumi/${divisionId}/${day}/`
  const paddedDay = day.toString().padStart(2, '0')
  const customFilename = `day_${paddedDay}_${divisionId}_${divisionName.toLowerCase()}`

  return downloadAndCache(url, 'html', customFilename, forceRefresh)
}

/**
 * Downloads stats data for a specific division with proper naming.
 *
 * @param division - Division identifiers
 * @param forceRefresh - Whether to bypass cache
 * @returns Object containing HTML content and whether it was fetched from server
 */
export async function downloadStatsData(
  divisionName: Division,
  divisionId: DivisionNumber,
  forceRefresh: boolean = false,
): Promise<{ content: string; fromServer: boolean }> {
  const url = `https://sumo.or.jp/ResultData/hoshitori/${divisionId}/1/`
  const customFilename = `stats_${divisionId}_${divisionName.toLowerCase()}`

  return downloadAndCache(url, 'html', customFilename, forceRefresh)
}

/**
 * Gets the cache path for a URL with automatic subdirectory organization.
 *
 * @param url - URL to cache
 * @param cacheType - Type of cache (determines subdirectory)
 * @param customFilename - Optional custom filename
 * @returns Cache file path
 */
function getCachePath(url: string, cacheType: CacheType, customFilename?: string): string {
  const config = CACHE_CONFIG[cacheType]

  if (customFilename !== undefined && customFilename !== '') {
    return `${DATA_PATHS.USER_DATA_DIR}/${config.directory}/${customFilename}${config.extension}`
  }

  // Fallback to URL-based naming
  const cacheKey = Buffer.from(url)
    .toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '')

  return `${DATA_PATHS.USER_DATA_DIR}/${config.directory}/${cacheKey}${config.extension}`
}

/**
 * Reads content from cache.
 *
 * @param cachePath - Path to cached file
 * @returns Cached content or null if not found
 */
async function readFromCache(cachePath: string): Promise<string | null> {
  try {
    const cached = await fs.readFile(cachePath, 'utf-8')
    logDebug(`Using cached version: ${path.basename(cachePath)}`)
    return cached
  } catch {
    return null
  }
}

/**
 * Writes content to cache.
 *
 * @param cachePath - Path to cache file
 * @param content - Content to cache
 */
async function writeToCache(cachePath: string, content: string): Promise<void> {
  // Ensure directory exists
  const dir = path.dirname(cachePath)
  await fs.mkdir(dir, { recursive: true })

  await fs.writeFile(cachePath, content, 'utf-8')
  logDebug(`Cached to: ${path.basename(cachePath)}`)
}

/**
 * Downloads content from server with rate limiting.
 *
 * @param url - URL to download from
 * @returns Downloaded content
 */
async function downloadFromServer(url: string): Promise<string> {
  return downloadQueue.add(async () => {
    logDebug(`Downloading: ${url}`)
    return await fetchHTML(url)
  })
}
