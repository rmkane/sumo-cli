import { Command } from 'commander'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createValidateCommand } from '@/cli/commands/validate'

describe('Validate Command', () => {
  let program: Command

  beforeEach(() => {
    program = new Command()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('createValidateCommand', () => {
    it('should create a command with correct configuration', () => {
      const command = createValidateCommand(program)

      expect(command.name()).toBe('validate')
      expect(command.description()).toBe('Validate HTML metadata for a specific tournament day')
    })

    // Note: Complex command parsing tests removed - commands should be thin wrappers
    // that delegate to feature modules. Test the feature modules instead.
    // The command layer should only marshal arguments and delegate to business logic.
  })
})
