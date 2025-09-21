/**
 * Centralized logging utility for consistent formatting across the application.
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
 * // Output: "=== Processing division processing (Makuuchi) ==="
 * ```
 */
export function logProcessingStart(operation: string, details?: string): void {
  const message = details ? `${operation} (${details})` : operation
  console.log(`\n=== Processing ${message} ===`)
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
 * // Output: "Processed 15 matchups for Makuuchi day 1"
 * ```
 */
export function logProcessingComplete(operation: string, count: number, details?: string): void {
  const message = details ? `${operation} for ${details}` : operation
  console.log(`Processed ${count} ${message}`)
}

/**
 * Logs a general success message.
 *
 * @param message - Success message to log
 *
 * @example
 * ```typescript
 * logSuccess('Processing completed successfully')
 * // Output: "=== Processing completed successfully ==="
 * ```
 */
export function logSuccess(message: string): void {
  console.log(`\n=== ${message} ===`)
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
 * // Output: "Error processing division processing: [error details]"
 * ```
 */
export function logError(context: string, error: unknown): void {
  console.error(`Error processing ${context}:`, error)
}

/**
 * Logs a warning message.
 *
 * @param message - Warning message to log
 *
 * @example
 * ```typescript
 * logWarning('No data found for division')
 * ```
 */
export function logWarning(message: string): void {
  console.warn(message)
}
