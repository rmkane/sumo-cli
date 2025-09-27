import { beforeEach, describe, expect, it, vi } from 'vitest'

import { processAllDivisions } from '@/core/services/division-processor'
import { logDebug, logError } from '@/core/utils/logger'
import type { StatsCommandContext } from '@/features/stats/command-handler'
import { handleStatsCommand } from '@/features/stats/command-handler'

// Mock dependencies
vi.mock('@/core/services/division-processor')
vi.mock('@/core/utils/logger')

const mockProcessAllDivisions = vi.mocked(processAllDivisions)
const mockLogDebug = vi.mocked(logDebug)
const mockLogError = vi.mocked(logError)

// Mock console methods
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})
const mockProcessExit = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never)

describe('Stats Command Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('handleStatsCommand', () => {
    it('should handle successful processing without force refresh', async () => {
      const context: StatsCommandContext = {
        forceRefresh: false,
      }

      const mockResult = {
        filesCreated: 6,
        dataDir: './data',
      }

      mockProcessAllDivisions.mockResolvedValue(mockResult)

      await handleStatsCommand(context)

      expect(mockLogDebug).toHaveBeenCalledWith('Starting full division processing...')
      expect(mockProcessAllDivisions).toHaveBeenCalledWith(false)
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '✅ Rikishi statistics downloaded successfully - 6 JSON files created in ./data',
      )
    })

    it('should handle successful processing with force refresh', async () => {
      const context: StatsCommandContext = {
        forceRefresh: true,
      }

      const mockResult = {
        filesCreated: 6,
        dataDir: '/custom/data',
      }

      mockProcessAllDivisions.mockResolvedValue(mockResult)

      await handleStatsCommand(context)

      expect(mockLogDebug).toHaveBeenCalledWith('Starting full division processing...')
      expect(mockProcessAllDivisions).toHaveBeenCalledWith(true)
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '✅ Rikishi statistics downloaded successfully - 6 JSON files created in /custom/data',
      )
    })

    it('should handle processing errors', async () => {
      const context: StatsCommandContext = {
        forceRefresh: false,
      }

      const error = new Error('Network error')
      mockProcessAllDivisions.mockRejectedValue(error)

      await handleStatsCommand(context)

      expect(mockLogDebug).toHaveBeenCalledWith('Starting full division processing...')
      expect(mockLogError).toHaveBeenCalledWith('processing all divisions', error)
      expect(mockProcessExit).toHaveBeenCalledWith(1)
    })

    it('should handle non-Error exceptions', async () => {
      const context: StatsCommandContext = {
        forceRefresh: true,
      }

      mockProcessAllDivisions.mockRejectedValue('String error')

      await handleStatsCommand(context)

      expect(mockLogError).toHaveBeenCalledWith('processing all divisions', 'String error')
      expect(mockProcessExit).toHaveBeenCalledWith(1)
    })

    it('should handle zero files created', async () => {
      const context: StatsCommandContext = {
        forceRefresh: false,
      }

      const mockResult = {
        filesCreated: 0,
        dataDir: './empty',
      }

      mockProcessAllDivisions.mockResolvedValue(mockResult)

      await handleStatsCommand(context)

      expect(mockConsoleLog).toHaveBeenCalledWith(
        '✅ Rikishi statistics downloaded successfully - 0 JSON files created in ./empty',
      )
    })
  })
})
