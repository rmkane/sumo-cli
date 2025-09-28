import { DIVISION, DIVISION_TO_NUMBER } from '@/constants'
import type { Division, ProcessorFn } from '@/types'

/**
 * Utility for iterating over all sumo divisions.
 * Provides common patterns for processing divisions in parallel or sequentially.
 */

/**
 * Processes all divisions in parallel using the provided function.
 *
 * @param processor - Function to process each division
 * @returns Promise that resolves when all divisions are processed
 *
 * @example
 * ```typescript
 * await processAllDivisions(async (divisionName, divisionId) => {
 *   await processDivision(divisionName, divisionId, forceRefresh)
 * })
 * ```
 */
export async function processAllDivisions<T>(processor: ProcessorFn<T>): Promise<T[]> {
  const divisionPromises = Object.entries(DIVISION_TO_NUMBER).map(([divisionName, divisionId]) => {
    return processor(divisionName as Division, divisionId)
  })
  return Promise.all(divisionPromises)
}

/**
 * Processes all divisions sequentially using the provided function.
 *
 * @param processor - Function to process each division
 * @returns Promise that resolves when all divisions are processed
 *
 * @example
 * ```typescript
 * await processAllDivisionsSequentially(async (divisionName, divisionId) => {
 *   await processDivision(divisionName, divisionId, forceRefresh)
 * })
 * ```
 */
export async function processAllDivisionsSequentially<T>(processor: ProcessorFn<T>): Promise<T[]> {
  const results: T[] = []
  for (const [divisionName, divisionId] of Object.entries(DIVISION_TO_NUMBER)) {
    const result = await processor(divisionName as Division, divisionId)
    results.push(result)
  }
  return results
}

/**
 * Gets all division entries as an array.
 *
 * @returns Array of [divisionName, divisionId] tuples
 */
export function getAllDivisions(): Array<[string, Division]> {
  return Object.entries(DIVISION) as Array<[string, Division]>
}
