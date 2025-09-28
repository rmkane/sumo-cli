// ============================================================================
// Types module (constant-agnostic)
// ----------------------------------------------------------------------------
// Pure TypeScript types and lightweight helpers only.
// Any constant-dependent logic lives in '@/core/utils/banzuke' or services.
// ============================================================================

/**
 * Utility types
 */
export type KeyOf<T> = keyof T
export type ValueOf<T> = T[KeyOf<T>]

// Core domain scalar types

/**
 * Sumo division identifiers
 */
export type Division = 'Makuuchi' | 'Juryo' | 'Makushita' | 'Sandanme' | 'Jonidan' | 'Jonokuchi'

export type DivisionNumber = 1 | 2 | 3 | 4 | 5 | 6

/**
 * Side indicators for banzuke positioning
 */
export type Side = 'East' | 'West'

/**
 * Rikishi status indicators
 */
export type Status = 'Active' | 'Retired'

export type YokozunaLiteral = 'Yokozuna'
export type OzekiLiteral = 'Ozeki'
export type SekiwakeLiteral = 'Sekiwake'
export type KomusubiLiteral = 'Komusubi'
export type MaegashiraLiteral = 'Maegashira'
export type JuryoLiteral = 'Juryo'
export type MakushitaLiteral = 'Makushita'
export type SandanmeLiteral = 'Sandanme'
export type JonidanLiteral = 'Jonidan'
export type JonokuchiLiteral = 'Jonokuchi'

export type Sanyaku = YokozunaLiteral | OzekiLiteral | SekiwakeLiteral | KomusubiLiteral
export type Sekitori = Sanyaku | MaegashiraLiteral | JuryoLiteral
export type Toriteki = MakushitaLiteral | SandanmeLiteral | JonidanLiteral | JonokuchiLiteral
export type Rank = Sekitori | Toriteki

/**
 * Match result indicators
 */
export type MatchResultType = 'W' | 'L' | ''

/**
 * CSS class names used in HTML parsing
 */
export type CssClassType = 'win' | 'player' | 'result' | 'decide'

/**
 * Japanese terms used throughout the application
 */
export type JapaneseTermType = '筆頭' | '枚目' | '東' | '西' | '取組解説'

/**
 * Tournament-related numeric constants
 */
export type TournamentConstantType = 15 | 1 | 999

// ---------------------------------------------------------------------------
// Unions mirroring label sets used in the app (kept independent of constants)

// Keep DivisionNameType independent of constants.
export type DivisionNameType = Sekitori | 'Makushita' | 'Sandanme' | 'Jonidan' | 'Jonokuchi' | 'Unknown'

// Makuuchi: named san'yaku + numbered Maegashira
export type Maegashira = { kind: 'Maegashira'; number: number }
export type MakuuchiRank = Sanyaku | Maegashira

// Other divisions: numbered ranks
export type NumberedRank = { kind: 'Numbered'; number: number }

/**
 * Interface for rikishi shikona (ring name) information
 */
export interface RikishiShikona {
  /** English name or transliteration */
  english: string
  /** Japanese name in kanji characters */
  kanji: string
  /** Japanese name in hiragana characters */
  hiragana: string
  /** Japanese name in romanized form */
  romaji: string
}

export interface BanzukeSlot {
  division: Division
  side: Side
  rank: MakuuchiRank | NumberedRank
}

// ============================= TYPE GUARDS ==================================
export const isSekitori = (d: Division): boolean => d === 'Makuuchi' || d === 'Juryo'

export const isSanyaku = (r: MakuuchiRank): r is Sanyaku => typeof r === 'string'

export const isMaegashira = (r: MakuuchiRank): r is Maegashira => typeof r !== 'string' && r.kind === 'Maegashira'

export const isNumberedRank = (r: MakuuchiRank | NumberedRank): r is NumberedRank =>
  typeof r === 'object' && r !== null && (r as unknown as NumberedRank).kind === 'Numbered'

// =============================== HELPERS ====================================
export const mkMaegashira = (n: number): Maegashira => ({ kind: 'Maegashira', number: n })
export const mkNumbered = (n: number): NumberedRank => ({ kind: 'Numbered', number: n })

export const rankLabel = (r: MakuuchiRank | NumberedRank): string =>
  typeof r === 'string' ? r : r.kind === 'Maegashira' ? `Maegashira ${r.number}` : `${r.number}`

// Sorting helpers moved to '@/core/utils/banzuke' to avoid constant imports here.

/**
 * Interface for sumo wrestler (rikishi) data
 */
export interface Rikishi {
  /** Unique identifier for the rikishi */
  id: number
  /** Rikishi shikona (ring name) information */
  shikona: RikishiShikona
  /** Current banzuke position */
  current: BanzukeSlot
}

export interface RikishiRecord {
  wins: number
  losses: number
  rest?: number
}

/**
 * Interface for rikishi match result data
 */
export interface RikishiResult {
  /** Rikishi shikona (ring name) information */
  shikona: RikishiShikona
  /** Current banzuke position */
  current: BanzukeSlot
  /** Tournament record (e.g., "(1勝0敗)", "(0勝1敗)") */
  record: RikishiRecord
  /** Match result: 'W' for win, 'L' for loss, '' for no result yet */
  result: MatchResultType
  /** English kimarite name if there's a recorded win (optional) */
  technique?: string
}

/**
 * Interface for sumo matchup data
 */
export interface MatchupData {
  /** East side rikishi match result */
  east: RikishiResult
  /** West side rikishi match result */
  west: RikishiResult
}

/**
 * Configuration options for file operations.
 */
export interface FileOptions {
  /** Whether to create parent directories if they don't exist */
  createDirectories?: boolean
  /** Encoding to use for text files (default: 'utf-8') */
  encoding?: BufferEncoding
  /** Whether to overwrite existing files */
  overwrite?: boolean
  /** Custom error message for file operations */
  errorMessage?: string
}

/**
 * Interface for sumo tournament venue information
 */
export interface TournamentVenue {
  /** Venue name (e.g., "Ryōgoku Kokugikan", "EDION Arena") */
  name: string
  /** Venue location city (e.g., "Tokyo", "Osaka") */
  location: string
}

/**
 * Interface for sumo tournament information
 */
export interface TournamentInfo {
  /** Tournament start date (always 2nd Sunday of odd months) */
  startDate: Date
  /** Tournament end date (15 days after start date) */
  endDate: Date
  /** Current day number (1-15) if tournament is active, undefined otherwise */
  dayNumber: number | undefined
  /** Whether the tournament is currently active */
  isActive: boolean
  /** Tournament month name (e.g., "January", "March", etc.) */
  tournamentMonth: string
  /** Tournament venue information */
  venue: TournamentVenue
}

/**
 * Generic processor function type for division operations
 */
// eslint-disable-next-line no-unused-vars
export type ProcessorFn<T> = (divisionName: Division, divisionId: DivisionNumber) => Promise<T>
