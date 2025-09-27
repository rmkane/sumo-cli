import fs from 'node:fs/promises'
import path from 'node:path'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { DATA_DIRS, DATA_PATHS } from '@/config/data'
import { ensureCacheDirectory, getCachePath, readFromCache, writeToCache } from '@/utils/cache'
import { logDebug } from '@/utils/logger'

// Mock dependencies
vi.mock('node:fs/promises')
vi.mock('@/config/data')
vi.mock('@/utils/logger')

describe('Cache Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Mock config
    vi.mocked(DATA_PATHS).USER_DATA_DIR = '/test/cache'
    vi.mocked(DATA_DIRS).CACHE = 'cache'

    // Mock logger
    vi.mocked(logDebug).mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getCachePath', () => {
    it('should generate cache path for simple URL', () => {
      const result = getCachePath('https://example.com')
      // URL gets base64 encoded: https://example.com -> aHR0cHM6Ly9leGFtcGxlLmNvbQ
      expect(result).toBe('/test/cache/cache/aHR0cHM6Ly9leGFtcGxlLmNvbQ.html')
    })

    it('should generate cache path for complex URL', () => {
      const result = getCachePath('https://example.com/path?query=value')
      // URL gets base64 encoded
      expect(result).toBe('/test/cache/cache/aHR0cHM6Ly9leGFtcGxlLmNvbS9wYXRoP3F1ZXJ5PXZhbHVl.html')
    })

    it('should handle URLs with special characters', () => {
      const result = getCachePath('https://example.com/path with spaces')
      // URL gets base64 encoded
      expect(result).toBe('/test/cache/cache/aHR0cHM6Ly9leGFtcGxlLmNvbS9wYXRoIHdpdGggc3BhY2Vz.html')
    })
  })

  describe('ensureCacheDirectory', () => {
    it('should create cache directory', async () => {
      vi.mocked(fs.mkdir).mockResolvedValue(undefined)

      await ensureCacheDirectory()

      expect(fs.mkdir).toHaveBeenCalledWith('/test/cache/cache', { recursive: true })
    })

    it('should handle directory creation errors', async () => {
      const error = new Error('Permission denied')
      vi.mocked(fs.mkdir).mockRejectedValue(error)

      await expect(ensureCacheDirectory()).rejects.toThrow('Permission denied')
    })
  })

  describe('readFromCache', () => {
    it('should read cached content successfully', async () => {
      const mockContent = '<html>cached content</html>'
      vi.mocked(fs.readFile).mockResolvedValue(mockContent)

      const result = await readFromCache('/test/cache/test.html')

      expect(result).toBe(mockContent)
      expect(fs.readFile).toHaveBeenCalledWith('/test/cache/test.html', 'utf-8')
      expect(logDebug).toHaveBeenCalledWith('Using cached version: test.html')
    })

    it('should return null when file does not exist', async () => {
      vi.mocked(fs.readFile).mockRejectedValue(new Error('File not found'))

      const result = await readFromCache('/test/cache/nonexistent.html')

      expect(result).toBeNull()
      expect(logDebug).not.toHaveBeenCalled()
    })

    it('should return null for any read error', async () => {
      vi.mocked(fs.readFile).mockRejectedValue(new Error('Permission denied'))

      const result = await readFromCache('/test/cache/forbidden.html')

      expect(result).toBeNull()
    })
  })

  describe('writeToCache', () => {
    it('should write content to cache file', async () => {
      vi.mocked(fs.writeFile).mockResolvedValue(undefined)
      const content = '<html>new content</html>'

      await writeToCache('/test/cache/test.html', content)

      expect(fs.writeFile).toHaveBeenCalledWith('/test/cache/test.html', content, 'utf-8')
      expect(logDebug).toHaveBeenCalledWith('Cached to: test.html')
    })

    it('should handle write errors', async () => {
      const error = new Error('Disk full')
      vi.mocked(fs.writeFile).mockRejectedValue(error)

      await expect(writeToCache('/test/cache/test.html', 'content')).rejects.toThrow('Disk full')
    })

    it('should log correct filename for nested paths', async () => {
      vi.mocked(fs.writeFile).mockResolvedValue(undefined)

      await writeToCache('/test/cache/nested/path/test.html', 'content')

      expect(logDebug).toHaveBeenCalledWith('Cached to: test.html')
    })
  })
})
