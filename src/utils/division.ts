import type { DivisionType } from '../types'
import { Division } from '../constants'

/**
 * Gets the division name from division ID.
 *
 * @param division - Division identifier
 * @returns Division name
 */
export function getDivisionName(division: DivisionType): string {
  const divisionNames = {
    [Division.MAKUUCHI]: 'makuuchi',
    [Division.JURYO]: 'juryo',
    [Division.MAKUSHITA]: 'makushita',
    [Division.SANDANME]: 'sandanme',
    [Division.JONIDAN]: 'jonidan',
    [Division.JONOKUCHI]: 'jonokuchi',
  }
  return divisionNames[division] || 'unknown'
}

/**
 * Determines the division based on the rank string.
 * Based on the logic from basho.js.
 *
 * @param rank - Rank string (e.g., "Maegashira #17", "Juryo #10")
 * @returns Division identifier or null if not found
 */
export function getDivisionByRank(rank: string): DivisionType | null {
  const match = rank.match(/([A-Za-z]+)(?:\s#(\d+))?/)
  if (!match) {
    return null
  }

  const [, divisionName] = match

  // Map rank names to division IDs
  const rankToDivision: Record<string, DivisionType> = {
    'Yokozuna': Division.MAKUUCHI,
    'Ozeki': Division.MAKUUCHI,
    'Sekiwake': Division.MAKUUCHI,
    'Komusubi': Division.MAKUUCHI,
    'Maegashira': Division.MAKUUCHI,
    'Juryo': Division.JURYO,
    'Makushita': Division.MAKUSHITA,
    'Sandanme': Division.SANDANME,
    'Jonidan': Division.JONIDAN,
    'Jonokuchi': Division.JONOKUCHI,
  }

  return rankToDivision[divisionName] || null
}
