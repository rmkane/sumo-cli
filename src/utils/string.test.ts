import { describe, it, expect } from 'vitest';
import {
  capitalize,
  unwrapText,
  normalizeJapaneseText,
  extractNumber,
  isJapaneseOnly,
} from './string';

describe('String Utilities', () => {
  describe('capitalize', () => {
    it('should capitalize first character of normal strings', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('world')).toBe('World');
      expect(capitalize('typescript')).toBe('Typescript');
    });

    it('should handle single character strings', () => {
      expect(capitalize('a')).toBe('A');
      expect(capitalize('z')).toBe('Z');
      expect(capitalize('1')).toBe('1');
      expect(capitalize('!')).toBe('!');
    });

    it('should handle empty strings', () => {
      expect(capitalize('')).toBe('');
    });

    it('should preserve already capitalized strings', () => {
      expect(capitalize('Hello')).toBe('Hello');
      expect(capitalize('WORLD')).toBe('WORLD');
      expect(capitalize('TypeScript')).toBe('TypeScript');
    });

    it('should handle strings starting with numbers', () => {
      expect(capitalize('123abc')).toBe('123abc');
      expect(capitalize('1hello')).toBe('1hello');
      expect(capitalize('42world')).toBe('42world');
    });

    it('should handle strings starting with special characters', () => {
      expect(capitalize('!hello')).toBe('!hello');
      expect(capitalize('@world')).toBe('@world');
      expect(capitalize('#test')).toBe('#test');
    });

    it('should handle strings with mixed case', () => {
      expect(capitalize('hELLO')).toBe('HELLO');
      expect(capitalize('wOrLd')).toBe('WOrLd');
      expect(capitalize('tEsT')).toBe('TEsT');
    });

    it('should handle Japanese text', () => {
      expect(capitalize('こんにちは')).toBe('こんにちは'); // Japanese doesn't have case
      expect(capitalize('大関')).toBe('大関');
      expect(capitalize('関脇')).toBe('関脇');
    });

    it('should handle unicode characters', () => {
      expect(capitalize('ñandú')).toBe('Ñandú');
      expect(capitalize('über')).toBe('Über');
      expect(capitalize('café')).toBe('Café');
    });

    it('should handle whitespace', () => {
      expect(capitalize(' hello')).toBe(' hello');
      expect(capitalize('\thello')).toBe('\thello');
      expect(capitalize('\nhello')).toBe('\nhello');
    });
  });

  describe('unwrapText', () => {
    it('should remove outer parentheses', () => {
      expect(unwrapText('(hello world)')).toBe('hello world');
      expect(unwrapText('(test)')).toBe('test');
      expect(unwrapText('(single)')).toBe('single');
    });

    it('should handle text without parentheses', () => {
      expect(unwrapText('no parentheses')).toBe('no parentheses');
      expect(unwrapText('plain text')).toBe('plain text');
      expect(unwrapText('')).toBe('');
    });

    it('should handle nested parentheses', () => {
      expect(unwrapText('(nested (test))')).toBe('nested (test)');
      expect(unwrapText('(outer (inner) text)')).toBe('outer (inner) text');
      expect(unwrapText('(a (b (c)))')).toBe('a (b (c))');
    });

    it('should handle missing opening parenthesis', () => {
      expect(unwrapText('only closing)')).toBe('only closing'); // trim() removes the closing parenthesis
      expect(unwrapText('text)')).toBe('text'); // trim() removes the closing parenthesis
    });

    it('should handle missing closing parenthesis', () => {
      expect(unwrapText('(only opening')).toBe('only opening');
      expect(unwrapText('(text')).toBe('text');
    });

    it('should trim whitespace', () => {
      expect(unwrapText(' (hello world) ')).toBe('hello world');
      expect(unwrapText('(test) ')).toBe('test');
      expect(unwrapText(' (test)')).toBe('test');
      expect(unwrapText('  (  test  )  ')).toBe('test');
    });

    it('should handle empty parentheses', () => {
      expect(unwrapText('()')).toBe('');
      expect(unwrapText('( )')).toBe('');
      expect(unwrapText('(  )')).toBe('');
    });

    it('should handle single character in parentheses', () => {
      expect(unwrapText('(a)')).toBe('a');
      expect(unwrapText('(1)')).toBe('1');
      expect(unwrapText('(!)')).toBe('!');
    });

    it('should handle Japanese text in parentheses', () => {
      expect(unwrapText('(こんにちは)')).toBe('こんにちは');
      expect(unwrapText('(大関)')).toBe('大関');
      expect(unwrapText('(関脇)')).toBe('関脇');
    });

    it('should handle complex nested scenarios', () => {
      expect(unwrapText('((double nested))')).toBe('(double nested)');
      expect(unwrapText('(outer (inner) more)')).toBe('outer (inner) more');
      expect(unwrapText('(a (b) c (d))')).toBe('a (b) c (d)');
    });

    it('should handle edge cases', () => {
      expect(unwrapText('(')).toBe('');
      expect(unwrapText(')')).toBe(''); // trim() removes the closing parenthesis
      expect(unwrapText('')).toBe('');
      expect(unwrapText('   ')).toBe('');
    });
  });

  describe('normalizeJapaneseText', () => {
    it('should normalize multiple spaces to single space', () => {
      expect(normalizeJapaneseText('hello   world')).toBe('hello world');
      expect(normalizeJapaneseText('こんにちは   世界')).toBe(
        'こんにちは 世界'
      );
      expect(normalizeJapaneseText('a  b   c')).toBe('a b c');
    });

    it('should replace full-width spaces with regular spaces', () => {
      expect(normalizeJapaneseText('こんにちは　世界')).toBe('こんにちは 世界');
      expect(normalizeJapaneseText('大関　関脇')).toBe('大関 関脇');
      expect(normalizeJapaneseText('a　b')).toBe('a b');
    });

    it('should replace line breaks with spaces', () => {
      expect(normalizeJapaneseText('hello\nworld')).toBe('hello world');
      expect(normalizeJapaneseText('大関\n\n関脇')).toBe('大関 関脇');
      expect(normalizeJapaneseText('a\n\n\nb')).toBe('a b');
    });

    it('should trim leading and trailing whitespace', () => {
      expect(normalizeJapaneseText('  hello world  ')).toBe('hello world');
      expect(normalizeJapaneseText('  こんにちは  ')).toBe('こんにちは');
      expect(normalizeJapaneseText('\n\ntest\n\n')).toBe('test');
    });

    it('should handle empty strings', () => {
      expect(normalizeJapaneseText('')).toBe('');
    });

    it('should handle strings with only whitespace', () => {
      expect(normalizeJapaneseText('   ')).toBe('');
      expect(normalizeJapaneseText('\n\n\n')).toBe('');
      expect(normalizeJapaneseText('　　')).toBe('');
    });

    it('should handle mixed whitespace characters', () => {
      expect(normalizeJapaneseText('hello\tworld\nspace　full')).toBe(
        'hello world space full'
      );
      expect(normalizeJapaneseText('大関\t関脇\n前頭　後頭')).toBe(
        '大関 関脇 前頭 後頭'
      );
    });

    it('should preserve Japanese characters', () => {
      expect(normalizeJapaneseText('こんにちは世界')).toBe('こんにちは世界');
      expect(normalizeJapaneseText('大関関脇小結')).toBe('大関関脇小結');
      expect(normalizeJapaneseText('横綱大関関脇小結前頭')).toBe(
        '横綱大関関脇小結前頭'
      );
    });

    it('should handle complex normalization scenarios', () => {
      expect(normalizeJapaneseText('  こんにちは　世界\n\n大関\t関脇  ')).toBe(
        'こんにちは 世界 大関 関脇'
      );
      expect(normalizeJapaneseText('\n\n\n大関\n\n\n関脇\n\n\n')).toBe(
        '大関 関脇'
      );
      expect(normalizeJapaneseText('　　a　　b　　c　　')).toBe('a b c');
    });

    it('should handle mixed language text', () => {
      expect(normalizeJapaneseText('Hello　世界\n\nWorld')).toBe(
        'Hello 世界 World'
      );
      expect(normalizeJapaneseText('大関\tOzeki\n関脇　Sekiwake')).toBe(
        '大関 Ozeki 関脇 Sekiwake'
      );
    });
  });

  describe('extractNumber', () => {
    it('should extract first number from text', () => {
      expect(extractNumber('Age: 25 years')).toBe('25');
      expect(extractNumber('Weight: 150.5kg')).toBe('150');
      expect(extractNumber('Height: 185cm')).toBe('185');
    });

    it('should handle numbers at the beginning', () => {
      expect(extractNumber('123abc')).toBe('123');
      expect(extractNumber('42hello')).toBe('42');
      expect(extractNumber('999world')).toBe('999');
    });

    it('should handle numbers in the middle', () => {
      expect(extractNumber('abc123def')).toBe('123');
      expect(extractNumber('hello42world')).toBe('42');
      expect(extractNumber('test999end')).toBe('999');
    });

    it('should handle numbers at the end', () => {
      expect(extractNumber('abc123')).toBe('123');
      expect(extractNumber('hello42')).toBe('42');
      expect(extractNumber('test999')).toBe('999');
    });

    it('should handle multiple numbers (returns first)', () => {
      expect(extractNumber('123 456 789')).toBe('123');
      expect(extractNumber('abc123def456ghi')).toBe('123');
      expect(extractNumber('1 2 3 4 5')).toBe('1');
    });

    it('should handle decimal numbers (returns integer part)', () => {
      expect(extractNumber('150.5kg')).toBe('150');
      expect(extractNumber('99.99 dollars')).toBe('99');
      expect(extractNumber('3.14159 pi')).toBe('3');
    });

    it('should handle large numbers', () => {
      expect(extractNumber('Population: 1234567')).toBe('1234567');
      expect(extractNumber('Price: 999999')).toBe('999999');
      expect(extractNumber('ID: 1000000')).toBe('1000000');
    });

    it('should handle zero', () => {
      expect(extractNumber('Score: 0')).toBe('0');
      expect(extractNumber('Count: 0 items')).toBe('0');
      expect(extractNumber('0abc')).toBe('0');
    });

    it('should return empty string for text without numbers', () => {
      expect(extractNumber('No numbers here')).toBe('');
      expect(extractNumber('Hello world')).toBe('');
      expect(extractNumber('こんにちは')).toBe('');
      expect(extractNumber('')).toBe('');
    });

    it('should handle Japanese text with numbers', () => {
      expect(extractNumber('年齢: 25歳')).toBe('25');
      expect(extractNumber('体重: 150kg')).toBe('150');
      expect(extractNumber('身長: 185cm')).toBe('185');
    });

    it('should handle special characters with numbers', () => {
      expect(extractNumber('$100')).toBe('100');
      expect(extractNumber('€50.00')).toBe('50');
      expect(extractNumber('¥1000')).toBe('1000');
      expect(extractNumber('100%')).toBe('100');
    });

    it('should handle edge cases', () => {
      expect(extractNumber('  123  ')).toBe('123');
      expect(extractNumber('\n123\n')).toBe('123');
      expect(extractNumber('abc123def')).toBe('123');
    });
  });

  describe('isJapaneseOnly', () => {
    it('should return true for hiragana only', () => {
      expect(isJapaneseOnly('こんにちは')).toBe(true);
      expect(isJapaneseOnly('ありがとう')).toBe(true);
      expect(isJapaneseOnly('お疲れ様')).toBe(true);
    });

    it('should return true for katakana only', () => {
      expect(isJapaneseOnly('コンニチハ')).toBe(true);
      expect(isJapaneseOnly('アリガトウ')).toBe(true);
      expect(isJapaneseOnly('オツカレサマ')).toBe(true);
    });

    it('should return true for kanji only', () => {
      expect(isJapaneseOnly('大関')).toBe(true);
      expect(isJapaneseOnly('関脇')).toBe(true);
      expect(isJapaneseOnly('力士')).toBe(true);
    });

    it('should return true for mixed Japanese characters', () => {
      expect(isJapaneseOnly('大関おおぜき')).toBe(true);
      expect(isJapaneseOnly('関脇せきわけ')).toBe(true);
      expect(isJapaneseOnly('こんにちは世界')).toBe(true);
    });

    it('should return false for English text', () => {
      expect(isJapaneseOnly('Hello')).toBe(false);
      expect(isJapaneseOnly('world')).toBe(false);
      expect(isJapaneseOnly('Hello world')).toBe(false);
    });

    it('should return false for numbers', () => {
      expect(isJapaneseOnly('123')).toBe(false);
      expect(isJapaneseOnly('456')).toBe(false);
      expect(isJapaneseOnly('0')).toBe(false);
    });

    it('should return false for mixed text', () => {
      expect(isJapaneseOnly('Hello 世界')).toBe(false);
      expect(isJapaneseOnly('大関 Ozeki')).toBe(false);
      expect(isJapaneseOnly('123 こんにちは')).toBe(false);
    });

    it('should return false for special characters', () => {
      expect(isJapaneseOnly('!@#$%')).toBe(false);
      expect(isJapaneseOnly('こんにちは!')).toBe(false);
      expect(isJapaneseOnly('大関@関脇')).toBe(false);
    });

    it('should return true for empty string', () => {
      expect(isJapaneseOnly('')).toBe(true);
    });

    it('should return false for whitespace only', () => {
      expect(isJapaneseOnly(' ')).toBe(false);
      expect(isJapaneseOnly('  ')).toBe(false);
      expect(isJapaneseOnly('\n')).toBe(false);
      expect(isJapaneseOnly('\t')).toBe(false);
    });

    it('should handle sumo-specific terms', () => {
      expect(isJapaneseOnly('横綱')).toBe(true);
      expect(isJapaneseOnly('大関')).toBe(true);
      expect(isJapaneseOnly('関脇')).toBe(true);
      expect(isJapaneseOnly('小結')).toBe(true);
      expect(isJapaneseOnly('前頭')).toBe(true);
      expect(isJapaneseOnly('力士')).toBe(true);
    });

    it('should handle common Japanese phrases', () => {
      expect(isJapaneseOnly('こんにちは')).toBe(true);
      expect(isJapaneseOnly('ありがとうございます')).toBe(true);
      expect(isJapaneseOnly('お疲れ様でした')).toBe(true);
      expect(isJapaneseOnly('失礼します')).toBe(true);
    });

    it('should handle edge cases with unicode', () => {
      expect(isJapaneseOnly('あいうえお')).toBe(true);
      expect(isJapaneseOnly('アイウエオ')).toBe(true);
      expect(isJapaneseOnly('漢字')).toBe(true);
      expect(isJapaneseOnly('ひらがなカタカナ漢字')).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    it('should work with typical sumo data processing', () => {
      // Simulate processing scraped sumo data
      const rawData = '  (大関 おおぜき)  ';
      const unwrapped = unwrapText(rawData);
      const normalized = normalizeJapaneseText(unwrapped);
      const hasJapanese = isJapaneseOnly(normalized);

      expect(unwrapped).toBe('大関 おおぜき');
      expect(normalized).toBe('大関 おおぜき');
      expect(hasJapanese).toBe(false); // Contains space
    });

    it('should work with rikishi name processing', () => {
      const rawName = '  (関脇 せきわけ)  ';
      const unwrapped = unwrapText(rawName);
      const normalized = normalizeJapaneseText(unwrapped);
      const capitalized = capitalize(normalized.split(' ')[0]);

      expect(unwrapped).toBe('関脇 せきわけ');
      expect(normalized).toBe('関脇 せきわけ');
      expect(capitalized).toBe('関脇'); // Japanese doesn't change case
    });

    it('should work with statistics processing', () => {
      const rawStats = '  勝数: 10勝  ';
      const normalized = normalizeJapaneseText(rawStats);
      const wins = extractNumber(normalized);

      expect(normalized).toBe('勝数: 10勝');
      expect(wins).toBe('10');
    });

    it('should work with complex data cleaning', () => {
      const rawData = '  (大関　おおぜき\n\n関脇　せきわけ)  ';
      const unwrapped = unwrapText(rawData);
      const normalized = normalizeJapaneseText(unwrapped);
      const parts = normalized.split(' ');

      expect(unwrapped).toBe('大関　おおぜき\n\n関脇　せきわけ');
      expect(normalized).toBe('大関 おおぜき 関脇 せきわけ');
      expect(parts).toEqual(['大関', 'おおぜき', '関脇', 'せきわけ']);
    });

    it('should handle edge cases consistently', () => {
      const edgeCases = ['', ' ', '　', '\n', '\t', '()', '( )', '(  )'];

      edgeCases.forEach((text) => {
        const unwrapped = unwrapText(text);
        const normalized = normalizeJapaneseText(text);
        const hasJapanese = isJapaneseOnly(text);

        expect(typeof unwrapped).toBe('string');
        expect(typeof normalized).toBe('string');
        expect(typeof hasJapanese).toBe('boolean');
      });
    });
  });
});
