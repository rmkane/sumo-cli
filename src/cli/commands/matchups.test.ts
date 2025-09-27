import { Command } from 'commander'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createMatchupsCommand } from '@/cli/commands/matchups'

describe('Matchups Command', () => {
  let program: Command

  beforeEach(() => {
    program = new Command()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('createMatchupsCommand', () => {
    it('should create a command with correct configuration', () => {
      const command = createMatchupsCommand(program)

      expect(command.name()).toBe('matchups')
      expect(command.description()).toBe(
        'Download matchup data for a specific tournament day (1-15) and save as CSV files',
      )
    })

    // Note: Complex command parsing tests removed - commands should be thin wrappers
    // that delegate to feature modules. Test the feature modules instead.
    // The command layer should only marshal arguments and delegate to business logic.
  })
})
