import type { DivisionType, Rikishi } from '../types';
import { RateLimitedQueue } from '../classes/queue';
import {
  ensureCacheDirectory,
  getCachePath,
  readFromCache,
  writeToCache,
} from '../utils/cache';
import { fetchHTML } from '../utils/html';
import { parseRikishiFromHTML } from './parser';

// Configuration constants
const BASE_URL = 'https://sumo.or.jp/ResultData/hoshitori';

// Global queue for rate-limited downloads
const downloadQueue = new RateLimitedQueue(2000);

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
  forceRefresh: boolean = false
): Promise<{ results: Rikishi[]; fromServer: boolean }> {
  const url = `${BASE_URL}/${division}/1/`;
  const cachePath = getCachePath(url);

  let html: string;
  let fromServer = false;

  try {
    await ensureCacheDirectory();

    // Try cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = await readFromCache(cachePath);
      if (cached) {
        html = cached;
        fromServer = false;
      } else {
        html = await downloadFromServer(division, url, cachePath, false);
        fromServer = true;
      }
    } else {
      html = await downloadFromServer(division, url, cachePath, true);
      fromServer = true;
    }
  } catch (error) {
    console.error(`Error fetching results for division ${division}:`, error);
    throw error;
  }

  const results = parseRikishiFromHTML(html);
  return { results, fromServer };
}

/**
 * Downloads content from server with rate limiting and caching.
 *
 * @param division - Division identifier for logging
 * @param url - URL to download from
 * @param cachePath - Path to cache the downloaded content
 * @param isForceRefresh - Whether this is a force refresh download
 * @returns Downloaded HTML content
 */
async function downloadFromServer(
  division: DivisionType,
  url: string,
  cachePath: string,
  isForceRefresh: boolean
): Promise<string> {
  return downloadQueue.add(async () => {
    console.log(`${isForceRefresh ? 'Force ' : ''}Downloading ${division}...`);
    const content = await fetchHTML(url);
    await writeToCache(cachePath, content);
    return content;
  });
}
