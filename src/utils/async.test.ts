import { describe, expect, it, vi } from 'vitest'

import { sleep } from '@/utils/async'

describe('Async Utils', () => {
  describe('sleep', () => {
    it('should resolve after specified milliseconds', async () => {
      const start = Date.now()
      await sleep(100)
      const end = Date.now()

      // Allow some tolerance for timing
      expect(end - start).toBeGreaterThanOrEqual(90)
      expect(end - start).toBeLessThan(200)
    })

    it('should resolve immediately for zero delay', async () => {
      const start = Date.now()
      await sleep(0)
      const end = Date.now()

      // Should be very fast (allow some tolerance for timing)
      expect(end - start).toBeLessThan(50)
    })

    it('should handle negative delays by resolving immediately', async () => {
      const start = Date.now()
      await sleep(-100)
      const end = Date.now()

      // Should resolve quickly even with negative delay (allow some tolerance)
      expect(end - start).toBeLessThan(50)
    })

    it('should work with Promise.all for parallel delays', async () => {
      const start = Date.now()
      await Promise.all([sleep(50), sleep(75), sleep(100)])
      const end = Date.now()

      // Should complete in roughly the longest delay (100ms)
      expect(end - start).toBeGreaterThanOrEqual(90)
      expect(end - start).toBeLessThan(150)
    })

    it('should work with Promise.race', async () => {
      const start = Date.now()
      await Promise.race([sleep(200), sleep(50)])
      const end = Date.now()

      // Should complete in roughly the shortest delay (50ms)
      expect(end - start).toBeGreaterThanOrEqual(40)
      expect(end - start).toBeLessThan(100)
    })
  })
})
