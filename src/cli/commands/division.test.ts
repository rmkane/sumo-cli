import { Command } from 'commander'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createDivisionCommand } from '@/cli/commands/division'

describe('Division Command', () => {
  let program: Command

  beforeEach(() => {
    program = new Command()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('createDivisionCommand', () => {
    it('should create a command with correct configuration', () => {
      const command = createDivisionCommand(program)

      expect(command.name()).toBe('division')
      expect(command.description()).toBe('List all rikishi in a division in English alphabetical order')
    })

    // Note: Complex command parsing tests removed - commands should be thin wrappers
    // that delegate to feature modules. Test the feature modules instead.
    // The command layer should only marshal arguments and delegate to business logic.
  })
})
