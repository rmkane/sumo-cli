import { beforeEach, describe, expect, it, vi } from 'vitest'

import { processDayMatchups } from '@/features/matchups/processor'
import { logDebug, logError } from '@/utils/logger'

import { type MatchupsCommandContext, handleMatchupsCommand } from './command-handler'

// Mock dependencies
vi.mock('@/features/matchups/processor')
vi.mock('@/utils/logger')

const mockProcessDayMatchups = vi.mocked(processDayMatchups)
const mockLogDebug = vi.mocked(logDebug)
const mockLogError = vi.mocked(logError)

// Mock console methods
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
const mockProcessExit = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never)

describe('Matchups Command Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('handleMatchupsCommand', () => {
    it('should handle successful processing with files created', async () => {
      const context: MatchupsCommandContext = {
        day: '5',
        forceRefresh: false,
        outputDir: './custom-output',
      }

      const mockResult = {
        filesCreated: 6,
        outputDir: './custom-output',
      }

      mockProcessDayMatchups.mockResolvedValue(mockResult)

      await handleMatchupsCommand(context)

      expect(mockLogDebug).toHaveBeenCalledWith('Starting day 5 processing...')
      expect(mockProcessDayMatchups).toHaveBeenCalledWith(5, false, './custom-output')
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '✅ Matchup data downloaded successfully - 6 CSV files created in ./custom-output',
      )
    })

    it('should handle successful processing with no files created', async () => {
      const context: MatchupsCommandContext = {
        day: '15',
        forceRefresh: true,
      }

      const mockResult = {
        filesCreated: 0,
        outputDir: './output',
      }

      mockProcessDayMatchups.mockResolvedValue(mockResult)

      await handleMatchupsCommand(context)

      expect(mockLogDebug).toHaveBeenCalledWith('Starting day 15 processing...')
      expect(mockProcessDayMatchups).toHaveBeenCalledWith(15, true, undefined)
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '❌ Day 15 data not available - tournament may not have reached this day yet',
      )
      expect(mockConsoleLog).toHaveBeenCalledWith("   Use 'sumo-cli validate 15' to check HTML metadata for details")
    })

    it('should handle invalid day number (too low)', async () => {
      const context: MatchupsCommandContext = {
        day: '0',
        forceRefresh: false,
      }

      await handleMatchupsCommand(context)

      expect(mockConsoleError).toHaveBeenCalledWith('Error: Day must be a number between 1 and 15')
      expect(mockProcessExit).toHaveBeenCalledWith(1)
      // Note: process.exit doesn't actually exit in tests, so processDayMatchups may still be called
    })

    it('should handle invalid day number (too high)', async () => {
      const context: MatchupsCommandContext = {
        day: '16',
        forceRefresh: false,
      }

      await handleMatchupsCommand(context)

      expect(mockConsoleError).toHaveBeenCalledWith('Error: Day must be a number between 1 and 15')
      expect(mockProcessExit).toHaveBeenCalledWith(1)
      // Note: process.exit doesn't actually exit in tests, so processDayMatchups may still be called
    })

    it('should handle non-numeric day', async () => {
      const context: MatchupsCommandContext = {
        day: 'abc',
        forceRefresh: false,
      }

      await handleMatchupsCommand(context)

      expect(mockConsoleError).toHaveBeenCalledWith('Error: Day must be a number between 1 and 15')
      expect(mockProcessExit).toHaveBeenCalledWith(1)
      // Note: process.exit doesn't actually exit in tests, so processDayMatchups may still be called
    })

    it('should handle processing errors', async () => {
      const context: MatchupsCommandContext = {
        day: '5',
        forceRefresh: false,
      }

      const error = new Error('Network error')
      mockProcessDayMatchups.mockRejectedValue(error)

      await handleMatchupsCommand(context)

      expect(mockLogDebug).toHaveBeenCalledWith('Starting day 5 processing...')
      expect(mockLogError).toHaveBeenCalledWith('processing day 5', error)
      expect(mockProcessExit).toHaveBeenCalledWith(1)
    })

    it('should handle edge case day 1', async () => {
      const context: MatchupsCommandContext = {
        day: '1',
        forceRefresh: false,
      }

      const mockResult = {
        filesCreated: 6,
        outputDir: './output',
      }

      mockProcessDayMatchups.mockResolvedValue(mockResult)

      await handleMatchupsCommand(context)

      expect(mockProcessDayMatchups).toHaveBeenCalledWith(1, false, undefined)
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '✅ Matchup data downloaded successfully - 6 CSV files created in ./output',
      )
    })

    it('should handle edge case day 15', async () => {
      const context: MatchupsCommandContext = {
        day: '15',
        forceRefresh: true,
        outputDir: './final-output',
      }

      const mockResult = {
        filesCreated: 6,
        outputDir: './final-output',
      }

      mockProcessDayMatchups.mockResolvedValue(mockResult)

      await handleMatchupsCommand(context)

      expect(mockProcessDayMatchups).toHaveBeenCalledWith(15, true, './final-output')
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '✅ Matchup data downloaded successfully - 6 CSV files created in ./final-output',
      )
    })
  })
})
