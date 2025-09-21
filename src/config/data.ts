import { homedir } from 'node:os'
import { join } from 'node:path'

/**
 * Configuration constants for data storage paths
 */
export const DATA_PATHS = {
  // User data directory (JSON/HTML cache) - stored in user's home directory
  USER_DATA_DIR: join(homedir(), '.sumo-cli'),
  // Local output directory (CSV files) - relative to current working directory
  OUTPUT_DIR: './output',
  // Legacy data directory for backward compatibility
  LEGACY_DATA_DIR: './data',
} as const

/**
 * Data directory structure within user data directory
 */
export const DATA_DIRS = {
  JSON: 'json',
  CACHE: 'cache',
  LOGS: 'logs',
} as const
