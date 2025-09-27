import { describe, expect, it, vi } from 'vitest'

import { createErrorMessage, safeExecute, withErrorHandling } from '@/utils/error-handler'

describe('Error Handler', () => {
  describe('withErrorHandling', () => {
    it('should execute function successfully and return result', async () => {
      const mockFn = vi.fn().mockResolvedValue('success')
      const wrappedFn = withErrorHandling(mockFn, 'test context')

      const result = await wrappedFn('arg1', 'arg2')

      expect(result).toBe('success')
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
    })

    it('should catch and re-throw errors with context', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const testError = new Error('Test error')
      const mockFn = vi.fn().mockRejectedValue(testError)
      const wrappedFn = withErrorHandling(mockFn, 'test context')

      await expect(wrappedFn()).rejects.toThrow('Test error')
      expect(consoleSpy).toHaveBeenCalledWith('Error in test context:', testError)

      consoleSpy.mockRestore()
    })

    it('should handle non-Error objects', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const mockFn = vi.fn().mockRejectedValue('string error')
      const wrappedFn = withErrorHandling(mockFn, 'test context')

      await expect(wrappedFn()).rejects.toBe('string error')
      expect(consoleSpy).toHaveBeenCalledWith('Error in test context:', 'string error')

      consoleSpy.mockRestore()
    })
  })

  describe('safeExecute', () => {
    it('should return success result when function succeeds', async () => {
      const mockFn = vi.fn().mockResolvedValue('success data')
      const result = await safeExecute(mockFn, 'test context')

      expect(result).toEqual({
        success: true,
        data: 'success data',
      })
    })

    it('should return error result when function fails', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const testError = new Error('Test error')
      const mockFn = vi.fn().mockRejectedValue(testError)
      const result = await safeExecute(mockFn, 'test context')

      expect(result).toEqual({
        success: false,
        error: testError,
      })
      expect(consoleSpy).toHaveBeenCalledWith('Error in test context:', testError)

      consoleSpy.mockRestore()
    })

    it('should handle non-Error objects in safeExecute', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const mockFn = vi.fn().mockRejectedValue('string error')
      const result = await safeExecute(mockFn, 'test context')

      expect(result).toEqual({
        success: false,
        error: 'string error',
      })
      expect(consoleSpy).toHaveBeenCalledWith('Error in test context:', 'string error')

      consoleSpy.mockRestore()
    })
  })

  describe('createErrorMessage', () => {
    it('should create error message with Error object', () => {
      const error = new Error('Test error message')
      const result = createErrorMessage('test context', error)
      expect(result).toBe('Error in test context: Test error message')
    })

    it('should create error message with string', () => {
      const result = createErrorMessage('test context', 'string error')
      expect(result).toBe('Error in test context: string error')
    })

    it('should create error message with number', () => {
      const result = createErrorMessage('test context', 404)
      expect(result).toBe('Error in test context: 404')
    })

    it('should create error message with object', () => {
      const errorObj = { message: 'Custom error', code: 500 }
      const result = createErrorMessage('test context', errorObj)
      expect(result).toBe('Error in test context: [object Object]')
    })

    it('should handle null and undefined', () => {
      expect(createErrorMessage('test context', null)).toBe('Error in test context: null')
      expect(createErrorMessage('test context', undefined)).toBe('Error in test context: undefined')
    })
  })
})
