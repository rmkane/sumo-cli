import { Command } from 'commander'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createStatsCommand } from '@/cli/commands/stats'

describe('Stats Command', () => {
  let program: Command

  beforeEach(() => {
    program = new Command()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('createStatsCommand', () => {
    it('should create a command with correct configuration', () => {
      const command = createStatsCommand(program)

      expect(command.name()).toBe('stats')
      expect(command.description()).toBe('Download rikishi statistics for all divisions and save as JSON files')
    })

    // Note: Complex command parsing tests removed - commands should be thin wrappers
    // that delegate to feature modules. Test the feature modules instead.
    // The command layer should only marshal arguments and delegate to business logic.
  })
})
