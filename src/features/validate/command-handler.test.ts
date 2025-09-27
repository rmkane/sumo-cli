import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DATA_PATHS } from '@/config/data'
import type { ValidateCommandContext } from '@/features/validate/command-handler'
import { handleValidateCommand } from '@/features/validate/command-handler'
import { validateHTMLDate } from '@/services/matchup'
import { generateMatchupFilename } from '@/utils/filename'

// Mock dependencies
vi.mock('node:fs')
vi.mock('@/services/matchup')
vi.mock('@/utils/filename')

const mockReadFileSync = vi.mocked(readFileSync)
const mockValidateHTMLDate = vi.mocked(validateHTMLDate)
const mockGenerateMatchupFilename = vi.mocked(generateMatchupFilename)

// Mock console methods
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
const mockProcessExit = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never)

describe('Validate Command Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGenerateMatchupFilename.mockReturnValue('day_01_1_makuuchi.html')
  })

  describe('handleValidateCommand', () => {
    it('should handle successful validation with warnings', async () => {
      const context: ValidateCommandContext = {
        day: '5',
      }

      const mockHtml = '<html><body>Day 5 content</body></html>'
      const mockValidation = {
        isValid: true,
        actualDay: 5,
        actualDate: '2024-01-19',
        warnings: ['Minor date discrepancy', 'Missing some data'],
      }

      mockReadFileSync.mockReturnValue(mockHtml)
      mockValidateHTMLDate.mockReturnValue(mockValidation)

      await handleValidateCommand(context)

      expect(mockConsoleLog).toHaveBeenCalledWith('Validating HTML metadata for day 5...')
      expect(mockGenerateMatchupFilename).toHaveBeenCalledWith(5, 1, 'makuuchi', 'html')
      expect(mockReadFileSync).toHaveBeenCalledWith(
        join(DATA_PATHS.USER_DATA_DIR, 'html', 'day_01_1_makuuchi.html'),
        'utf-8',
      )
      expect(mockValidateHTMLDate).toHaveBeenCalledWith(mockHtml, 5)
      expect(mockConsoleLog).toHaveBeenCalledWith('\nValidation Results for Day 5:')
      expect(mockConsoleLog).toHaveBeenCalledWith('✅ Valid: Yes')
      expect(mockConsoleLog).toHaveBeenCalledWith('📅 Actual Day: 5')
      expect(mockConsoleLog).toHaveBeenCalledWith('📆 Actual Date: 2024-01-19')
      expect(mockConsoleLog).toHaveBeenCalledWith('\n⚠️  Warnings:')
      expect(mockConsoleLog).toHaveBeenCalledWith('   - Minor date discrepancy')
      expect(mockConsoleLog).toHaveBeenCalledWith('   - Missing some data')
    })

    it('should handle successful validation without warnings', async () => {
      const context: ValidateCommandContext = {
        day: '1',
      }

      const mockHtml = '<html><body>Day 1 content</body></html>'
      const mockValidation = {
        isValid: true,
        actualDay: 1,
        actualDate: '2024-01-14',
        warnings: [],
      }

      mockReadFileSync.mockReturnValue(mockHtml)
      mockValidateHTMLDate.mockReturnValue(mockValidation)

      await handleValidateCommand(context)

      expect(mockConsoleLog).toHaveBeenCalledWith('Validating HTML metadata for day 1...')
      expect(mockConsoleLog).toHaveBeenCalledWith('\nValidation Results for Day 1:')
      expect(mockConsoleLog).toHaveBeenCalledWith('✅ Valid: Yes')
      expect(mockConsoleLog).toHaveBeenCalledWith('📅 Actual Day: 1')
      expect(mockConsoleLog).toHaveBeenCalledWith('📆 Actual Date: 2024-01-14')
      expect(mockConsoleLog).toHaveBeenCalledWith('\n✅ No validation issues found')
    })

    it('should handle invalid validation', async () => {
      const context: ValidateCommandContext = {
        day: '15',
      }

      const mockHtml = '<html><body>Day 15 content</body></html>'
      const mockValidation = {
        isValid: false,
        actualDay: 14,
        actualDate: '2024-01-28',
        warnings: ['Day mismatch', 'Date inconsistency'],
      }

      mockReadFileSync.mockReturnValue(mockHtml)
      mockValidateHTMLDate.mockReturnValue(mockValidation)

      await handleValidateCommand(context)

      expect(mockConsoleLog).toHaveBeenCalledWith('\nValidation Results for Day 15:')
      expect(mockConsoleLog).toHaveBeenCalledWith('✅ Valid: No')
      expect(mockConsoleLog).toHaveBeenCalledWith('📅 Actual Day: 14')
      expect(mockConsoleLog).toHaveBeenCalledWith('📆 Actual Date: 2024-01-28')
      expect(mockConsoleLog).toHaveBeenCalledWith('\n⚠️  Warnings:')
      expect(mockConsoleLog).toHaveBeenCalledWith('   - Day mismatch')
      expect(mockConsoleLog).toHaveBeenCalledWith('   - Date inconsistency')
    })

    it('should handle validation with unknown values', async () => {
      const context: ValidateCommandContext = {
        day: '8',
      }

      const mockHtml = '<html><body>Day 8 content</body></html>'
      const mockValidation = {
        isValid: false,
        actualDay: null,
        actualDate: null,
        warnings: ['Unable to parse date', 'Unable to determine day'],
      }

      mockReadFileSync.mockReturnValue(mockHtml)
      mockValidateHTMLDate.mockReturnValue(mockValidation)

      await handleValidateCommand(context)

      expect(mockConsoleLog).toHaveBeenCalledWith('\nValidation Results for Day 8:')
      expect(mockConsoleLog).toHaveBeenCalledWith('✅ Valid: No')
      expect(mockConsoleLog).toHaveBeenCalledWith('📅 Actual Day: Unknown')
      expect(mockConsoleLog).toHaveBeenCalledWith('📆 Actual Date: Unknown')
      expect(mockConsoleLog).toHaveBeenCalledWith('\n⚠️  Warnings:')
      expect(mockConsoleLog).toHaveBeenCalledWith('   - Unable to parse date')
      expect(mockConsoleLog).toHaveBeenCalledWith('   - Unable to determine day')
    })

    it('should handle invalid day number (too low)', async () => {
      const context: ValidateCommandContext = {
        day: '0',
      }

      await handleValidateCommand(context)

      expect(mockConsoleError).toHaveBeenCalledWith('Error: Day must be a number between 1 and 15')
      expect(mockProcessExit).toHaveBeenCalledWith(1)
      // Note: process.exit doesn't actually exit in tests, so readFileSync may still be called
    })

    it('should handle invalid day number (too high)', async () => {
      const context: ValidateCommandContext = {
        day: '16',
      }

      await handleValidateCommand(context)

      expect(mockConsoleError).toHaveBeenCalledWith('Error: Day must be a number between 1 and 15')
      expect(mockProcessExit).toHaveBeenCalledWith(1)
      // Note: process.exit doesn't actually exit in tests, so readFileSync may still be called
    })

    it('should handle non-numeric day', async () => {
      const context: ValidateCommandContext = {
        day: 'abc',
      }

      await handleValidateCommand(context)

      expect(mockConsoleError).toHaveBeenCalledWith('Error: Day must be a number between 1 and 15')
      expect(mockProcessExit).toHaveBeenCalledWith(1)
      // Note: process.exit doesn't actually exit in tests, so readFileSync may still be called
    })

    it('should handle file read errors', async () => {
      const context: ValidateCommandContext = {
        day: '5',
      }

      const error = new Error('File not found')
      mockReadFileSync.mockImplementation(() => {
        throw error
      })

      await handleValidateCommand(context)

      expect(mockConsoleError).toHaveBeenCalledWith('Error reading HTML file: File not found')
      expect(mockConsoleLog).toHaveBeenCalledWith(
        `Expected file: ${join(DATA_PATHS.USER_DATA_DIR, 'html', 'day_01_1_makuuchi.html')}`,
      )
      expect(mockProcessExit).toHaveBeenCalledWith(1)
    })

    it('should handle non-Error file read exceptions', async () => {
      const context: ValidateCommandContext = {
        day: '5',
      }

      mockReadFileSync.mockImplementation(() => {
        throw 'String error'
      })

      await handleValidateCommand(context)

      expect(mockConsoleError).toHaveBeenCalledWith('Error reading HTML file: String error')
      expect(mockProcessExit).toHaveBeenCalledWith(1)
    })

    it('should handle outer catch block errors', async () => {
      const context: ValidateCommandContext = {
        day: '5',
      }

      // Mock parseInt to throw an error
      const originalParseInt = global.parseInt
      global.parseInt = vi.fn().mockImplementation(() => {
        throw new Error('Parse error')
      })

      await handleValidateCommand(context)

      expect(mockConsoleError).toHaveBeenCalledWith('Error validating day 5:', expect.any(Error))
      expect(mockProcessExit).toHaveBeenCalledWith(1)

      // Restore original parseInt
      global.parseInt = originalParseInt
    })
  })
})
