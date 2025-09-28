import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getCurrentTournament } from '@/core/services/tournament'
import { formatTournamentDate } from '@/core/utils/date-formatter'
import type { TournamentCommandContext } from '@/features/tournament/command-handler'
import { handleTournamentCommand } from '@/features/tournament/command-handler'

// Mock dependencies
vi.mock('@/core/services/tournament')
vi.mock('@/core/utils/date-formatter')

const mockGetCurrentTournament = vi.mocked(getCurrentTournament)
const mockFormatTournamentDate = vi.mocked(formatTournamentDate)

// Mock console methods
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
const mockProcessExit = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never)

describe('Tournament Command Handler', () => {
  const mockTournament = {
    tournamentMonth: 'January',
    startDate: new Date(2024, 0, 14), // January 14, 2024
    endDate: new Date(2024, 0, 28), // January 28, 2024
    venue: {
      name: 'Ryogoku Kokugikan',
      location: 'Tokyo',
    },
    isActive: true,
    dayNumber: 5,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockFormatTournamentDate.mockReturnValue('2024-01-14')
  })

  describe('handleTournamentCommand', () => {
    it('should handle tournament info without date', async () => {
      const context: TournamentCommandContext = {}

      mockGetCurrentTournament.mockReturnValue(mockTournament)

      await handleTournamentCommand(context)

      expect(mockGetCurrentTournament).toHaveBeenCalledWith(undefined)
      expect(mockConsoleLog).toHaveBeenCalledWith('\n🏆 Tournament Information:')
      expect(mockConsoleLog).toHaveBeenCalledWith('📅 Tournament: January 2024')
      expect(mockConsoleLog).toHaveBeenCalledWith('🏟️ Venue: Ryogoku Kokugikan (Tokyo)')
      expect(mockConsoleLog).toHaveBeenCalledWith('📆 Start Date: 2024-01-14')
      expect(mockConsoleLog).toHaveBeenCalledWith('📆 End Date: 2024-01-14')
      expect(mockConsoleLog).toHaveBeenCalledWith('🎯 Status: Active')
      expect(mockConsoleLog).toHaveBeenCalledWith('📊 Current Day: 5/15')
    })

    it('should handle tournament info with valid date', async () => {
      const context: TournamentCommandContext = {
        date: '2024-03-10',
      }

      mockGetCurrentTournament.mockReturnValue(mockTournament)

      await handleTournamentCommand(context)

      expect(mockGetCurrentTournament).toHaveBeenCalledWith(new Date(2024, 2, 10)) // March 10, 2024
      expect(mockConsoleLog).toHaveBeenCalledWith('\n🏆 Tournament Information:')
      expect(mockConsoleLog).toHaveBeenCalledWith('📅 Tournament: January 2024')
      expect(mockConsoleLog).toHaveBeenCalledWith('🏟️ Venue: Ryogoku Kokugikan (Tokyo)')
      expect(mockConsoleLog).toHaveBeenCalledWith('📆 Start Date: 2024-01-14')
      expect(mockConsoleLog).toHaveBeenCalledWith('📆 End Date: 2024-01-14')
      expect(mockConsoleLog).toHaveBeenCalledWith('🎯 Status: Active')
      expect(mockConsoleLog).toHaveBeenCalledWith('📊 Current Day: 5/15')
    })

    it('should handle tournament without day number', async () => {
      const context: TournamentCommandContext = {}

      const tournamentWithoutDay = {
        ...mockTournament,
        dayNumber: undefined,
      }

      mockGetCurrentTournament.mockReturnValue(tournamentWithoutDay)

      await handleTournamentCommand(context)

      expect(mockConsoleLog).toHaveBeenCalledWith('\n🏆 Tournament Information:')
      expect(mockConsoleLog).toHaveBeenCalledWith('📅 Tournament: January 2024')
      expect(mockConsoleLog).toHaveBeenCalledWith('🏟️ Venue: Ryogoku Kokugikan (Tokyo)')
      expect(mockConsoleLog).toHaveBeenCalledWith('📆 Start Date: 2024-01-14')
      expect(mockConsoleLog).toHaveBeenCalledWith('📆 End Date: 2024-01-14')
      expect(mockConsoleLog).toHaveBeenCalledWith('🎯 Status: Active')
      // Should not log current day when dayNumber is undefined
      expect(mockConsoleLog).not.toHaveBeenCalledWith('📊 Current Day: 5/15')
    })

    it('should handle upcoming tournament', async () => {
      const context: TournamentCommandContext = {}

      const upcomingTournament = {
        ...mockTournament,
        isActive: false,
        dayNumber: undefined,
      }

      mockGetCurrentTournament.mockReturnValue(upcomingTournament)

      await handleTournamentCommand(context)

      expect(mockConsoleLog).toHaveBeenCalledWith('🎯 Status: Upcoming')
    })

    it('should handle invalid date format', async () => {
      const context: TournamentCommandContext = {
        date: 'invalid-date',
      }

      await handleTournamentCommand(context)

      expect(mockConsoleError).toHaveBeenCalledWith('Error: Date must be in YYYY-MM-DD format')
      expect(mockProcessExit).toHaveBeenCalledWith(1)
      // Note: process.exit doesn't actually exit in tests, so getCurrentTournament may still be called
    })

    it('should handle date with non-numeric parts', async () => {
      const context: TournamentCommandContext = {
        date: '2024-abc-10',
      }

      await handleTournamentCommand(context)

      expect(mockConsoleError).toHaveBeenCalledWith('Error: Date must be in YYYY-MM-DD format')
      expect(mockProcessExit).toHaveBeenCalledWith(1)
    })

    it('should handle date with missing parts', async () => {
      const context: TournamentCommandContext = {
        date: '2024-01',
      }

      await handleTournamentCommand(context)

      expect(mockConsoleError).toHaveBeenCalledWith('Error: Date must be in YYYY-MM-DD format')
      expect(mockProcessExit).toHaveBeenCalledWith(1)
    })

    it('should handle service errors', async () => {
      const context: TournamentCommandContext = {}

      const error = new Error('Service error')
      mockGetCurrentTournament.mockImplementation(() => {
        throw error
      })

      await handleTournamentCommand(context)

      expect(mockConsoleError).toHaveBeenCalledWith('Error getting tournament info:', error)
      expect(mockProcessExit).toHaveBeenCalledWith(1)
    })

    it('should handle non-Error exceptions', async () => {
      const context: TournamentCommandContext = {}

      mockGetCurrentTournament.mockImplementation(() => {
        throw 'String error'
      })

      await handleTournamentCommand(context)

      expect(mockConsoleError).toHaveBeenCalledWith('Error getting tournament info:', 'String error')
      expect(mockProcessExit).toHaveBeenCalledWith(1)
    })

    it('should handle edge case dates', async () => {
      const context: TournamentCommandContext = {
        date: '2024-12-31',
      }

      mockGetCurrentTournament.mockReturnValue(mockTournament)

      await handleTournamentCommand(context)

      expect(mockGetCurrentTournament).toHaveBeenCalledWith(new Date(2024, 11, 31)) // December 31, 2024
    })
  })
})
