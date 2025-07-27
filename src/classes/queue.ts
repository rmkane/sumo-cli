/**
 * A simple queue system for managing rate-limited operations.
 * Ensures operations are executed with a minimum delay between them.
 */
export class RateLimitedQueue {
  private queue: Array<() => Promise<any>> = []
  private processing = false
  private delayMs: number

  constructor(delayMs: number = 2000) {
    this.delayMs = delayMs
  }

  /**
   * Adds a task to the queue and processes it when ready.
   *
   * @param task - The async function to execute
   * @returns Promise that resolves with the task result
   */
  async add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task()
          resolve(result)
          return result
        } catch (error) {
          reject(error)
          // Don't re-throw the error to avoid unhandled rejections
          return
        }
      })

      this.processQueue()
    })
  }

  /**
   * Processes the queue with rate limiting.
   */
  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return
    }

    this.processing = true

    while (this.queue.length > 0) {
      const task = this.queue.shift()
      if (task) {
        await task()

        // Add delay between tasks (except for the last one)
        if (this.queue.length > 0) {
          await new Promise((resolve) => setTimeout(resolve, this.delayMs))
        }
      }
    }

    this.processing = false
  }

  /**
   * Gets the current queue length.
   */
  get length(): number {
    return this.queue.length
  }

  /**
   * Checks if the queue is currently processing.
   */
  get isProcessing(): boolean {
    return this.processing
  }
}
