import { beforeEach, describe, expect, it, vi } from 'vitest'

import { isValidDivisionEn } from '@/dict/divisions'
import {
  getAvailableDivisions,
  getDivisionByRank,
  getDivisionName,
  getDivisionNameFromNumber,
  getDivisionNumberMappings,
  getDivisionType,
} from '@/utils/division'

// Mock the dependencies
vi.mock('@/constants', () => ({
  Division: {
    MAKUUCHI: 1,
    JURYO: 2,
    MAKUSHITA: 3,
    SANDANME: 4,
    JONIDAN: 5,
    JONOKUCHI: 6,
  },
}))

vi.mock('@/dict/divisions', () => ({
  isValidDivisionEn: vi.fn(),
}))

vi.mock('@/utils/object', () => ({
  invertDict: vi.fn((obj, options) => {
    // Mock the invertDict function to return the expected structure
    const result: Record<string, string> = {}
    for (const [key, value] of Object.entries(obj)) {
      const newKey = options?.originalKeyMap !== undefined ? options.originalKeyMap(key) : key
      result[value as string] = newKey
    }
    return result
  }),
}))

const mockIsValidDivisionEn = vi.mocked(isValidDivisionEn)

describe('Division Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getDivisionName', () => {
    it('should return correct division names for valid IDs', () => {
      expect(getDivisionName(1)).toBe('makuuchi')
      expect(getDivisionName(2)).toBe('juryo')
      expect(getDivisionName(3)).toBe('makushita')
      expect(getDivisionName(4)).toBe('sandanme')
      expect(getDivisionName(5)).toBe('jonidan')
      expect(getDivisionName(6)).toBe('jonokuchi')
    })

    it('should return unknown for invalid division ID', () => {
      expect(getDivisionName(0 as never)).toBe('unknown')
      expect(getDivisionName(7 as never)).toBe('unknown')
      expect(getDivisionName(-1 as never)).toBe('unknown')
    })
  })

  describe('getDivisionByRank', () => {
    it('should return correct division for Makuuchi ranks', () => {
      expect(getDivisionByRank('Yokozuna')).toBe(1)
      expect(getDivisionByRank('Ozeki')).toBe(1)
      expect(getDivisionByRank('Sekiwake')).toBe(1)
      expect(getDivisionByRank('Komusubi')).toBe(1)
      expect(getDivisionByRank('Maegashira')).toBe(1)
      expect(getDivisionByRank('Maegashira #5')).toBe(1)
      expect(getDivisionByRank('Maegashira #17')).toBe(1)
    })

    it('should return correct division for other ranks', () => {
      expect(getDivisionByRank('Juryo')).toBe(2)
      expect(getDivisionByRank('Juryo #10')).toBe(2)
      expect(getDivisionByRank('Makushita')).toBe(3)
      expect(getDivisionByRank('Makushita #15')).toBe(3)
      expect(getDivisionByRank('Sandanme')).toBe(4)
      expect(getDivisionByRank('Sandanme #20')).toBe(4)
      expect(getDivisionByRank('Jonidan')).toBe(5)
      expect(getDivisionByRank('Jonidan #25')).toBe(5)
      expect(getDivisionByRank('Jonokuchi')).toBe(6)
      expect(getDivisionByRank('Jonokuchi #30')).toBe(6)
    })

    it('should return undefined for invalid rank strings', () => {
      expect(getDivisionByRank('')).toBe(undefined)
      expect(getDivisionByRank('InvalidRank')).toBe(undefined)
      expect(getDivisionByRank('123')).toBe(undefined)
      expect(getDivisionByRank('#5')).toBe(undefined)
    })

    it('should handle partial rank strings', () => {
      // "Maegashira #" matches the regex and returns Maegashira division
      expect(getDivisionByRank('Maegashira #')).toBe(1)
    })

    it('should handle case variations', () => {
      expect(getDivisionByRank('yokozuna')).toBe(undefined) // Case sensitive
      expect(getDivisionByRank('MAEGASHIRA')).toBe(undefined) // Case sensitive
    })
  })

  describe('getDivisionType', () => {
    it('should return correct division type for valid names', () => {
      mockIsValidDivisionEn.mockReturnValue(true)

      expect(getDivisionType('makuuchi')).toBe(1)
      expect(getDivisionType('juryo')).toBe(2)
      expect(getDivisionType('makushita')).toBe(3)
      expect(getDivisionType('sandanme')).toBe(4)
      expect(getDivisionType('jonidan')).toBe(5)
      expect(getDivisionType('jonokuchi')).toBe(6)
    })

    it('should throw error for invalid division names', () => {
      mockIsValidDivisionEn.mockReturnValue(false)

      expect(() => getDivisionType('invalid')).toThrow(
        'Invalid division name: invalid. Available divisions: makuuchi, juryo, makushita, sandanme, jonidan, jonokuchi',
      )

      expect(() => getDivisionType('')).toThrow(
        'Invalid division name: . Available divisions: makuuchi, juryo, makushita, sandanme, jonidan, jonokuchi',
      )
    })

    it('should call isValidDivisionEn with correct parameter', () => {
      mockIsValidDivisionEn.mockReturnValue(true)

      getDivisionType('makuuchi')

      expect(mockIsValidDivisionEn).toHaveBeenCalledWith('makuuchi')
    })
  })

  describe('getAvailableDivisions', () => {
    it('should return array of available division names', () => {
      const divisions = getAvailableDivisions()

      expect(Array.isArray(divisions)).toBe(true)
      expect(divisions).toContain('makuuchi')
      expect(divisions).toContain('juryo')
      expect(divisions).toContain('makushita')
      expect(divisions).toContain('sandanme')
      expect(divisions).toContain('jonidan')
      expect(divisions).toContain('jonokuchi')
      expect(divisions).toHaveLength(6)
    })
  })

  describe('getDivisionNameFromNumber', () => {
    it('should return correct division name for valid numbers', () => {
      expect(getDivisionNameFromNumber(1)).toBe('makuuchi')
      expect(getDivisionNameFromNumber(2)).toBe('juryo')
      expect(getDivisionNameFromNumber(3)).toBe('makushita')
      expect(getDivisionNameFromNumber(4)).toBe('sandanme')
      expect(getDivisionNameFromNumber(5)).toBe('jonidan')
      expect(getDivisionNameFromNumber(6)).toBe('jonokuchi')
    })

    it('should return null for invalid division numbers', () => {
      expect(getDivisionNameFromNumber(0)).toBe(null)
      expect(getDivisionNameFromNumber(7)).toBe(null)
      expect(getDivisionNameFromNumber(-1)).toBe(null)
      expect(getDivisionNameFromNumber(10)).toBe(null)
    })
  })

  describe('getDivisionNumberMappings', () => {
    it('should return array of number=name mappings', () => {
      const mappings = getDivisionNumberMappings()

      expect(Array.isArray(mappings)).toBe(true)
      expect(mappings).toContain('1=makuuchi')
      expect(mappings).toContain('2=juryo')
      expect(mappings).toContain('3=makushita')
      expect(mappings).toContain('4=sandanme')
      expect(mappings).toContain('5=jonidan')
      expect(mappings).toContain('6=jonokuchi')
      expect(mappings).toHaveLength(6)
    })

    it('should have correct format for each mapping', () => {
      const mappings = getDivisionNumberMappings()

      mappings.forEach((mapping) => {
        expect(mapping).toMatch(/^\d+=[a-z]+$/)
      })
    })
  })

  describe('Integration tests', () => {
    it('should maintain consistency between different functions', () => {
      const availableDivisions = getAvailableDivisions()
      const mappings = getDivisionNumberMappings()

      // Each available division should have a corresponding mapping
      availableDivisions.forEach((division) => {
        const mapping = mappings.find((m) => m.endsWith(`=${division}`))
        expect(mapping).toBeDefined()

        const [index = '0'] = mapping?.split('=') ?? []
        const number = parseInt(index, 10)
        expect(getDivisionNameFromNumber(number)).toBe(division)
        expect(getDivisionName(number as never)).toBe(division)
      })
    })

    it('should handle edge cases consistently', () => {
      // Invalid inputs should be handled gracefully
      expect(getDivisionName(999 as never)).toBe('unknown')
      expect(getDivisionNameFromNumber(999)).toBe(null)
      expect(getDivisionByRank('InvalidRank')).toBe(undefined)
    })
  })
})
