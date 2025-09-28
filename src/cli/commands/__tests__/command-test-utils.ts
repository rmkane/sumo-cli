import { Command } from 'commander'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * Configuration for testing CLI commands
 */
export interface CommandTestConfig {
  /** The command name (e.g., 'matchups', 'stats') */
  name: string
  /** The expected command description */
  description: string
  /** Function that creates the command */
  // eslint-disable-next-line no-unused-vars
  createCommand: (_program: Command) => Command
}

/**
 * Parameterized test utility for CLI command configuration testing.
 *
 * This utility eliminates repetitive test code by providing a standardized
 * way to test that commands are created with the correct name and description.
 *
 * @param config - Command test configuration
 *
 * @example
 * ```typescript
 * testCommandConfiguration({
 *   name: 'matchups',
 *   description: 'Download matchup data for a specific tournament day (1-15) and save as CSV files',
 *   createCommand: createMatchupsCommand
 * })
 * ```
 */
export function testCommandConfiguration(config: CommandTestConfig): void {
  describe(`${config.name} Command`, () => {
    let program: Command

    beforeEach(() => {
      program = new Command()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    describe(`create${config.name.charAt(0).toUpperCase() + config.name.slice(1)}Command`, () => {
      it('should create a command with correct configuration', () => {
        const command = config.createCommand(program)

        expect(command.name()).toBe(config.name)
        expect(command.description()).toBe(config.description)
      })
    })
  })
}
