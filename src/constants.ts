// ============================================================================
// DIVISION CONSTANTS
// ============================================================================
import type {
  CssClassType,
  Division,
  DivisionNumber,
  JapaneseTermType,
  MatchResultType,
  Sanyaku,
  Side,
  Status,
  TournamentConstantType,
} from '@/types'

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
} as const satisfies Record<string, MatchResultType>

// ============================================================================
// BANZUKE CONSTANTS
// ============================================================================

/**
 * Sumo division names (string values for banzuke)
 */
export const DIVISION = {
  MAKUUCHI: 'Makuuchi',
  JURYO: 'Juryo',
  MAKUSHITA: 'Makushita',
  SANDANME: 'Sandanme',
  JONIDAN: 'Jonidan',
  JONOKUCHI: 'Jonokuchi',
} as const satisfies Record<string, Division>

export const DIVISION_VALUES = Object.freeze(Object.values(DIVISION))

/**
 * Side indicators for banzuke positioning
 */
export const SIDE = {
  EAST: 'East',
  WEST: 'West',
} as const satisfies Record<string, Side>

/**
 * Rikishi status indicators
 */
export const STATUS = {
  ACTIVE: 'Active',
  RETIRED: 'Retired',
} as const satisfies Record<string, Status>

/**
 * Sanyaku ranks (highest ranks in sumo)
 */
export const SANYAKU = {
  YOKOZUNA: 'Yokozuna',
  OZEKI: 'Ozeki',
  SEKIWAKE: 'Sekiwake',
  KOMUSUBI: 'Komusubi',
} as const satisfies Record<string, Sanyaku>

/**
 * Sanyaku ranks (highest ranks in sumo)
 */
export const SANYAKU_VALUES = Object.freeze(Object.values(SANYAKU))

/**
 * Orders for sorting (lower = higher on the banzuke)
 */
export const DIVISION_ORDER = {
  [DIVISION.MAKUUCHI]: 0,
  [DIVISION.JURYO]: 1,
  [DIVISION.MAKUSHITA]: 2,
  [DIVISION.SANDANME]: 3,
  [DIVISION.JONIDAN]: 4,
  [DIVISION.JONOKUCHI]: 5,
} as const

export const SIDE_ORDER = {
  [SIDE.EAST]: 0,
  [SIDE.WEST]: 1,
} as const

export const SANYAKU_ORDER = {
  Yokozuna: 0,
  Ozeki: 1,
  Sekiwake: 2,
  Komusubi: 3,
} as const

/**
 * Map division strings to numeric IDs for filename generation
 */
export const DIVISION_TO_NUMBER: Record<Division, DivisionNumber> = {
  [DIVISION.MAKUUCHI]: 1,
  [DIVISION.JURYO]: 2,
  [DIVISION.MAKUSHITA]: 3,
  [DIVISION.SANDANME]: 4,
  [DIVISION.JONIDAN]: 5,
  [DIVISION.JONOKUCHI]: 6,
} as const

/**
 * Map numeric division numbers to string division names
 */
export const NUMBER_TO_DIVISION: Record<DivisionNumber, Division> = {
  1: DIVISION.MAKUUCHI,
  2: DIVISION.JURYO,
  3: DIVISION.MAKUSHITA,
  4: DIVISION.SANDANME,
  5: DIVISION.JONIDAN,
  6: DIVISION.JONOKUCHI,
} as const

/**
 * Map division names to division constants
 */
export const DIVISION_NAME_TO_DIVISION: Record<string, Division> = {
  Makuuchi: DIVISION.MAKUUCHI,
  Juryo: DIVISION.JURYO,
  Makushita: DIVISION.MAKUSHITA,
  Sandanme: DIVISION.SANDANME,
  Jonidan: DIVISION.JONIDAN,
  Jonokuchi: DIVISION.JONOKUCHI,
} as const

/**
 * Map side names to side constants
 */
export const SIDE_NAME_TO_SIDE: Record<string, Side> = {
  East: SIDE.EAST,
  West: SIDE.WEST,
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
} as const satisfies Record<string, CssClassType>

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
} as const satisfies Record<string, JapaneseTermType>

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
} as const satisfies Record<string, TournamentConstantType>
