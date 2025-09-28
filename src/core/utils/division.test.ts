import { beforeEach, describe, expect, it, vi } from 'vitest'

import { isValidDivisionEn } from '@/core/dict/divisions'
import {
  getAvailableDivisions,
  getDivision,
  getDivisionByRank,
  getDivisionName,
  getDivisionNameFromNumber,
  getDivisionNumberMappings,
} from '@/core/utils/division'

// Mock the dependencies
vi.mock('@/constants', () => ({
  DIVISION: {
    MAKUUCHI: 'Makuuchi',
    JURYO: 'Juryo',
    MAKUSHITA: 'Makushita',
    SANDANME: 'Sandanme',
    JONIDAN: 'Jonidan',
    JONOKUCHI: 'Jonokuchi',
  },
  NUMBER_TO_DIVISION: {
    1: 'Makuuchi',
    2: 'Juryo',
    3: 'Makushita',
    4: 'Sandanme',
    5: 'Jonidan',
    6: 'Jonokuchi',
  },
  DIVISION_NAME_TO_DIVISION: {
    Makuuchi: 'Makuuchi',
    Juryo: 'Juryo',
    Makushita: 'Makushita',
    Sandanme: 'Sandanme',
    Jonidan: 'Jonidan',
    Jonokuchi: 'Jonokuchi',
  },
}))

vi.mock('@/core/dict/divisions', () => ({
  isValidDivisionEn: vi.fn(),
}))

vi.mock('@/core/utils/object', () => ({
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
      expect(getDivisionName(1)).toBe('Makuuchi')
      expect(getDivisionName(2)).toBe('Juryo')
      expect(getDivisionName(3)).toBe('Makushita')
      expect(getDivisionName(4)).toBe('Sandanme')
      expect(getDivisionName(5)).toBe('Jonidan')
      expect(getDivisionName(6)).toBe('Jonokuchi')
    })

    it('should return unknown for invalid division ID', () => {
      expect(getDivisionName(0 as never)).toBe(undefined)
      expect(getDivisionName(7 as never)).toBe(undefined)
      expect(getDivisionName(-1 as never)).toBe(undefined)
    })
  })

  describe('getDivisionByRank', () => {
    it('should return correct division for Makuuchi ranks', () => {
      expect(getDivisionByRank('Yokozuna')).toBe('Makuuchi')
      expect(getDivisionByRank('Ozeki')).toBe('Makuuchi')
      expect(getDivisionByRank('Sekiwake')).toBe('Makuuchi')
      expect(getDivisionByRank('Komusubi')).toBe('Makuuchi')
      expect(getDivisionByRank('Maegashira')).toBe('Makuuchi')
      expect(getDivisionByRank('Maegashira #5')).toBe('Makuuchi')
      expect(getDivisionByRank('Maegashira #17')).toBe('Makuuchi')
    })

    it('should return correct division for other ranks', () => {
      expect(getDivisionByRank('Juryo')).toBe('Juryo')
      expect(getDivisionByRank('Juryo #10')).toBe('Juryo')
      expect(getDivisionByRank('Makushita')).toBe('Makushita')
      expect(getDivisionByRank('Makushita #15')).toBe('Makushita')
      expect(getDivisionByRank('Sandanme')).toBe('Sandanme')
      expect(getDivisionByRank('Sandanme #20')).toBe('Sandanme')
      expect(getDivisionByRank('Jonidan')).toBe('Jonidan')
      expect(getDivisionByRank('Jonidan #25')).toBe('Jonidan')
      expect(getDivisionByRank('Jonokuchi')).toBe('Jonokuchi')
      expect(getDivisionByRank('Jonokuchi #30')).toBe('Jonokuchi')
    })

    it('should return undefined for invalid rank strings', () => {
      expect(getDivisionByRank('')).toBe(undefined)
      expect(getDivisionByRank('InvalidRank')).toBe(undefined)
      expect(getDivisionByRank('123')).toBe(undefined)
      expect(getDivisionByRank('#5')).toBe(undefined)
    })

    it('should handle partial rank strings', () => {
      // "Maegashira #" matches the regex and returns Maegashira division
      expect(getDivisionByRank('Maegashira #')).toBe('Makuuchi')
    })

    it('should handle case variations', () => {
      expect(getDivisionByRank('yokozuna')).toBe(undefined) // Case sensitive
      expect(getDivisionByRank('MAEGASHIRA')).toBe(undefined) // Case sensitive
    })
  })

  describe('getDivision', () => {
    it('should return correct division type for valid names', () => {
      mockIsValidDivisionEn.mockReturnValue(true)

      expect(getDivision('makuuchi')).toBe('Makuuchi')
      expect(getDivision('juryo')).toBe('Juryo')
      expect(getDivision('makushita')).toBe('Makushita')
      expect(getDivision('sandanme')).toBe('Sandanme')
      expect(getDivision('jonidan')).toBe('Jonidan')
      expect(getDivision('jonokuchi')).toBe('Jonokuchi')
    })

    it('should throw error for invalid division names', () => {
      mockIsValidDivisionEn.mockReturnValue(false)

      expect(() => getDivision('invalid')).toThrow(
        'Invalid division name: invalid. Available divisions: makuuchi, juryo, makushita, sandanme, jonidan, jonokuchi',
      )

      expect(() => getDivision('')).toThrow(
        'Invalid division name: . Available divisions: makuuchi, juryo, makushita, sandanme, jonidan, jonokuchi',
      )
    })

    it('should call isValidDivisionEn with correct parameter', () => {
      mockIsValidDivisionEn.mockReturnValue(true)

      getDivision('makuuchi')

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
      expect(getDivisionNameFromNumber(0)).toBe(undefined)
      expect(getDivisionNameFromNumber(7)).toBe(undefined)
      expect(getDivisionNameFromNumber(-1)).toBe(undefined)
      expect(getDivisionNameFromNumber(10)).toBe(undefined)
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
        // Note: getDivisionName now expects string division values, not numbers
        // So we can't directly test the reverse mapping here
      })
    })

    it('should handle edge cases consistently', () => {
      // Invalid inputs should be handled gracefully
      expect(getDivisionName(999 as never)).toBe(undefined)
      expect(getDivisionNameFromNumber(999)).toBe(undefined)
      expect(getDivisionByRank('InvalidRank')).toBe(undefined)
    })
  })
})
