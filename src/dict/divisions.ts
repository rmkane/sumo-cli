import { invertDict } from '@/utils/object'

// English to Japanese divisions dictionary (sorted alphabetically)
export const divisionsDictionaryEn = {
  makuuchi: '幕内', // Rank 1
  juryo: '十両', // Rank 2
  sandanme: '三段目', // Rank 3
  makushita: '幕下', // Rank 4
  jonidan: '序二段', // Rank 5
  jonokuchi: '序ノ口', // Rank 6
} as const

export const divisionsDictionaryJp = invertDict(divisionsDictionaryEn)

export type DivisionJapanese = keyof typeof divisionsDictionaryJp
export type DivisionEnglish = (typeof divisionsDictionaryJp)[DivisionJapanese]

/**
 * Lookup English division from Japanese text
 */
export function lookupDivision(japanese: string): DivisionEnglish | undefined {
  return divisionsDictionaryJp[japanese as DivisionJapanese]
}

/**
 * Lookup Japanese division from English text
 */
export function lookupDivisionEn(english: string): DivisionJapanese | undefined {
  return divisionsDictionaryEn[english as keyof typeof divisionsDictionaryEn]
}

/**
 * Check if a Japanese text is a valid division
 */
export function isValidDivision(japanese: string): japanese is DivisionJapanese {
  return japanese in divisionsDictionaryJp
}

/**
 * Check if an English text is a valid division
 */
export function isValidDivisionEn(english: string): english is keyof typeof divisionsDictionaryEn {
  return english in divisionsDictionaryEn
}

/**
 * Get all Japanese division terms
 */
export function getAllJapaneseDivisions(): DivisionJapanese[] {
  return Object.keys(divisionsDictionaryJp) as DivisionJapanese[]
}

/**
 * Get all English division terms (sorted alphabetically)
 */
export function getAllEnglishDivisions(): (keyof typeof divisionsDictionaryEn)[] {
  return Object.keys(divisionsDictionaryEn) as (keyof typeof divisionsDictionaryEn)[]
}
