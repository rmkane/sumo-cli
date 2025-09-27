import { Division } from '@/constants'
import { isValidDivisionEn } from '@/dict/divisions'
import type { DivisionType } from '@/types'
import { invertDict } from '@/utils/object'

// Division ID to name mapping
const DIVISION_NAMES = invertDict(Division, {
  originalKeyMap: (key) => key.toLowerCase(),
}) as Record<DivisionType, string>

// Inverted mapping for efficient lookup
const DIVISION_IDS = invertDict(DIVISION_NAMES)

const AVAILABLE_DIVISIONS = Object.values(DIVISION_NAMES)

/**
 * Gets the division name from division ID.
 *
 * @param division - Division identifier
 * @returns Division name
 */
export function getDivisionName(division: DivisionType): string {
  return DIVISION_NAMES[division] || 'unknown'
}

/**
 * Determines the division based on the rank string.
 * Based on the logic from basho.js.
 *
 * @param rank - Rank string (e.g., "Maegashira #17", "Juryo #10")
 * @returns Division identifier or undefined if not found
 */
export function getDivisionByRank(rank: string): DivisionType | undefined {
  const match = rank.match(/([A-Za-z]+)(?:\s#(\d+))?/)
  if (!match) {
    return undefined
  }

  const [, divisionName] = match
  if (divisionName === undefined || divisionName === '') {
    return undefined
  }

  // Map rank names to division IDs
  const rankToDivision: Record<string, DivisionType> = {
    Yokozuna: Division.MAKUUCHI,
    Ozeki: Division.MAKUUCHI,
    Sekiwake: Division.MAKUUCHI,
    Komusubi: Division.MAKUUCHI,
    Maegashira: Division.MAKUUCHI,
    Juryo: Division.JURYO,
    Makushita: Division.MAKUSHITA,
    Sandanme: Division.SANDANME,
    Jonidan: Division.JONIDAN,
    Jonokuchi: Division.JONOKUCHI,
  }

  return rankToDivision[divisionName] ?? undefined
}

/**
 * Converts English division name to division type
 *
 * @param divisionName - English division name (e.g., 'makuuchi', 'juryo')
 * @returns Division type number
 */
export function getDivisionType(divisionName: string): DivisionType {
  if (!isValidDivisionEn(divisionName)) {
    throw new Error(
      `Invalid division name: ${divisionName}. Available divisions: makuuchi, juryo, makushita, sandanme, jonidan, jonokuchi`,
    )
  }

  return Number(DIVISION_IDS[divisionName]) as DivisionType
}

/**
 * Gets available division names
 *
 * @returns Array of available division names
 */
export function getAvailableDivisions(): string[] {
  return AVAILABLE_DIVISIONS
}

/**
 * Converts division number to division name
 *
 * @param divisionNumber - Division number (1-6)
 * @returns Division name or null if invalid
 */
export function getDivisionNameFromNumber(divisionNumber: number): string | null {
  return DIVISION_NAMES[divisionNumber as DivisionType] || null
}

/**
 * Gets division number to name mappings for display purposes
 *
 * @returns Array of strings showing number=name mappings
 */
export function getDivisionNumberMappings(): string[] {
  return Object.entries(DIVISION_NAMES).map(([index, name]) => `${index}=${name}`)
}
