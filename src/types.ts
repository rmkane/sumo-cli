import { Division } from '@/constants'

export type KeyOf<T> = keyof T
export type ValueOf<T> = T[KeyOf<T>]

export type DivisionType = ValueOf<typeof Division>

/**
 * Interface for rank data
 */
export interface Rank {
  division: string
  position: number
}

/**
 * Interface for rikishi data
 */
export interface Rikishi {
  id: number
  kanji: string
  hiragana: string
  romaji: string
  english: string
  rank?: Rank
}

/**
 * Interface for rikishi result
 */
export interface RikishiResult {
  rank: string
  record: string
  kanji: string
  hiragana: string
  name: string
  result: string // 'W' for win, 'L' for loss, '' for no result yet
  technique?: string // English kimarite name if there's a recorded win
}

/**
 * Interface for matchup data
 */
export interface MatchupData {
  /** East rikishi */
  east: RikishiResult
  /** West rikishi */
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
 * Processor function type
 */
// eslint-disable-next-line no-unused-vars
export type ProcessorFn<T> = (divisionName: string, divisionId: DivisionType) => Promise<T>
