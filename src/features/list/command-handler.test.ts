import path from 'node:path'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DATA_DIRS, DATA_PATHS } from '@/config/data'

import { type ListCommandContext, handleListCommand } from './command-handler'

// Mock console.log
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})

describe('List Command Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('handleListCommand', () => {
    it('should display default output directory', async () => {
      const context: ListCommandContext = {}

      await handleListCommand(context)

      expect(mockConsoleLog).toHaveBeenCalledWith('\nData storage locations:')
      expect(mockConsoleLog).toHaveBeenCalledWith(
        `📁 ${path.resolve(DATA_PATHS.USER_DATA_DIR, DATA_DIRS.JSON)} - Rikishi data by division (cached)`,
      )
      expect(mockConsoleLog).toHaveBeenCalledWith(
        `📁 ${path.resolve(DATA_PATHS.USER_DATA_DIR, DATA_DIRS.CACHE)} - Raw HTML data (cached)`,
      )
      expect(mockConsoleLog).toHaveBeenCalledWith(
        `📁 ${path.resolve(DATA_PATHS.USER_DATA_DIR, DATA_DIRS.LOGS)} - Application logs`,
      )
      expect(mockConsoleLog).toHaveBeenCalledWith('\nOutput locations:')
      expect(mockConsoleLog).toHaveBeenCalledWith(
        `📁 ${path.resolve(DATA_PATHS.OUTPUT_DIR)} - CSV output files (default)`,
      )
    })

    it('should display custom output directory', async () => {
      const context: ListCommandContext = {
        outputDir: '/custom/output',
      }

      await handleListCommand(context)

      expect(mockConsoleLog).toHaveBeenCalledWith('\nData storage locations:')
      expect(mockConsoleLog).toHaveBeenCalledWith(
        `📁 ${path.resolve(DATA_PATHS.USER_DATA_DIR, DATA_DIRS.JSON)} - Rikishi data by division (cached)`,
      )
      expect(mockConsoleLog).toHaveBeenCalledWith(
        `📁 ${path.resolve(DATA_PATHS.USER_DATA_DIR, DATA_DIRS.CACHE)} - Raw HTML data (cached)`,
      )
      expect(mockConsoleLog).toHaveBeenCalledWith(
        `📁 ${path.resolve(DATA_PATHS.USER_DATA_DIR, DATA_DIRS.LOGS)} - Application logs`,
      )
      expect(mockConsoleLog).toHaveBeenCalledWith('\nOutput locations:')
      expect(mockConsoleLog).toHaveBeenCalledWith(`📁 ${path.resolve('/custom/output')} - CSV output files (custom)`)
    })

    it('should handle undefined outputDir', async () => {
      const context: ListCommandContext = {
        outputDir: undefined,
      }

      await handleListCommand(context)

      expect(mockConsoleLog).toHaveBeenCalledWith(
        `📁 ${path.resolve(DATA_PATHS.OUTPUT_DIR)} - CSV output files (default)`,
      )
    })

    it('should handle empty string outputDir', async () => {
      const context: ListCommandContext = {
        outputDir: '',
      }

      await handleListCommand(context)

      expect(mockConsoleLog).toHaveBeenCalledWith('\nData storage locations:')
      expect(mockConsoleLog).toHaveBeenCalledWith(
        `📁 ${path.resolve(DATA_PATHS.USER_DATA_DIR, DATA_DIRS.JSON)} - Rikishi data by division (cached)`,
      )
      expect(mockConsoleLog).toHaveBeenCalledWith(
        `📁 ${path.resolve(DATA_PATHS.USER_DATA_DIR, DATA_DIRS.CACHE)} - Raw HTML data (cached)`,
      )
      expect(mockConsoleLog).toHaveBeenCalledWith(
        `📁 ${path.resolve(DATA_PATHS.USER_DATA_DIR, DATA_DIRS.LOGS)} - Application logs`,
      )
      expect(mockConsoleLog).toHaveBeenCalledWith('\nOutput locations:')
      // Empty string falls back to default due to || operator
      expect(mockConsoleLog).toHaveBeenCalledWith(
        `📁 ${path.resolve(DATA_PATHS.OUTPUT_DIR)} - CSV output files (default)`,
      )
    })
  })
})
