import { toRomaji } from 'wanakana';

// Wrapper function to convert long vowels to macrons
export function toRomajiWithMacrons(text: string): string {
  const romaji = toRomaji(text);

  return romaji
    .replace(/aa/g, 'ā')
    .replace(/ii/g, 'ī')
    .replace(/uu/g, 'ū')
    .replace(/ee/g, 'ē')
    .replace(/oo/g, 'ō')
    .replace(/ou/g, 'ō') // おう → ō
    .replace(/ei/g, 'ē') // えい → ē
    .replace(/yuu/g, 'yū') // ゆう → yū
    .replace(/ryuu/g, 'ryū') // りゅう → ryū
    .replace(/kyuu/g, 'kyū') // きゅう → kyū
    .replace(/shuu/g, 'shū') // しゅう → shū
    .replace(/chuu/g, 'chū') // ちゅう → chū
    .replace(/nyuu/g, 'nyū') // にゅう → nyū
    .replace(/hyuu/g, 'hyū') // ひゅう → hyū
    .replace(/myuu/g, 'myū') // みゅう → myū
    .replace(/gyuu/g, 'gyū') // ぎゅう → gyū
    .replace(/juu/g, 'jū') // じゅう → jū
    .replace(/byuu/g, 'byū') // びゅう → byū
    .replace(/pyuu/g, 'pyū') // ぴゅう → pyū
    .replace(/riyuu/g, 'ryū') // Fix for りゅう → ryū
    .replace(/shou/g, 'shō') // しょう → shō
    .replace(/chou/g, 'chō') // ちょう → chō
    .replace(/kyou/g, 'kyō') // きょう → kyō
    .replace(/ryou/g, 'ryō') // りょう → ryō
    .replace(/hyou/g, 'hyō') // ひょう → hyō
    .replace(/myou/g, 'myō') // みょう → myō
    .replace(/gyou/g, 'gyō') // ぎょう → gyō
    .replace(/jyou/g, 'jō') // じょう → jō
    .replace(/byou/g, 'byō') // びょう → byō
    .replace(/pyou/g, 'pyō'); // ぴょう → pyō
}

export function convertDiacriticsToAscii(inputString: string): string {
  // Normalize the string to NFD (Normalization Form D).
  // This separates base characters from their diacritical marks.
  const normalizedString = inputString.normalize('NFD');

  // Use a regular expression to remove Unicode characters in the range
  // U+0300 to U+036F, which correspond to combining diacritical marks.
  const asciiString = normalizedString.replace(/[\u0300-\u036f]/g, '');

  return asciiString;
}
