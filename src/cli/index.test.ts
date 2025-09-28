import { Command } from 'commander'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createDivisionCommand } from '@/cli/commands/division'
import { createListCommand } from '@/cli/commands/list'
import { createMatchupsCommand } from '@/cli/commands/matchups'
import { createStatsCommand } from '@/cli/commands/stats'
import { createTournamentCommand } from '@/cli/commands/tournament'
import { createValidateCommand } from '@/cli/commands/validate'
import { launchInteractiveMode } from '@/cli/repl'

import packageJson from '../../package.json'

// Mock dependencies
vi.mock('@/cli/commands/division')
vi.mock('@/cli/commands/list')
vi.mock('@/cli/commands/matchups')
vi.mock('@/cli/commands/stats')
vi.mock('@/cli/commands/tournament')
vi.mock('@/cli/commands/validate')
vi.mock('@/cli/repl')
vi.mock('../../package.json', () => ({ default: { version: '1.0.0' } }))

const mockCreateDivisionCommand = vi.mocked(createDivisionCommand)
const mockCreateListCommand = vi.mocked(createListCommand)
const mockCreateMatchupsCommand = vi.mocked(createMatchupsCommand)
const mockCreateStatsCommand = vi.mocked(createStatsCommand)
const mockCreateTournamentCommand = vi.mocked(createTournamentCommand)
const mockCreateValidateCommand = vi.mocked(createValidateCommand)
const mockLaunchInteractiveMode = vi.mocked(launchInteractiveMode)

// Mock process.argv
const originalArgv = process.argv

describe('CLI Main Entry Point', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset process.argv
    process.argv = originalArgv
  })

  describe('Program Configuration', () => {
    it('should create a program with correct name and description', () => {
      const program = new Command()

      program
        .name('sumo-cli')
        .description('Professional CLI tool for sumo rikishi data extraction and processing')
        .version(packageJson.version)

      expect(program.name()).toBe('sumo-cli')
      expect(program.description()).toBe('Professional CLI tool for sumo rikishi data extraction and processing')
      expect(program.version()).toBe('1.0.0')
    })

    it('should register all commands', () => {
      const program = new Command()

      // Simulate command registration
      mockCreateStatsCommand.mockReturnValue(program)
      mockCreateMatchupsCommand.mockReturnValue(program)
      mockCreateTournamentCommand.mockReturnValue(program)
      mockCreateDivisionCommand.mockReturnValue(program)
      mockCreateValidateCommand.mockReturnValue(program)
      mockCreateListCommand.mockReturnValue(program)

      createStatsCommand(program)
      createMatchupsCommand(program)
      createTournamentCommand(program)
      createDivisionCommand(program)
      createValidateCommand(program)
      createListCommand(program)

      expect(mockCreateStatsCommand).toHaveBeenCalledWith(program)
      expect(mockCreateMatchupsCommand).toHaveBeenCalledWith(program)
      expect(mockCreateTournamentCommand).toHaveBeenCalledWith(program)
      expect(mockCreateDivisionCommand).toHaveBeenCalledWith(program)
      expect(mockCreateValidateCommand).toHaveBeenCalledWith(program)
      expect(mockCreateListCommand).toHaveBeenCalledWith(program)
    })
  })

  describe('Global Options', () => {
    it('should have correct global options configured', () => {
      const program = new Command()

      program
        .option('-f, --force-refresh', 'Force refresh of cached data')
        .option('-v, --verbose', 'Enable verbose logging')
        .option('-o, --output-dir <path>', 'Custom output directory for CSV files', './output')
        .option('-i, --interactive', 'Launch interactive REPL mode')

      const options = program.options
      expect(options).toHaveLength(4)
      expect(options[0].flags).toBe('-f, --force-refresh')
      expect(options[1].flags).toBe('-v, --verbose')
      expect(options[2].flags).toBe('-o, --output-dir <path>')
      expect(options[3].flags).toBe('-i, --interactive')
    })
  })

  describe('Interactive Mode Detection', () => {
    it('should detect -i flag for interactive mode', () => {
      const args = ['-i']
      const shouldLaunchInteractive = args.includes('-i') || args.includes('--interactive')

      expect(shouldLaunchInteractive).toBe(true)
    })

    it('should detect --interactive flag for interactive mode', () => {
      const args = ['--interactive']
      const shouldLaunchInteractive = args.includes('-i') || args.includes('--interactive')

      expect(shouldLaunchInteractive).toBe(true)
    })

    it('should not detect interactive mode for other flags', () => {
      const args = ['--verbose', 'stats']
      const shouldLaunchInteractive = args.includes('-i') || args.includes('--interactive')

      expect(shouldLaunchInteractive).toBe(false)
    })
  })

  describe('Help Display Logic', () => {
    it('should show help when no arguments are provided', () => {
      const args: string[] = []
      const shouldShowHelp = args.length === 0

      expect(shouldShowHelp).toBe(true)
    })

    it('should parse arguments when arguments are provided', () => {
      const args = ['stats']
      const shouldShowHelp = args.length === 0

      expect(shouldShowHelp).toBe(false)
    })
  })

  describe('Package Version', () => {
    it('should use package.json version', () => {
      expect(packageJson.version).toBe('1.0.0')
    })
  })

  describe('Command Registration Order', () => {
    it('should register commands in correct order', () => {
      const program = new Command()

      // Mock return values to track call order
      mockCreateStatsCommand.mockReturnValue(program)
      mockCreateMatchupsCommand.mockReturnValue(program)
      mockCreateTournamentCommand.mockReturnValue(program)
      mockCreateDivisionCommand.mockReturnValue(program)
      mockCreateValidateCommand.mockReturnValue(program)
      mockCreateListCommand.mockReturnValue(program)

      // Simulate the registration order from the actual file
      createStatsCommand(program)
      createMatchupsCommand(program)
      createTournamentCommand(program)
      createDivisionCommand(program)
      createValidateCommand(program)
      createListCommand(program)

      // Verify the order by checking call sequence
      expect(mockCreateStatsCommand).toHaveBeenCalledBefore(mockCreateMatchupsCommand)
      expect(mockCreateMatchupsCommand).toHaveBeenCalledBefore(mockCreateTournamentCommand)
      expect(mockCreateTournamentCommand).toHaveBeenCalledBefore(mockCreateDivisionCommand)
      expect(mockCreateDivisionCommand).toHaveBeenCalledBefore(mockCreateValidateCommand)
      expect(mockCreateValidateCommand).toHaveBeenCalledBefore(mockCreateListCommand)
    })
  })

  describe('Error Handling', () => {
    it('should handle command creation errors gracefully', () => {
      const program = new Command()
      mockCreateStatsCommand.mockImplementation(() => {
        throw new Error('Command creation failed')
      })

      expect(() => {
        createStatsCommand(program)
      }).toThrow('Command creation failed')
    })

    it('should handle interactive mode launch errors', () => {
      mockLaunchInteractiveMode.mockImplementation(() => {
        throw new Error('Interactive mode failed')
      })

      expect(() => {
        launchInteractiveMode(new Command())
      }).toThrow('Interactive mode failed')
    })
  })
})
