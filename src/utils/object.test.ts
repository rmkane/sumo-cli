import { describe, it, expect } from 'vitest'

import { getKeyByValue } from './object'

describe('Object Utilities', () => {
  describe('getKeyByValue', () => {
    it('should find key for existing value', () => {
      const obj = { a: 1, b: 2, c: 3 }
      expect(getKeyByValue(obj, 1)).toBe('a')
      expect(getKeyByValue(obj, 2)).toBe('b')
      expect(getKeyByValue(obj, 3)).toBe('c')
    })

    it('should return "unknown" for non-existent value', () => {
      const obj = { a: 1, b: 2, c: 3 }
      expect(getKeyByValue(obj, 5)).toBe('unknown')
      expect(getKeyByValue(obj, 'test' as any)).toBe('unknown')
      expect(getKeyByValue(obj, null as any)).toBe('unknown')
      expect(getKeyByValue(obj, undefined as any)).toBe('unknown')
    })

    it('should handle string values', () => {
      const obj = { name: 'John', city: 'Tokyo', country: 'Japan' }
      expect(getKeyByValue(obj, 'John')).toBe('name')
      expect(getKeyByValue(obj, 'Tokyo')).toBe('city')
      expect(getKeyByValue(obj, 'Japan')).toBe('country')
    })

    it('should handle boolean values', () => {
      const obj = { active: true, verified: false, premium: true }
      expect(getKeyByValue(obj, true)).toBe('active') // Returns first match
      expect(getKeyByValue(obj, false)).toBe('verified')
    })

    it('should handle null and undefined values', () => {
      const obj = { a: null, b: undefined, c: 0 }
      expect(getKeyByValue(obj, null)).toBe('a')
      expect(getKeyByValue(obj, undefined)).toBe('b')
      expect(getKeyByValue(obj, 0)).toBe('c')
    })

    it('should handle empty objects', () => {
      const obj: Record<string, any> = {}
      expect(getKeyByValue(obj, 'any')).toBe('unknown')
      expect(getKeyByValue(obj, 1)).toBe('unknown')
      expect(getKeyByValue(obj, null)).toBe('unknown')
    })

    it('should handle objects with duplicate values', () => {
      const obj = { a: 1, b: 1, c: 2, d: 1 }
      expect(getKeyByValue(obj, 1)).toBe('a') // Returns first match
      expect(getKeyByValue(obj, 2)).toBe('c')
    })

    it('should handle nested objects and arrays', () => {
      const nestedObj = { a: { x: 1 }, b: [1, 2, 3], c: 'string' }
      expect(getKeyByValue(nestedObj, nestedObj.a)).toBe('a') // Use reference equality
      expect(getKeyByValue(nestedObj, nestedObj.b)).toBe('b') // Use reference equality
      expect(getKeyByValue(nestedObj, 'string')).toBe('c')
    })

    it('should handle objects with different value types', () => {
      const mixedObj = {
        string: 'hello',
        number: 42,
        boolean: true,
        null: null,
        undefined: undefined,
        array: [1, 2, 3],
        object: { key: 'value' },
      }

      expect(getKeyByValue(mixedObj, 'hello')).toBe('string')
      expect(getKeyByValue(mixedObj, 42)).toBe('number')
      expect(getKeyByValue(mixedObj, true)).toBe('boolean')
      expect(getKeyByValue(mixedObj, null)).toBe('null')
      expect(getKeyByValue(mixedObj, undefined)).toBe('undefined')
      expect(getKeyByValue(mixedObj, mixedObj.array)).toBe('array') // Use reference equality
      expect(getKeyByValue(mixedObj, mixedObj.object)).toBe('object') // Use reference equality
    })

    it('should handle sumo-specific objects', () => {
      const sumoRanks = {
        yokozuna: '横綱',
        ozeki: '大関',
        sekiwake: '関脇',
        komusubi: '小結',
        maegashira: '前頭',
      }

      expect(getKeyByValue(sumoRanks, '横綱')).toBe('yokozuna')
      expect(getKeyByValue(sumoRanks, '大関')).toBe('ozeki')
      expect(getKeyByValue(sumoRanks, '関脇')).toBe('sekiwake')
      expect(getKeyByValue(sumoRanks, '小結')).toBe('komusubi')
      expect(getKeyByValue(sumoRanks, '前頭')).toBe('maegashira')
    })

    it('should handle objects with numeric keys', () => {
      const obj = { '1': 'one', '2': 'two', '3': 'three' }
      expect(getKeyByValue(obj, 'one')).toBe('1')
      expect(getKeyByValue(obj, 'two')).toBe('2')
      expect(getKeyByValue(obj, 'three')).toBe('3')
    })

    it('should handle objects with special characters in keys', () => {
      const obj = {
        'key-with-dash': 'value1',
        key_with_underscore: 'value2',
        keyWithCamelCase: 'value3',
      }
      expect(getKeyByValue(obj, 'value1')).toBe('key-with-dash')
      expect(getKeyByValue(obj, 'value2')).toBe('key_with_underscore')
      expect(getKeyByValue(obj, 'value3')).toBe('keyWithCamelCase')
    })

    it('should handle case-sensitive string matching', () => {
      const obj = { name: 'John', Name: 'Jane', NAME: 'Bob' }
      expect(getKeyByValue(obj, 'John')).toBe('name')
      expect(getKeyByValue(obj, 'Jane')).toBe('Name')
      expect(getKeyByValue(obj, 'Bob')).toBe('NAME')
      expect(getKeyByValue(obj, 'john')).toBe('unknown') // Case sensitive
    })

    it('should handle objects with function values', () => {
      const func1 = () => 'test1'
      const func2 = () => 'test2'
      const obj = { a: func1, b: func2 }

      expect(getKeyByValue(obj, func1)).toBe('a')
      expect(getKeyByValue(obj, func2)).toBe('b')
      expect(getKeyByValue(obj, () => 'test1')).toBe('unknown') // Different function reference
    })

    it('should handle objects with symbol values', () => {
      const sym1 = Symbol('test1')
      const sym2 = Symbol('test2')
      const obj = { a: sym1, b: sym2 }

      expect(getKeyByValue(obj, sym1)).toBe('a')
      expect(getKeyByValue(obj, sym2)).toBe('b')
      expect(getKeyByValue(obj, Symbol('test1'))).toBe('unknown') // Different symbol
    })

    it('should handle large objects', () => {
      const largeObj: Record<string, number> = {}
      for (let i = 0; i < 1000; i++) {
        largeObj[`key${i}`] = i
      }

      expect(getKeyByValue(largeObj, 0)).toBe('key0')
      expect(getKeyByValue(largeObj, 999)).toBe('key999')
      expect(getKeyByValue(largeObj, 1000)).toBe('unknown')
    })

    it('should handle objects with inherited properties', () => {
      const parent = { inherited: 'parent value' }
      const child = Object.create(parent)
      child.own = 'child value'

      expect(getKeyByValue(child, 'child value')).toBe('own')
      expect(getKeyByValue(child, 'parent value')).toBe('unknown') // Only searches own properties
    })

    it('should handle objects with non-enumerable properties', () => {
      const obj: Record<string, any> = { visible: 'visible value' }
      Object.defineProperty(obj, 'hidden', {
        value: 'hidden value',
        enumerable: false,
      })

      expect(getKeyByValue(obj, 'visible value')).toBe('visible')
      expect(getKeyByValue(obj, 'hidden value')).toBe('unknown') // Non-enumerable properties are not found
    })

    it('should handle edge cases with falsy values', () => {
      const obj = {
        zero: 0,
        emptyString: '',
        false: false,
        null: null,
        undefined: undefined,
        nan: NaN,
      }

      expect(getKeyByValue(obj, 0)).toBe('zero')
      expect(getKeyByValue(obj, '')).toBe('emptyString')
      expect(getKeyByValue(obj, false)).toBe('false')
      expect(getKeyByValue(obj, null)).toBe('null')
      expect(getKeyByValue(obj, undefined)).toBe('undefined')
      expect(getKeyByValue(obj, NaN)).toBe('unknown') // NaN !== NaN in JavaScript
    })

    it('should handle objects with Date values', () => {
      const date1 = new Date('2023-01-01')
      const date2 = new Date('2023-01-02')
      const obj = { start: date1, end: date2 }

      expect(getKeyByValue(obj, date1)).toBe('start')
      expect(getKeyByValue(obj, date2)).toBe('end')
      expect(getKeyByValue(obj, new Date('2023-01-01'))).toBe('unknown') // Different Date object
    })

    it('should handle objects with RegExp values', () => {
      const regex1 = /test1/
      const regex2 = /test2/
      const obj = { pattern1: regex1, pattern2: regex2 }

      expect(getKeyByValue(obj, regex1)).toBe('pattern1')
      expect(getKeyByValue(obj, regex2)).toBe('pattern2')
      expect(getKeyByValue(obj, /test1/)).toBe('unknown') // Different RegExp object
    })
  })

  describe('Integration Tests', () => {
    it('should work with typical sumo data structures', () => {
      const rikishiData = {
        name: '大関 関脇',
        rank: 'ozeki',
        wins: 10,
        losses: 5,
        active: true,
        debut: new Date('2020-01-01'),
      }

      expect(getKeyByValue(rikishiData, '大関 関脇')).toBe('name')
      expect(getKeyByValue(rikishiData, 'ozeki')).toBe('rank')
      expect(getKeyByValue(rikishiData, 10)).toBe('wins')
      expect(getKeyByValue(rikishiData, 5)).toBe('losses')
      expect(getKeyByValue(rikishiData, true)).toBe('active')
      expect(getKeyByValue(rikishiData, rikishiData.debut)).toBe('debut')
    })

    it('should work with configuration objects', () => {
      const config = {
        apiUrl: 'https://sumo.or.jp/api',
        timeout: 30000,
        retries: 3,
        debug: false,
        divisions: ['makuuchi', 'juryo', 'makushita'],
      }

      expect(getKeyByValue(config, 'https://sumo.or.jp/api')).toBe('apiUrl')
      expect(getKeyByValue(config, 30000)).toBe('timeout')
      expect(getKeyByValue(config, 3)).toBe('retries')
      expect(getKeyByValue(config, false)).toBe('debug')
      expect(getKeyByValue(config, config.divisions)).toBe('divisions') // Use reference equality
    })

    it('should handle complex nested scenarios', () => {
      const complexObj = {
        metadata: {
          version: '1.0.0',
          author: 'Ryan Kane',
        },
        data: [
          { id: 1, name: 'Rikishi 1' },
          { id: 2, name: 'Rikishi 2' },
        ],
        settings: {
          cache: true,
          maxRetries: 5,
        },
      }

      expect(getKeyByValue(complexObj, complexObj.metadata)).toBe('metadata') // Use reference equality
      expect(getKeyByValue(complexObj, complexObj.data)).toBe('data') // Use reference equality
      expect(getKeyByValue(complexObj, complexObj.settings)).toBe('settings') // Use reference equality
    })
  })
})
