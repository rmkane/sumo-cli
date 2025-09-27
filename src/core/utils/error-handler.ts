/**
 * Utility functions for consistent error handling across the application.
 */

/**
 * Wraps an async function with consistent error handling.
 * Logs errors and re-throws them with context.
 *
 * @param fn - Async function to wrap
 * @param context - Context string for error messages
 * @returns Wrapped function with error handling
 *
 * @example
 * ```typescript
 * const safeProcessor = withErrorHandling(
 *   async (data) => { ... },
 *   'data processing'
 * )
 * ```
 */
export function withErrorHandling<T extends unknown[], R>(
  // eslint-disable-next-line no-unused-vars
  fn: (...args: T) => Promise<R>,
  context: string,
  // eslint-disable-next-line no-unused-vars
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args)
    } catch (error) {
      console.error(`Error in ${context}:`, error)
      throw error
    }
  }
}

/**
 * Executes a function with error handling and returns a result object.
 * Useful when you want to handle errors gracefully without throwing.
 *
 * @param fn - Function to execute
 * @param context - Context string for error messages
 * @returns Object with success status and result/error
 *
 * @example
 * ```typescript
 * const result = await safeExecute(
 *   () => processData(data),
 *   'data processing'
 * )
 *
 * if (result.success) {
 *   console.log('Success:', result.data)
 * } else {
 *   console.error('Failed:', result.error)
 * }
 * ```
 */
export async function safeExecute<T>(
  fn: () => Promise<T>,
  context: string,
): Promise<{ success: true; data: T } | { success: false; error: unknown }> {
  try {
    const data = await fn()
    return { success: true, data }
  } catch (error) {
    console.error(`Error in ${context}:`, error)
    return { success: false, error }
  }
}

/**
 * Creates a standardized error message with context.
 *
 * @param context - Context where the error occurred
 * @param error - The error object
 * @returns Formatted error message
 */
export function createErrorMessage(context: string, error: unknown): string {
  const message = error instanceof Error ? error.message : String(error)
  return `Error in ${context}: ${message}`
}
