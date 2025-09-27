import { describe, expect, it } from 'vitest'

import { getCurrentTournament } from '@/services/tournament'

describe('getCurrentTournament', () => {
  it('should return September 2025 tournament for September 21, 2025', () => {
    const date = new Date(2025, 8, 21) // September 21, 2025
    const tournament = getCurrentTournament(date)

    expect(tournament.tournamentMonth).toBe('September')
    expect(tournament.startDate.getFullYear()).toBe(2025)
    expect(tournament.startDate.getMonth()).toBe(8) // September (0-indexed)
    expect(tournament.startDate.getDate()).toBe(14) // 2nd Sunday (correct for 2025)
    expect(tournament.isActive).toBe(true)
    expect(tournament.dayNumber).toBe(8) // Day 8 of tournament
    expect(tournament.venue.name).toBe('Ryōgoku Kokugikan')
    expect(tournament.venue.location).toBe('Tokyo')
  })

  it('should return November 2025 tournament for October 15, 2025', () => {
    const date = new Date(2025, 9, 15) // October 15, 2025
    const tournament = getCurrentTournament(date)

    expect(tournament.tournamentMonth).toBe('November')
    expect(tournament.startDate.getFullYear()).toBe(2025)
    expect(tournament.startDate.getMonth()).toBe(10) // November (0-indexed)
    expect(tournament.startDate.getDate()).toBe(9) // 2nd Sunday (correct for 2025)
    expect(tournament.isActive).toBe(false)
    expect(tournament.dayNumber).toBe(undefined)
    expect(tournament.venue.name).toBe('Kokusai Center')
    expect(tournament.venue.location).toBe('Fukuoka')
  })

  it('should calculate correct tournament end date (15 days)', () => {
    const date = new Date(2025, 8, 21) // September 21, 2025
    const tournament = getCurrentTournament(date)

    const expectedEndDate = new Date(2025, 8, 28) // September 28, 2025 (15 days after Sep 14)
    expect(tournament.endDate.getTime()).toBe(expectedEndDate.getTime())
  })

  it('should return correct day number for tournament start date', () => {
    const startDate = new Date(2025, 8, 14) // September 14, 2025 (tournament start)
    const tournament = getCurrentTournament(startDate)

    expect(tournament.isActive).toBe(true)
    expect(tournament.dayNumber).toBe(1)
  })

  it('should return correct day number for tournament end date', () => {
    const endDate = new Date(2025, 8, 28) // September 28, 2025 (tournament end)
    const tournament = getCurrentTournament(endDate)

    expect(tournament.isActive).toBe(true)
    expect(tournament.dayNumber).toBe(15)
  })

  it('should return correct venue for March tournament', () => {
    const date = new Date(2025, 2, 15) // March 15, 2025
    const tournament = getCurrentTournament(date)

    expect(tournament.venue.name).toBe('EDION Arena')
    expect(tournament.venue.location).toBe('Osaka')
  })

  it('should return correct venue for July tournament', () => {
    const date = new Date(2025, 6, 15) // July 15, 2025
    const tournament = getCurrentTournament(date)

    expect(tournament.venue.name).toBe('Dolphins Arena')
    expect(tournament.venue.location).toBe('Nagoya')
  })

  it('should return correct venue for January tournament', () => {
    const date = new Date(2025, 0, 15) // January 15, 2025
    const tournament = getCurrentTournament(date)

    expect(tournament.venue.name).toBe('Ryōgoku Kokugikan')
    expect(tournament.venue.location).toBe('Tokyo')
  })

  it('should return correct venue for May tournament', () => {
    const date = new Date(2025, 4, 15) // May 15, 2025
    const tournament = getCurrentTournament(date)

    expect(tournament.venue.name).toBe('Ryōgoku Kokugikan')
    expect(tournament.venue.location).toBe('Tokyo')
  })

  it('should always use 2nd Sunday for March tournament', () => {
    const date = new Date(2025, 2, 15) // March 15, 2025
    const tournament = getCurrentTournament(date)

    expect(tournament.startDate.getDate()).toBe(9) // March 9th (2nd Sunday)
    expect(tournament.startDate.getMonth()).toBe(2) // March (0-indexed)
  })

  it('should always use 2nd Sunday for September tournament', () => {
    const date = new Date(2025, 8, 15) // September 15, 2025
    const tournament = getCurrentTournament(date)

    expect(tournament.startDate.getDate()).toBe(14) // September 14th (2nd Sunday)
    expect(tournament.startDate.getMonth()).toBe(8) // September (0-indexed)
  })

  it('should always use 2nd Sunday for November tournament', () => {
    const date = new Date(2025, 10, 15) // November 15, 2025
    const tournament = getCurrentTournament(date)

    expect(tournament.startDate.getDate()).toBe(9) // November 9th (2nd Sunday)
    expect(tournament.startDate.getMonth()).toBe(10) // November (0-indexed)
  })
})
