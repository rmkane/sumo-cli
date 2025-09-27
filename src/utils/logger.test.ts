import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  logDebug,
  logError,
  logHttp,
  logProcessingComplete,
  logProcessingStart,
  logSuccess,
  logWarning,
  logger,
} from '@/utils/logger'

// Mock winston
vi.mock('winston', () => ({
  default: {
    createLogger: vi.fn(() => ({
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
      http: vi.fn(),
    })),
    addColors: vi.fn(),
    format: {
      combine: vi.fn(),
      colorize: vi.fn(),
      printf: vi.fn(),
      timestamp: vi.fn(),
      json: vi.fn(),
    },
    transports: {
      Console: vi.fn(),
      File: vi.fn(),
    },
  },
}))

// Mock the config/data module
vi.mock('@/config/data', () => ({
  DATA_PATHS: {
    USER_DATA_DIR: '/test/data',
  },
  DATA_DIRS: {
    LOGS: 'logs',
  },
}))

describe('Logger Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('logProcessingStart', () => {
    it('should log processing start without details', () => {
      logProcessingStart('division processing')

      expect(logger.info).toHaveBeenCalledWith('Processing division processing')
    })

    it('should log processing start with details', () => {
      logProcessingStart('division processing', 'Makuuchi')

      expect(logger.info).toHaveBeenCalledWith('Processing division processing (Makuuchi)')
    })

    it('should handle empty operation name', () => {
      logProcessingStart('')

      expect(logger.info).toHaveBeenCalledWith('Processing ')
    })
  })

  describe('logProcessingComplete', () => {
    it('should log processing complete without details', () => {
      logProcessingComplete('matchups', 15)

      expect(logger.info).toHaveBeenCalledWith('Processed 15 matchups')
    })

    it('should log processing complete with details', () => {
      logProcessingComplete('matchups', 15, 'Makuuchi day 1')

      expect(logger.info).toHaveBeenCalledWith('Processed 15 matchups for Makuuchi day 1')
    })

    it('should handle zero count', () => {
      logProcessingComplete('matchups', 0)

      expect(logger.info).toHaveBeenCalledWith('Processed 0 matchups')
    })

    it('should handle negative count', () => {
      logProcessingComplete('matchups', -1)

      expect(logger.info).toHaveBeenCalledWith('Processed -1 matchups')
    })
  })

  describe('logSuccess', () => {
    it('should log success message', () => {
      logSuccess('Processing completed successfully')

      expect(logger.info).toHaveBeenCalledWith('Processing completed successfully')
    })

    it('should handle empty message', () => {
      logSuccess('')

      expect(logger.info).toHaveBeenCalledWith('')
    })
  })

  describe('logError', () => {
    it('should log error with Error object', () => {
      const error = new Error('Test error message')
      logError('division processing', error)

      expect(logger.error).toHaveBeenCalledWith('Error processing division processing: Test error message')
    })

    it('should log error with string', () => {
      logError('division processing', 'String error message')

      expect(logger.error).toHaveBeenCalledWith('Error processing division processing: String error message')
    })

    it('should log error with number', () => {
      logError('division processing', 404)

      expect(logger.error).toHaveBeenCalledWith('Error processing division processing: 404')
    })

    it('should log error with object', () => {
      const errorObj = { code: 'ENOENT', message: 'File not found' }
      logError('file processing', errorObj)

      expect(logger.error).toHaveBeenCalledWith('Error processing file processing: [object Object]')
    })

    it('should handle empty context', () => {
      const error = new Error('Test error')
      logError('', error)

      expect(logger.error).toHaveBeenCalledWith('Error processing : Test error')
    })
  })

  describe('logWarning', () => {
    it('should log warning message', () => {
      logWarning('No data found for division')

      expect(logger.warn).toHaveBeenCalledWith('No data found for division')
    })

    it('should handle empty message', () => {
      logWarning('')

      expect(logger.warn).toHaveBeenCalledWith('')
    })
  })

  describe('logDebug', () => {
    it('should log debug message without data', () => {
      logDebug('Cache hit for division')

      expect(logger.debug).toHaveBeenCalledWith('Cache hit for division')
    })

    it('should log debug message with string data', () => {
      logDebug('Cache hit for division', 'Makuuchi')

      expect(logger.debug).toHaveBeenCalledWith('Cache hit for division: "Makuuchi"')
    })

    it('should log debug message with object data', () => {
      const data = { division: 'Makuuchi', count: 42 }
      logDebug('Cache hit for division', data)

      expect(logger.debug).toHaveBeenCalledWith('Cache hit for division: {"division":"Makuuchi","count":42}')
    })

    it('should log debug message with number data', () => {
      logDebug('Processing count', 42)

      expect(logger.debug).toHaveBeenCalledWith('Processing count: 42')
    })

    it('should log debug message with boolean data', () => {
      logDebug('Feature enabled', true)

      expect(logger.debug).toHaveBeenCalledWith('Feature enabled: true')
    })

    it('should handle empty message', () => {
      logDebug('')

      expect(logger.debug).toHaveBeenCalledWith('')
    })
  })

  describe('logHttp', () => {
    it('should log HTTP request information', () => {
      logHttp('GET', '/api/rikishi', 200, 150)

      expect(logger.http).toHaveBeenCalledWith('GET /api/rikishi 200 150ms')
    })

    it('should log HTTP request with different methods', () => {
      logHttp('POST', '/api/rikishi', 201, 300)

      expect(logger.http).toHaveBeenCalledWith('POST /api/rikishi 201 300ms')
    })

    it('should log HTTP request with error status', () => {
      logHttp('GET', '/api/rikishi', 404, 50)

      expect(logger.http).toHaveBeenCalledWith('GET /api/rikishi 404 50ms')
    })

    it('should log HTTP request with zero duration', () => {
      logHttp('GET', '/api/rikishi', 200, 0)

      expect(logger.http).toHaveBeenCalledWith('GET /api/rikishi 200 0ms')
    })

    it('should handle empty URL', () => {
      logHttp('GET', '', 200, 150)

      expect(logger.http).toHaveBeenCalledWith('GET  200 150ms')
    })
  })
})
