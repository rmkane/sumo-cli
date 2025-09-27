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
  })
})
