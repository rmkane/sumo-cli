import { invertDict } from '@/dict/base'

// English to Japanese divisions dictionary (sorted alphabetically)
export const divisionsDictionaryEn = {
  jonidan: '序二段',
  jonokuchi: '序ノ口',
  juryo: '十両',
  makushita: '幕下',
  makuuchi: '幕内',
  sandanme: '三段目',
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
