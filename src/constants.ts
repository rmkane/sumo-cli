// ============================================================================
// DIVISION CONSTANTS
// ============================================================================

/**
 * Sumo division identifiers (numeric values for sorting/hierarchy)
 */
export const Division = {
  MAKUUCHI: 1,
  JURYO: 2,
  MAKUSHITA: 3,
  SANDANME: 4,
  JONIDAN: 5,
  JONOKUCHI: 6,
} as const

/**
 * Human-readable division names
 */
export const DivisionNames = {
  YOKOZUNA: 'Yokozuna',
  OZEKI: 'Ozeki',
  SEKIWAKE: 'Sekiwake',
  KOMUSUBI: 'Komusubi',
  MAEGASHIRA: 'Maegashira',
  JURYO: 'Juryo',
  MAKUSHITA: 'Makushita',
  SANDANME: 'Sandanme',
  JONIDAN: 'Jonidan',
  JONOKUCHI: 'Jonokuchi',
  UNKNOWN: 'Unknown',
} as const

// ============================================================================
// MATCH CONSTANTS
// ============================================================================

/**
 * Match result indicators
 */
export const MatchResult = {
  WIN: 'W',
  LOSS: 'L',
  NO_RESULT: '',
} as const

/**
 * Side indicators for rikishi positioning
 */
export const Side = {
  EAST: 'East',
  WEST: 'West',
} as const

// ============================================================================
// UI CONSTANTS
// ============================================================================

/**
 * CSS class names used in HTML parsing
 */
export const CssClasses = {
  WIN: 'win',
  PLAYER: 'player',
  RESULT: 'result',
  DECIDE: 'decide',
} as const

// ============================================================================
// JAPANESE LANGUAGE CONSTANTS
// ============================================================================

/**
 * Japanese terms used throughout the application
 */
export const JapaneseTerms = {
  HITTOU: '筆頭', // First position
  MAIME: '枚目', // Position suffix
  EAST_JP: '東', // East (Japanese)
  WEST_JP: '西', // West (Japanese)
  KIMARITE_SUFFIX: '取組解説', // Kimarite explanation suffix
} as const

// ============================================================================
// TOURNAMENT CONSTANTS
// ============================================================================

/**
 * Tournament-related numeric constants
 */
export const TournamentConstants = {
  TOTAL_DAYS: 15,
  FIRST_DAY: 1,
  FALLBACK_HIERARCHY: 999,
} as const
