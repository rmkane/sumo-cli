import { compareRikishi } from '@/core/utils/banzuke'
import type { Rikishi } from '@/types'

/**
 * Sorts rikishi by English name alphabetically
 *
 * @param a - First rikishi
 * @param b - Second rikishi
 * @returns Comparison result (-1, 0, 1)
 */
export function sortByName(a: Rikishi, b: Rikishi): number {
  const nameA = a.shikona.english.toLowerCase()
  const nameB = b.shikona.english.toLowerCase()
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
  // Use the new compareRikishi function from types.ts
  return compareRikishi(a, b)
}
