import { beforeEach, describe, expect, it, vi } from 'vitest'

import { formatDivisionJson, formatDivisionList, formatDivisionTable } from '@/cli/formatters'
import { listDivisionRikishi } from '@/services/division-service'
import { getAvailableDivisions, getDivisionNameFromNumber, getDivisionNumberMappings } from '@/utils/division'

import { type DivisionCommandContext, handleDivisionCommand } from './command-handler'

// Mock dependencies
vi.mock('@/cli/formatters')
vi.mock('@/services/division-service')
vi.mock('@/utils/division')

const mockFormatDivisionJson = vi.mocked(formatDivisionJson)
const mockFormatDivisionList = vi.mocked(formatDivisionList)
const mockFormatDivisionTable = vi.mocked(formatDivisionTable)
const mockListDivisionRikishi = vi.mocked(listDivisionRikishi)
const mockGetAvailableDivisions = vi.mocked(getAvailableDivisions)
const mockGetDivisionNameFromNumber = vi.mocked(getDivisionNameFromNumber)
const mockGetDivisionNumberMappings = vi.mocked(getDivisionNumberMappings)

// Mock console methods
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
const mockProcessExit = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never)

describe('Division Command Handler', () => {
  const mockRikishi = [
    {
      english: 'Hakuho',
      kanji: '白鵬',
      hiragana: 'はくほう',
      rank: {
        division: 'Yokozuna',
        position: null,
        side: null,
      },
    },
    {
      english: 'Kisenosato',
      kanji: '稀勢の里',
      hiragana: 'きせのさと',
      rank: {
        division: 'Maegashira',
        position: 5,
        side: 'East',
      },
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    mockGetAvailableDivisions.mockReturnValue(['makuuchi', 'juryo', 'makushita'])
    mockGetDivisionNumberMappings.mockReturnValue(['1=makuuchi', '2=juryo', '3=makushita'])
  })

  describe('handleDivisionCommand', () => {
    it('should handle division by number successfully', async () => {
      const context: DivisionCommandContext = {
        division: '1',
        format: 'table',
      }

      mockGetDivisionNameFromNumber.mockReturnValue('makuuchi')
      mockListDivisionRikishi.mockResolvedValue(mockRikishi)

      await handleDivisionCommand(context)

      expect(mockGetDivisionNameFromNumber).toHaveBeenCalledWith(1)
      expect(mockListDivisionRikishi).toHaveBeenCalledWith('makuuchi', 'table')
      expect(mockConsoleLog).toHaveBeenCalledWith('\n🥋 MAKUUCHI Division - 2 Rikishi')
      expect(mockConsoleLog).toHaveBeenCalledWith('='.repeat(50))
      expect(mockFormatDivisionTable).toHaveBeenCalledWith(mockRikishi)
    })

    it('should handle division by name successfully', async () => {
      const context: DivisionCommandContext = {
        division: 'makuuchi',
        format: 'list',
      }

      mockListDivisionRikishi.mockResolvedValue(mockRikishi)

      await handleDivisionCommand(context)

      expect(mockListDivisionRikishi).toHaveBeenCalledWith('makuuchi', 'list')
      expect(mockConsoleLog).toHaveBeenCalledWith('\n🥋 MAKUUCHI Division - 2 Rikishi')
      expect(mockFormatDivisionList).toHaveBeenCalledWith(mockRikishi)
    })

    it('should handle json format', async () => {
      const context: DivisionCommandContext = {
        division: 'juryo',
        format: 'json',
      }

      mockListDivisionRikishi.mockResolvedValue(mockRikishi)

      await handleDivisionCommand(context)

      expect(mockFormatDivisionJson).toHaveBeenCalledWith(mockRikishi)
    })

    it('should handle default format (table) when format is not specified', async () => {
      const context: DivisionCommandContext = {
        division: 'makushita',
        format: 'unknown',
      }

      mockListDivisionRikishi.mockResolvedValue(mockRikishi)

      await handleDivisionCommand(context)

      expect(mockFormatDivisionTable).toHaveBeenCalledWith(mockRikishi)
    })

    it('should show note when no rank data is available', async () => {
      const context: DivisionCommandContext = {
        division: '1',
        format: 'table',
      }

      const rikishiWithoutRank = [
        {
          english: 'TestRikishi',
          kanji: 'テスト',
          hiragana: 'てすと',
          rank: null,
        },
      ]

      mockGetDivisionNameFromNumber.mockReturnValue('makuuchi')
      mockListDivisionRikishi.mockResolvedValue(rikishiWithoutRank)

      await handleDivisionCommand(context)

      expect(mockConsoleLog).toHaveBeenCalledWith('ℹ️  Note: Rank data not available in current dataset')
      expect(mockConsoleLog).toHaveBeenCalledWith('')
    })

    it('should handle empty rikishi list', async () => {
      const context: DivisionCommandContext = {
        division: '1',
        format: 'table',
      }

      mockGetDivisionNameFromNumber.mockReturnValue('makuuchi')
      mockListDivisionRikishi.mockResolvedValue([])

      await handleDivisionCommand(context)

      expect(mockConsoleLog).toHaveBeenCalledWith('No rikishi found for division: 1')
      expect(mockConsoleLog).toHaveBeenCalledWith('Available divisions: makuuchi, juryo, makushita')
      expect(mockConsoleLog).toHaveBeenCalledWith('Or use numbers: 1=makuuchi, 2=juryo, 3=makushita')
    })

    it('should handle invalid division number', async () => {
      const context: DivisionCommandContext = {
        division: '7',
        format: 'table',
      }

      mockGetDivisionNameFromNumber.mockReturnValue(null)
      mockListDivisionRikishi.mockRejectedValue(new Error('Invalid division number: 7'))

      await handleDivisionCommand(context)

      expect(mockConsoleError).toHaveBeenCalledWith('❌ Error listing division rikishi:', expect.any(Error))
      expect(mockProcessExit).toHaveBeenCalledWith(1)
    })

    it('should handle invalid division name error', async () => {
      const context: DivisionCommandContext = {
        division: 'invalid',
        format: 'table',
      }

      const error = new Error('Invalid division name: invalid')
      mockListDivisionRikishi.mockRejectedValue(error)

      await handleDivisionCommand(context)

      expect(mockConsoleError).toHaveBeenCalledWith('❌ Invalid division: "invalid"')
      expect(mockConsoleLog).toHaveBeenCalledWith('\nAvailable divisions:')
      expect(mockConsoleLog).toHaveBeenCalledWith(' - makuuchi')
      expect(mockConsoleLog).toHaveBeenCalledWith(' - juryo')
      expect(mockConsoleLog).toHaveBeenCalledWith(' - makushita')
      expect(mockConsoleLog).toHaveBeenCalledWith('\nOr use numbers:')
      expect(mockConsoleLog).toHaveBeenCalledWith(' - 1 = makuuchi')
      expect(mockConsoleLog).toHaveBeenCalledWith(' - 2 = juryo')
      expect(mockConsoleLog).toHaveBeenCalledWith(' - 3 = makushita')
      expect(mockConsoleLog).toHaveBeenCalledWith('\nExample: sumo-cli division makuuchi or sumo-cli division 1')
      expect(mockProcessExit).toHaveBeenCalledWith(1)
    })

    it('should handle other errors', async () => {
      const context: DivisionCommandContext = {
        division: 'makuuchi',
        format: 'table',
      }

      const error = new Error('Network error')
      mockListDivisionRikishi.mockRejectedValue(error)

      await handleDivisionCommand(context)

      expect(mockConsoleError).toHaveBeenCalledWith('❌ Error listing division rikishi:', error)
      expect(mockConsoleLog).toHaveBeenCalledWith('Available divisions: makuuchi, juryo, makushita')
      expect(mockConsoleLog).toHaveBeenCalledWith('Or use numbers: 1=makuuchi, 2=juryo, 3=makushita')
      expect(mockProcessExit).toHaveBeenCalledWith(1)
    })

    it('should handle non-Error exceptions', async () => {
      const context: DivisionCommandContext = {
        division: 'makuuchi',
        format: 'table',
      }

      mockListDivisionRikishi.mockRejectedValue('String error')

      await handleDivisionCommand(context)

      expect(mockConsoleError).toHaveBeenCalledWith('❌ Error listing division rikishi:', 'String error')
      expect(mockProcessExit).toHaveBeenCalledWith(1)
    })
  })
})
