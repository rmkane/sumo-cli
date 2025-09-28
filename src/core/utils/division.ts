import { DIVISION, DIVISION_NAME_TO_DIVISION, NUMBER_TO_DIVISION } from '@/constants'
import { isValidDivisionEn } from '@/core/dict/divisions'
import { ranksDictionaryJp } from '@/core/dict/ranks'
import type { Division, DivisionNumber } from '@/types'

/**
 * Gets the division name from division ID.
 *
 * @param division - Division identifier
 * @returns Division name
 */
export function getDivisionName(divisionId: DivisionNumber): Division | undefined {
  return NUMBER_TO_DIVISION[divisionId]
}

/**
 * Determines the division based on the rank string.
 * Based on the logic from basho.js.
 *
 * @param rank - Rank string (e.g., "Maegashira #17", "Juryo #10")
 * @returns Division identifier or undefined if not found
 */
export function getDivisionByRank(rank: string): Division | undefined {
  const clean = rank.trim()

  // 1) Try English pattern first (e.g., "Maegashira #6", "Juryo #10")
  const enMatch = clean.match(/([A-Za-z]+)(?:\s#(\d+))?/)
  if (enMatch) {
    const [, enName] = enMatch
    if (enName !== undefined) {
      const rankToDivision: Record<string, Division> = {
        Yokozuna: DIVISION.MAKUUCHI,
        Ozeki: DIVISION.MAKUUCHI,
        Sekiwake: DIVISION.MAKUUCHI,
        Komusubi: DIVISION.MAKUUCHI,
        Maegashira: DIVISION.MAKUUCHI,
        Juryo: DIVISION.JURYO,
        Makushita: DIVISION.MAKUSHITA,
        Sandanme: DIVISION.SANDANME,
        Jonidan: DIVISION.JONIDAN,
        Jonokuchi: DIVISION.JONOKUCHI,
      }
      const div = rankToDivision[enName]
      if (div) return div
    }
  }

  // 2) Fallback: Japanese rank terms (e.g., "横綱", "前頭六枚目", "十両")
  for (const [jp, enLower] of Object.entries(ranksDictionaryJp)) {
    if (clean.startsWith(jp)) {
      // Map english-lower to title case for reuse in same map
      const enTitle = enLower.charAt(0).toUpperCase() + enLower.slice(1)
      const rankToDivision: Record<string, Division> = {
        Yokozuna: DIVISION.MAKUUCHI,
        Ozeki: DIVISION.MAKUUCHI,
        Sekiwake: DIVISION.MAKUUCHI,
        Komusubi: DIVISION.MAKUUCHI,
        Maegashira: DIVISION.MAKUUCHI,
        Juryo: DIVISION.JURYO,
        Makushita: DIVISION.MAKUSHITA,
        Sandanme: DIVISION.SANDANME,
        Jonidan: DIVISION.JONIDAN,
        Jonokuchi: DIVISION.JONOKUCHI,
      }
      return rankToDivision[enTitle]
    }
  }

  return undefined
}

/**
 * Converts English division name to division type
 *
 * @param divisionName - English division name (e.g., 'makuuchi', 'juryo')
 * @returns Division type
 */
export function getDivision(divisionName: string): Division {
  if (!isValidDivisionEn(divisionName)) {
    throw new Error(
      `Invalid division name: ${divisionName}. Available divisions: makuuchi, juryo, makushita, sandanme, jonidan, jonokuchi`,
    )
  }
  const value = Object.values(DIVISION).find((d) => d.toLowerCase() === divisionName)
  return value as Division
}

/**
 * Gets available division names
 *
 * @returns Array of available division names
 */
export function getAvailableDivisions(): string[] {
  return Object.values(DIVISION_NAME_TO_DIVISION).map((d) => d.toLowerCase())
}

/**
 * Converts division number to division name
 *
 * @param divisionNumber - Division number (1-6)
 * @returns Division name or undefined if invalid
 */
export function getDivisionNameFromNumber(divisionNumber: number): string | undefined {
  const division = NUMBER_TO_DIVISION[divisionNumber as DivisionNumber]
  return division ? division.toLowerCase() : undefined
}

/**
 * Gets division number to name mappings for display purposes
 *
 * @returns Array of strings showing number=name mappings
 */
export function getDivisionNumberMappings(): string[] {
  return Object.entries(NUMBER_TO_DIVISION).map(([number, division]) => `${number}=${division.toLowerCase()}`)
}
