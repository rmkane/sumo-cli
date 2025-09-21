import path from 'node:path'

import winston from 'winston'

import { DATA_DIRS, DATA_PATHS } from '@/config/data'

/**
 * Professional logging configuration using Winston
 */

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
}

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
}

// Tell winston about the colors
winston.addColors(colors)

// Define log format
// Define format for console output - simple format without timestamps
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => `${info.message}`),
)

// Define format for file output - with timestamps
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.json(),
)

// Define transports
// Determine console log level based on verbose flag
const isVerbose = process.argv.includes('--verbose') || process.argv.includes('-v')
const consoleLevel = isVerbose ? 'debug' : 'error' // Only show errors by default, debug when verbose

const transports = [
  // Console transport - only show errors by default, debug when verbose
  new winston.transports.Console({
    level: consoleLevel,
    format: consoleFormat,
  }),

  // File transport for errors
  new winston.transports.File({
    filename: path.join(DATA_PATHS.USER_DATA_DIR, DATA_DIRS.LOGS, 'error.log'),
    level: 'error',
    format: fileFormat,
  }),

  // File transport for all logs (including debug)
  new winston.transports.File({
    filename: path.join(DATA_PATHS.USER_DATA_DIR, DATA_DIRS.LOGS, 'combined.log'),
    level: 'debug', // Capture all log levels in files
    format: fileFormat,
  }),
]

// Create the logger
const logger = winston.createLogger({
  level: 'debug', // Always capture all levels, console transport controls what's shown
  levels,
  transports,
})

/**
 * Professional logging utility for consistent formatting across the application.
 */

/**
 * Logs the start of a processing operation.
 *
 * @param operation - Name of the operation being started
 * @param details - Optional additional details
 *
 * @example
 * ```typescript
 * logProcessingStart('division processing', 'Makuuchi')
 * // Output: "2024-01-15 10:30:45 info: Processing division processing (Makuuchi)"
 * ```
 */
export function logProcessingStart(operation: string, details?: string): void {
  const message = details ? `${operation} (${details})` : operation
  logger.info(`Processing ${message}`)
}

/**
 * Logs the completion of a processing operation with count.
 *
 * @param operation - Name of the operation completed
 * @param count - Number of items processed
 * @param details - Optional additional details
 *
 * @example
 * ```typescript
 * logProcessingComplete('matchups', 15, 'Makuuchi day 1')
 * // Output: "2024-01-15 10:30:45 info: Processed 15 matchups (Makuuchi day 1)"
 * ```
 */
export function logProcessingComplete(operation: string, count: number, details?: string): void {
  const message = details ? `${operation} for ${details}` : operation
  logger.info(`Processed ${count} ${message}`)
}

/**
 * Logs a general success message.
 *
 * @param message - Success message to log
 *
 * @example
 * ```typescript
 * logSuccess('Processing completed successfully')
 * // Output: "2024-01-15 10:30:45 info: Processing completed successfully"
 * ```
 */
export function logSuccess(message: string): void {
  logger.info(message)
}

/**
 * Logs an error with context.
 *
 * @param context - Context where the error occurred
 * @param error - The error object
 *
 * @example
 * ```typescript
 * logError('division processing', error)
 * // Output: "2024-01-15 10:30:45 error: Error processing division processing: [error details]"
 * ```
 */
export function logError(context: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error)
  logger.error(`Error processing ${context}: ${message}`)
}

/**
 * Logs a warning message.
 *
 * @param message - Warning message to log
 *
 * @example
 * ```typescript
 * logWarning('No data found for division')
 * // Output: "2024-01-15 10:30:45 warn: No data found for division"
 * ```
 */
export function logWarning(message: string): void {
  logger.warn(message)
}

/**
 * Logs debug information.
 *
 * @param message - Debug message to log
 * @param data - Optional data to include
 *
 * @example
 * ```typescript
 * logDebug('Cache hit for division', { division: 'Makuuchi', count: 42 })
 * ```
 */
export function logDebug(message: string, data?: unknown): void {
  if (data) {
    logger.debug(`${message}: ${JSON.stringify(data)}`)
  } else {
    logger.debug(message)
  }
}

/**
 * Logs HTTP request information.
 *
 * @param method - HTTP method
 * @param url - Request URL
 * @param status - Response status
 * @param duration - Request duration in ms
 *
 * @example
 * ```typescript
 * logHttp('GET', '/api/rikishi', 200, 150)
 * // Output: "2024-01-15 10:30:45 http: GET /api/rikishi 200 150ms"
 * ```
 */
export function logHttp(method: string, url: string, status: number, duration: number): void {
  logger.http(`${method} ${url} ${status} ${duration}ms`)
}

// Export the winston logger instance for advanced usage
export { logger }
