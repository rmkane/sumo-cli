import { TournamentConstants } from '@/constants'
import type { Rikishi } from '@/types'

const DIVISION_HIERARCHY: Record<string, number> = {
  Yokozuna: 1,
  Ozeki: 2,
  Sekiwake: 3,
  Komusubi: 4,
  Maegashira: 5,
  Juryo: 6,
  Makushita: 7,
  Sandanme: 8,
  Jonidan: 9,
  Jonokuchi: 10,
}

/**
 * Gets the hierarchy order for division sorting (lower number = higher rank)
 */
export function getDivisionHierarchyOrder(division: string): number {
  return DIVISION_HIERARCHY[division] ?? TournamentConstants.FALLBACK_HIERARCHY // Put unknown divisions at the end
}

/**
 * Sorts rikishi by division hierarchy (Yokozuna > Ozeki > Sekiwake > etc.)
 *
 * @param a - First rikishi
 * @param b - Second rikishi
 * @returns Comparison result (-1, 0, 1)
 */
export function sortDivision(a: Rikishi, b: Rikishi): number {
  const divisionA = a.rank?.division ?? 'Z' // Put rikishi without rank at the end
  const divisionB = b.rank?.division ?? 'Z'

  if (divisionA !== divisionB) {
    return getDivisionHierarchyOrder(divisionA) - getDivisionHierarchyOrder(divisionB)
  }

  return 0 // Same division, no preference
}

/**
 * Sorts rikishi by rank position (lower position = higher rank)
 *
 * @param a - First rikishi
 * @param b - Second rikishi
 * @returns Comparison result (-1, 0, 1)
 */
export function sortRank(a: Rikishi, b: Rikishi): number {
  const rankA = a.rank?.position ?? TournamentConstants.FALLBACK_HIERARCHY // Put rikishi without rank at the end
  const rankB = b.rank?.position ?? TournamentConstants.FALLBACK_HIERARCHY

  return rankA - rankB
}

/**
 * Sorts rikishi by side (East comes before West)
 *
 * @param a - First rikishi
 * @param b - Second rikishi
 * @returns Comparison result (-1, 0, 1)
 */
export function sortSide(a: Rikishi, b: Rikishi): number {
  const sideA = a.rank?.side ?? 'Z' // Put rikishi without side at the end
  const sideB = b.rank?.side ?? 'Z'

  if (sideA !== sideB) {
    // East comes before West
    if (sideA === 'East') return -1
    if (sideB === 'East') return 1
    return sideA.localeCompare(sideB)
  }

  return 0 // Same side, no preference
}

/**
 * Sorts rikishi by English name alphabetically
 *
 * @param a - First rikishi
 * @param b - Second rikishi
 * @returns Comparison result (-1, 0, 1)
 */
export function sortByName(a: Rikishi, b: Rikishi): number {
  const nameA = a.english.toLowerCase()
  const nameB = b.english.toLowerCase()
  return nameA.localeCompare(nameB)
}

/**
 * Sorts rikishi by division hierarchy, then rank position, then side, then English name
 * This is the default comprehensive sorting for rikishi lists
 *
 * @param a - First rikishi
 * @param b - Second rikishi
 * @returns Comparison result (-1, 0, 1)
 */
export function sortRikishi(a: Rikishi, b: Rikishi): number {
  // First sort by division hierarchy
  const divisionResult = sortDivision(a, b)
  if (divisionResult !== 0) {
    return divisionResult
  }

  // Then sort by rank position
  const rankResult = sortRank(a, b)
  if (rankResult !== 0) {
    return rankResult
  }

  // Then sort by side (East before West)
  const sideResult = sortSide(a, b)
  if (sideResult !== 0) {
    return sideResult
  }

  // Finally sort by English name alphabetically
  return sortByName(a, b)
}
