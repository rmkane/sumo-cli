import { Command } from 'commander'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createTournamentCommand } from '@/cli/commands/tournament'

describe('Tournament Command', () => {
  let program: Command

  beforeEach(() => {
    program = new Command()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('createTournamentCommand', () => {
    it('should create a command with correct configuration', () => {
      const command = createTournamentCommand(program)

      expect(command.name()).toBe('tournament')
      expect(command.description()).toBe('Get current or next tournament information for a given date (YYYY-MM-DD)')
    })
  })
})
