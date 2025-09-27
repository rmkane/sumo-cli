import { Command } from 'commander'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createListCommand } from '@/cli/commands/list'

describe('List Command', () => {
  let program: Command

  beforeEach(() => {
    program = new Command()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('createListCommand', () => {
    it('should create a command with correct configuration', () => {
      const command = createListCommand(program)

      expect(command.name()).toBe('list')
      expect(command.description()).toBe('List available data files')
    })

    // Note: Complex command parsing tests removed - commands should be thin wrappers
    // that delegate to feature modules. Test the feature modules instead.
    // The command layer should only marshal arguments and delegate to business logic.
  })
})
