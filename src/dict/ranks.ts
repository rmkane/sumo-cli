import { invertDict } from '@/utils/object'

// English to Japanese ranks dictionary (sorted alphabetically)
export const ranksDictionaryEn = {
  yokozuna: '横綱', // Rank 1
  ozeki: '大関', // Rank 1
  sekiwake: '関脇', // Rank 1
  komusubi: '小結', // Rank 1
  maegashira: '前頭', // Rank 1
  juryo: '十両', // Rank 2
  makushita: '幕下', // Rank 3
  sandanme: '三段目', // Rank 4
  jonidan: '序二段', // Rank 5
  jonokuchi: '序ノ口', // Rank 6
} as const

export const ranksDictionaryJp = invertDict(ranksDictionaryEn)

export type RankJapanese = keyof typeof ranksDictionaryJp
export type RankEnglish = (typeof ranksDictionaryJp)[RankJapanese]

/**
 * Lookup English rank from Japanese text
 */
export function lookupRank(japanese: string): RankEnglish | undefined {
  return ranksDictionaryJp[japanese as RankJapanese]
}

/**
 * Lookup Japanese rank from English text
 */
export function lookupRankEn(english: string): RankJapanese | undefined {
  return ranksDictionaryEn[english as keyof typeof ranksDictionaryEn]
}

/**
 * Check if a Japanese text is a valid rank
 */
export function isValidRank(japanese: string): japanese is RankJapanese {
  return japanese in ranksDictionaryJp
}

/**
 * Check if an English text is a valid rank
 */
export function isValidRankEn(english: string): english is keyof typeof ranksDictionaryEn {
  return english in ranksDictionaryEn
}

/**
 * Get all Japanese rank terms
 */
export function getAllJapaneseRanks(): RankJapanese[] {
  return Object.keys(ranksDictionaryJp) as RankJapanese[]
}

/**
 * Get all English rank terms (sorted alphabetically)
 */
export function getAllEnglishRanks(): (keyof typeof ranksDictionaryEn)[] {
  return Object.keys(ranksDictionaryEn) as (keyof typeof ranksDictionaryEn)[]
}
