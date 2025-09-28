import type { Division, DivisionNumber } from '@/types'

/**
 * Standardized filename generation for matchup data
 * @param day - Tournament day (1-15)
 * @param divisionId - Division identifier
 * @param divisionName - Human-readable division name
 * @param extension - File extension (without dot)
 * @returns Standardized filename
 */
export function generateMatchupFilename(
  day: number,
  divisionName: Division,
  divisionId: DivisionNumber,
  extension: string,
): string {
  const paddedDay = day.toString().padStart(2, '0')
  return `day_${paddedDay}_${divisionId}_${divisionName.toLowerCase()}.${extension}`
}

/**
 * Standardized filename generation for rikishi data
 * @param divisionId - Division identifier
 * @param divisionName - Human-readable division name
 * @param extension - File extension (without dot)
 * @returns Standardized filename
 */
export function generateRikishiFilename(divisionName: Division, divisionId: DivisionNumber, extension: string): string {
  return `${divisionId}_${divisionName.toLowerCase()}_rikishi.${extension}`
}
