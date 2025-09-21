// Japanese to English dictionaries
export { kimariteDictionaryJp } from './kimarite'
export { divisionsDictionaryJp } from './divisions'
export { ranksDictionaryJp } from './ranks'

// English to Japanese dictionaries (sorted alphabetically)
export { kimariteDictionaryEn } from './kimarite'
export { divisionsDictionaryEn } from './divisions'
export { ranksDictionaryEn } from './ranks'

// Kimarite functions
export {
  lookupKimarite,
  lookupKimariteEn,
  isValidKimarite,
  isValidKimariteEn,
  getAllJapaneseKimarite,
  getAllEnglishKimarite,
  type KimariteJapanese,
  type KimariteEnglish,
} from './kimarite'

// Division functions
export {
  lookupDivision,
  lookupDivisionEn,
  isValidDivision,
  isValidDivisionEn,
  getAllJapaneseDivisions,
  getAllEnglishDivisions,
  type DivisionJapanese,
  type DivisionEnglish,
} from './divisions'

// Rank functions
export {
  lookupRank,
  lookupRankEn,
  isValidRank,
  isValidRankEn,
  getAllJapaneseRanks,
  getAllEnglishRanks,
  type RankJapanese,
  type RankEnglish,
} from './ranks'
