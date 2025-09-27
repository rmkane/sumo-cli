import { describe, expect, it } from 'vitest'

import { RateLimitedQueue } from '@/core/classes/queue'

describe('RateLimitedQueue', () => {
  it('should execute tasks with rate limiting', async () => {
    const queue = new RateLimitedQueue(100) // 100ms delay
    const startTime = Date.now()
    const results: string[] = []
    const timestamps: number[] = []

    const promises = [
      queue.add(async () => {
        const timestamp = Date.now() - startTime
        timestamps.push(timestamp)
        results.push('result1')
        return 'result1'
      }),
      queue.add(async () => {
        const timestamp = Date.now() - startTime
        timestamps.push(timestamp)
        results.push('result2')
        return 'result2'
      }),
      queue.add(async () => {
        const timestamp = Date.now() - startTime
        timestamps.push(timestamp)
        results.push('result3')
        return 'result3'
      }),
    ]

    const allResults = await Promise.all(promises)
    const totalTime = Date.now() - startTime

    // Verify all results are returned
    expect(allResults).toEqual(['result1', 'result2', 'result3'])
    expect(results).toEqual(['result1', 'result2', 'result3'])

    // Verify rate limiting (tasks should be spaced by at least 100ms)
    expect(timestamps.length).toBe(3)

    const timestamp0 = timestamps[0] ?? 0
    const timestamp1 = timestamps[1] ?? 0
    const timestamp2 = timestamps[2] ?? 0

    expect(timestamp1 - timestamp0).toBeGreaterThanOrEqual(90) // Allow small tolerance
    expect(timestamp2 - timestamp1).toBeGreaterThanOrEqual(90)

    // Total time should be at least 200ms (2 delays between 3 tasks)
    expect(totalTime).toBeGreaterThanOrEqual(180)
  })

  it('should handle single task without delay', async () => {
    const queue = new RateLimitedQueue(100)
    const startTime = Date.now()

    const result = await queue.add(async () => 'single result')
    const totalTime = Date.now() - startTime

    expect(result).toBe('single result')
    expect(totalTime).toBeLessThan(50) // Should be fast for single task
  })

  it('should handle errors gracefully', async () => {
    const queue = new RateLimitedQueue(100)

    await expect(
      queue.add(async () => {
        throw new Error('Test error')
      }),
    ).rejects.toThrow('Test error')
  })
})
