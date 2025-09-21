/**
 * Configuration constants for URLs and API endpoints
 */
export const URLS = {
  STATS_BASE_URL: 'https://sumo.or.jp/ResultData/hoshitori',
  MATCHUP_BASE_URL: 'https://www.sumo.or.jp/ResultData/torikumi',
} as const

/**
 * Configuration constants for rate limiting
 */
export const RATE_LIMITS = {
  DOWNLOAD_DELAY_MS: 2000,
} as const
