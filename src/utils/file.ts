import fs from 'node:fs/promises'
import path from 'node:path'

import type { FileOptions } from '@/types'

/**
 * Default configuration for file operations.
 */
const DEFAULT_FILE_OPTIONS: Required<FileOptions> = {
  createDirectories: true,
  encoding: 'utf-8',
  overwrite: true,
  errorMessage: 'File operation failed',
}

/**
 * Saves data to a JSON file with pretty formatting and comprehensive error handling.
 *
 * This function automatically creates parent directories if they don't exist,
 * formats JSON with proper indentation, and provides detailed logging.
 * It's designed for saving structured data like rikishi information, tournament
 * results, or any other JSON-serializable data.
 *
 * @param filename - The path to the file to save (can include directories)
 * @param data - The data to save (will be JSON.stringify'd)
 * @param itemName - Optional name for the items being saved (used in console output)
 * @param options - Configuration options for the file operation
 * @returns Promise that resolves when the file is written
 *
 * @example
 * ```typescript
 * // Basic usage
 * await saveJSON('data/rikishi.json', rikishiData, 'rikishi');
 *
 * // With custom options
 * await saveJSON('output/results.json', results, 'results', {
 *   createDirectories: true,
 *   encoding: 'utf-8',
 *   overwrite: false
 * });
 * ```
 *
 * @throws {Error} When file cannot be written or directory cannot be created
 * @since 1.0.0
 */
export async function saveJSON<T = unknown>(
  filename: string,
  data: T,
  itemName: string = 'items',
  options: FileOptions = {},
): Promise<void> {
  const config = { ...DEFAULT_FILE_OPTIONS, ...options }

  try {
    // Ensure the directory exists before writing the file
    if (config.createDirectories) {
      const dir = path.dirname(filename)
      await fs.mkdir(dir, { recursive: true })
    }

    // Check if file exists and overwrite is disabled
    if (!config.overwrite) {
      try {
        await fs.access(filename)
        throw new Error(`File ${filename} already exists and overwrite is disabled`)
      } catch (error) {
        // If it's our custom error, re-throw it
        if (error instanceof Error && error.message.includes('already exists')) {
          throw error
        }
        // File doesn't exist, continue with writing
      }
    }

    const jsonContent = JSON.stringify(data, null, 2)
    await fs.writeFile(filename, jsonContent, config.encoding)

    const count = Array.isArray(data) ? data.length : 'data'
    console.log(`Saved ${count} ${itemName} to ${filename}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`${config.errorMessage}: ${message}`)
  }
}

/**
 * Reads and parses JSON data from a file.
 *
 * This function provides safe JSON parsing with proper error handling
 * and type validation. It's useful for loading cached data, configuration
 * files, or any previously saved JSON data.
 *
 * @param filename - The path to the JSON file to read
 * @param options - Configuration options for the file operation
 * @returns Promise that resolves to the parsed JSON data
 *
 * @example
 * ```typescript
 * // Basic usage
 * const rikishiData = await readJSON('data/rikishi.json');
 *
 * // With custom options
 * const config = await readJSON('config/settings.json', {
 *   encoding: 'utf-8',
 *   errorMessage: 'Failed to load configuration'
 * });
 * ```
 *
 * @throws {Error} When file cannot be read or contains invalid JSON
 * @since 1.0.0
 */
export async function readJSON<T = unknown>(filename: string, options: FileOptions = {}): Promise<T> {
  const config = { ...DEFAULT_FILE_OPTIONS, ...options }

  try {
    const content = await fs.readFile(filename, config.encoding)
    const data = JSON.parse(content)
    console.log(`Loaded data from ${filename}`)
    return data
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`${config.errorMessage}: ${message}`)
  }
}

/**
 * Validates if a file path is safe and valid for file operations.
 *
 * This function checks for common security issues and validates the path
 * format before performing file operations. It helps prevent path traversal
 * attacks and ensures paths are properly formatted.
 *
 * @param filePath - The file path to validate
 * @returns Object containing validation result and any error messages
 *
 * @example
 * ```typescript
 * const validation = validateFilePath('./data/rikishi.json');
 * if (!validation.isValid) {
 *   console.error('Invalid path:', validation.error);
 * }
 * ```
 *
 * @since 1.0.0
 */
export function validateFilePath(filePath: string): {
  isValid: boolean
  error?: string
} {
  if (filePath.length === 0) {
    return { isValid: false, error: 'File path cannot be empty' }
  }

  // Check for path traversal attempts
  if (filePath.includes('..') || filePath.includes('//')) {
    return { isValid: false, error: 'Path traversal detected' }
  }

  // Check for absolute paths (optional security measure)
  if (path.isAbsolute(filePath) && !filePath.startsWith(process.cwd())) {
    return {
      isValid: false,
      error: 'Absolute paths outside current directory are not allowed',
    }
  }

  // Check for invalid characters
  const invalidChars = /[<>:"|?*]/
  if (invalidChars.test(filePath)) {
    return { isValid: false, error: 'File path contains invalid characters' }
  }

  return { isValid: true }
}

/**
 * Ensures a directory exists, creating it if necessary.
 *
 * This function is useful for ensuring that output directories exist
 * before writing files, preventing "ENOENT" errors during file operations.
 *
 * @param dirPath - The directory path to ensure exists
 * @param options - Configuration options for the operation
 * @returns Promise that resolves when the directory is ready
 *
 * @example
 * ```typescript
 * await ensureDirectory('data/json');
 * await ensureDirectory('output/reports', { errorMessage: 'Failed to create output directory' });
 * ```
 *
 * @throws {Error} When directory cannot be created
 * @since 1.0.0
 */
export async function ensureDirectory(dirPath: string, options: FileOptions = {}): Promise<void> {
  const config = { ...DEFAULT_FILE_OPTIONS, ...options }

  try {
    await fs.mkdir(dirPath, { recursive: true })
    console.log(`Ensured directory exists: ${dirPath}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`${config.errorMessage}: ${message}`)
  }
}

