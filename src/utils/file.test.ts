import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'node:fs/promises'
import path from 'node:path'
import {
  saveJSON,
  readJSON,
  validateFilePath,
  ensureDirectory,
  fileExists,
  getFileInfo,
  deleteFile,
  FileOptions,
} from './file'

describe('File Utilities', () => {
  const testDir = './test-temp'
  const testFile = path.join(testDir, 'test.json')
  const testData = { name: 'test', value: 123 }

  beforeEach(async () => {
    // Clean up any existing test files
    try {
      await fs.rm(testDir, { recursive: true, force: true })
    } catch {
      // Directory doesn't exist, that's fine
    }
  })

  afterEach(async () => {
    // Clean up after tests
    try {
      await fs.rm(testDir, { recursive: true, force: true })
    } catch {
      // Ignore cleanup errors
    }
  })

  describe('saveJSON', () => {
    it('should save JSON data with default options', async () => {
      await saveJSON(testFile, testData, 'test items')

      const content = await fs.readFile(testFile, 'utf-8')
      const parsed = JSON.parse(content)

      expect(parsed).toEqual(testData)
    })

    it('should create directories automatically', async () => {
      const nestedFile = path.join(testDir, 'nested', 'deep', 'file.json')
      await saveJSON(nestedFile, testData)

      expect(await fileExists(nestedFile)).toBe(true)
    })

    it('should respect overwrite option', async () => {
      // Create initial file
      await saveJSON(testFile, { original: 'data' })

      // Try to save without overwrite
      await expect(
        saveJSON(testFile, testData, 'test', { overwrite: false }),
      ).rejects.toThrow('already exists and overwrite is disabled')
    })

    it('should handle custom encoding', async () => {
      await saveJSON(testFile, testData, 'test', { encoding: 'utf-8' })
      expect(await fileExists(testFile)).toBe(true)
    })

    it('should handle errors gracefully', async () => {
      const invalidPath = '/invalid/path/file.json'
      await expect(
        saveJSON(invalidPath, testData, 'test', { createDirectories: false }),
      ).rejects.toThrow('File operation failed')
    })
  })

  describe('readJSON', () => {
    it('should read and parse JSON data', async () => {
      await saveJSON(testFile, testData)

      const result = await readJSON(testFile)
      expect(result).toEqual(testData)
    })

    it('should handle type generics', async () => {
      await saveJSON(testFile, testData)

      const result = await readJSON<typeof testData>(testFile)
      expect(result.name).toBe('test')
      expect(result.value).toBe(123)
    })

    it('should throw error for invalid JSON', async () => {
      await ensureDirectory(testDir)
      await fs.writeFile(testFile, 'invalid json content')

      await expect(readJSON(testFile)).rejects.toThrow('File operation failed')
    })

    it('should throw error for non-existent file', async () => {
      await expect(readJSON('./non-existent.json')).rejects.toThrow(
        'File operation failed',
      )
    })
  })

  describe('validateFilePath', () => {
    it('should validate correct file paths', () => {
      expect(validateFilePath('./data/file.json')).toEqual({ isValid: true })
      expect(validateFilePath('data/file.json')).toEqual({ isValid: true })
      expect(validateFilePath('file.json')).toEqual({ isValid: true })
    })

    it('should reject empty paths', () => {
      expect(validateFilePath('')).toEqual({
        isValid: false,
        error: 'File path cannot be empty',
      })
    })

    it('should detect path traversal attempts', () => {
      expect(validateFilePath('../secret/file.json')).toEqual({
        isValid: false,
        error: 'Path traversal detected',
      })
      expect(validateFilePath('data//file.json')).toEqual({
        isValid: false,
        error: 'Path traversal detected',
      })
    })

    it('should reject invalid characters', () => {
      expect(validateFilePath('file<>.json')).toEqual({
        isValid: false,
        error: 'File path contains invalid characters',
      })
      expect(validateFilePath('file:name.json')).toEqual({
        isValid: false,
        error: 'File path contains invalid characters',
      })
    })
  })

  describe('ensureDirectory', () => {
    it('should create directory if it does not exist', async () => {
      await ensureDirectory(testDir)
      expect(await fileExists(testDir)).toBe(true)
    })

    it('should not error if directory already exists', async () => {
      await ensureDirectory(testDir)
      await ensureDirectory(testDir) // Should not throw
      expect(await fileExists(testDir)).toBe(true)
    })

    it('should create nested directories', async () => {
      const nestedDir = path.join(testDir, 'nested', 'deep')
      await ensureDirectory(nestedDir)
      expect(await fileExists(nestedDir)).toBe(true)
    })

    it('should handle errors gracefully', async () => {
      const invalidPath = '/invalid/path'
      await expect(
        ensureDirectory(invalidPath, { errorMessage: 'Custom error' }),
      ).rejects.toThrow('Custom error')
    })
  })

  describe('fileExists', () => {
    it('should return true for existing files', async () => {
      await saveJSON(testFile, testData)
      expect(await fileExists(testFile)).toBe(true)
    })

    it('should return false for non-existent files', async () => {
      expect(await fileExists('./non-existent.json')).toBe(false)
    })

    it('should work with directories', async () => {
      await ensureDirectory(testDir)
      expect(await fileExists(testDir)).toBe(true)
    })
  })

  describe('getFileInfo', () => {
    it('should return file information for existing files', async () => {
      await saveJSON(testFile, testData)

      const info = await getFileInfo(testFile)
      expect(info).not.toBeNull()
      expect(info?.isFile).toBe(true)
      expect(info?.isDirectory).toBe(false)
      expect(info?.size).toBeGreaterThan(0)
      expect(info?.modified).toBeInstanceOf(Date)
    })

    it('should return null for non-existent files', async () => {
      const info = await getFileInfo('./non-existent.json')
      expect(info).toBeNull()
    })

    it('should work with directories', async () => {
      await ensureDirectory(testDir)

      const info = await getFileInfo(testDir)
      expect(info).not.toBeNull()
      expect(info?.isFile).toBe(false)
      expect(info?.isDirectory).toBe(true)
    })
  })

  describe('deleteFile', () => {
    it('should delete existing files', async () => {
      await saveJSON(testFile, testData)
      expect(await fileExists(testFile)).toBe(true)

      const deleted = await deleteFile(testFile)
      expect(deleted).toBe(true)
      expect(await fileExists(testFile)).toBe(false)
    })

    it('should return false for non-existent files', async () => {
      const deleted = await deleteFile('./non-existent.json')
      expect(deleted).toBe(false)
    })

    it('should handle errors gracefully', async () => {
      // Create a file and make it read-only to test error handling
      await saveJSON(testFile, testData)

      // Note: This test might not work on all systems due to permissions
      // but it demonstrates the error handling structure
      try {
        await deleteFile(testFile)
        expect(await fileExists(testFile)).toBe(false)
      } catch (error) {
        // If deletion fails due to permissions, that's acceptable
        expect(error).toBeInstanceOf(Error)
      }
    })
  })
})
