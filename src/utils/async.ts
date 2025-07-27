/**
 * Creates a promise that resolves after a specified number of milliseconds.
 *
 * Useful for adding delays in async operations.
 * @param ms - The number of milliseconds to sleep
 * @returns Promise that resolves after the specified delay
 * @example
 * await sleep(1000); // Sleep for 1 second
 * await sleep(500);  // Sleep for 500ms
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