/**
 * Checks if a file exists and is accessible.
 *
 * This function provides a safe way to check file existence without
 * throwing exceptions, useful for conditional file operations.
 *
 * @param filePath - The file path to check
 * @returns Promise that resolves to true if file exists and is accessible
 *
 * @example
 * ```typescript
 * if (await fileExists('data/rikishi.json')) {
 *   const data = await readJSON('data/rikishi.json');
 * }
 * ```
 *
 * @since 1.0.0
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

/**
 * Gets file information including size, modification time, and type.
 *
 * This function is useful for file management, cache validation,
 * and determining if files need to be updated or refreshed.
 *
 * @param filePath - The file path to get information for
 * @returns Promise that resolves to file information or null if file doesn't exist
 *
 * @example
 * ```typescript
 * const info = await getFileInfo('data/rikishi.json');
 * if (info) {
 *   console.log(`File size: ${info.size} bytes`);
 *   console.log(`Last modified: ${info.modified}`);
 * }
 * ```
 *
 * @since 1.0.0
 */
export async function getFileInfo(filePath: string): Promise<{
  size: number
  modified: Date
  isFile: boolean
  isDirectory: boolean
} | null> {
  try {
    const stats = await fs.stat(filePath)
    return {
      size: stats.size,
      modified: stats.mtime,
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory(),
    }
  } catch {
    return null
  }
}

/**
 * Safely deletes a file with error handling.
 *
 * This function provides a safe way to delete files without throwing
 * exceptions if the file doesn't exist or cannot be deleted.
 *
 * @param filePath - The file path to delete
 * @param options - Configuration options for the operation
 * @returns Promise that resolves to true if file was deleted, false if it didn't exist
 *
 * @example
 * ```typescript
 * const deleted = await deleteFile('temp/cache.json');
 * if (deleted) {
 *   console.log('Cache file deleted successfully');
 * }
 * ```
 *
 * @throws {Error} When file exists but cannot be deleted
 * @since 1.0.0
 */
export async function deleteFile(filePath: string, options: FileOptions = {}): Promise<boolean> {
  const config = { ...DEFAULT_FILE_OPTIONS, ...options }

  try {
    await fs.unlink(filePath)
    console.log(`Deleted file: ${filePath}`)
    return true
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      // File doesn't exist, not an error
      return false
    }
    const message = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`${config.errorMessage}: ${message}`)
  }
}
