import { CssClasses, Division, DivisionNames, JapaneseTerms, MatchResult, Side, TournamentConstants } from '@/constants'

/**
 * Utility type to extract keys from an object type
 */
export type KeyOf<T> = keyof T

/**
 * Utility type to extract values from an object type
 */
export type ValueOf<T> = T[KeyOf<T>]

/**
 * Type representing a sumo division identifier
 */
export type DivisionType = ValueOf<typeof Division>

export type SideType = ValueOf<typeof Side>

export type MatchResultType = ValueOf<typeof MatchResult>

export type DivisionNameType = ValueOf<typeof DivisionNames>

export type CssClassType = ValueOf<typeof CssClasses>

export type JapaneseTermType = ValueOf<typeof JapaneseTerms>

export type TournamentConstantType = ValueOf<typeof TournamentConstants>

/**
 * Interface for sumo rank data
 */
export interface RikishiRank {
  /** Division name (e.g., "Makuuchi", "Juryo") */
  division: string
  /** Position within the division (1-based) */
  position?: number
  /** Side of the ranking (East or West) */
  side?: SideType
}

/**
 * Interface for sumo wrestler (rikishi) data
 */
export interface Rikishi {
  /** Unique identifier for the rikishi */
  id: number
  /** Japanese name in kanji characters */
  kanji: string
  /** Japanese name in hiragana characters */
  hiragana: string
  /** Japanese name in romanized form */
  romaji: string
  /** English name or transliteration */
  english: string
  /** Current rank information (optional) */
  rank?: RikishiRank
}

export interface RikishiRecord {
  wins: number
  losses: number
  rest?: number
}

/**
 * Interface for rikishi name information
 */
export interface RikishiName {
  /** English name or transliteration */
  english: string
  /** Japanese name in kanji characters */
  kanji: string
  /** Japanese name in hiragana characters */
  hiragana: string
}

/**
 * Interface for rikishi match result data
 */
export interface RikishiResult {
  /** Rikishi name information */
  name: RikishiName
  /** Rank information with division, position, and side */
  rank: RikishiRank
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
  /** Current day number (1-15) if tournament is active, null otherwise */
  dayNumber: number | null
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
export type ProcessorFn<T> = (divisionName: string, divisionId: DivisionType) => Promise<T>
