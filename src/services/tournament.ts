import { TournamentConstants } from '@/constants'
import type { TournamentInfo, TournamentVenue } from '@/types'

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24

/**
 * Calculates the tournament start date for odd months.
 * Tournaments run in January, March, May, July, September, November.
 * Algorithm: Always use the 2nd Sunday of odd months.
 *
 * @param year - The year
 * @param month - The month (1-12)
 * @returns Tournament start date or null if not a tournament month
 */
export function getTournamentStartDate(year: number, month: number): Date | null {
  // Only odd months have tournaments
  if (month % 2 === 0) return null

  // Find the first Sunday of the month
  const firstDay = new Date(year, month - 1, 1)
  const firstSunday = new Date(firstDay)

  // Find first Sunday
  const dayOfWeek = firstDay.getDay()
  const daysToFirstSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek
  firstSunday.setDate(firstDay.getDate() + daysToFirstSunday)

  // Always use the second Sunday (7 days later)
  const secondSunday = new Date(firstSunday)
  secondSunday.setDate(firstSunday.getDate() + 7)

  return secondSunday
}

/**
 * Gets the current or next tournament for a given date.
 *
 * @param date - The date to check (defaults to current JST time)
 * @returns Object containing tournament info
 */
export function getCurrentTournament(date?: Date): TournamentInfo {
  const checkDate = date ?? new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }))
  const year = checkDate.getFullYear()
  const month = checkDate.getMonth() + 1

  // Check current month first
  let tournamentStart = getTournamentStartDate(year, month)
  let tournamentMonth = month

  // If no tournament in current month, find next tournament month
  if (!tournamentStart) {
    // Find next odd month
    let nextMonth = month + 1

    while (nextMonth <= 12) {
      if (nextMonth % 2 === 1) {
        tournamentStart = getTournamentStartDate(year, nextMonth)
        tournamentMonth = nextMonth
        break
      }
      nextMonth++
    }

    // If no tournament found in current year, check January of next year
    if (!tournamentStart) {
      tournamentStart = getTournamentStartDate(year + 1, 1)
      tournamentMonth = 1
    }
  }

  if (!tournamentStart) {
    throw new Error('No tournament found')
  }

  // Calculate tournament end date (15 days after start)
  const tournamentEnd = new Date(tournamentStart)
  tournamentEnd.setDate(tournamentStart.getDate() + TournamentConstants.TOTAL_DAYS - 1) // 15 days total (start + 14 more)

  // Check if tournament is currently active
  const isActive = checkDate >= tournamentStart && checkDate <= tournamentEnd

  // Calculate current day number if tournament is active
  let dayNumber: number | undefined = undefined
  if (isActive) {
    dayNumber =
      Math.floor((checkDate.getTime() - tournamentStart.getTime()) / MILLISECONDS_PER_DAY) +
      TournamentConstants.FIRST_DAY
  }

  const monthNames: { [key: number]: string } = {
    1: 'January', // Tokyo
    3: 'March',
    5: 'May', // Tokyo
    7: 'July',
    9: 'September', // Tokyo
    11: 'November',
  }
  const tournamentMonthName = monthNames[tournamentMonth] ?? 'Unknown'

  // Venue information for each tournament month
  const venues: { [key: number]: TournamentVenue } = {
    1: { name: 'Ryōgoku Kokugikan', location: 'Tokyo' },
    3: { name: 'EDION Arena', location: 'Osaka' },
    5: { name: 'Ryōgoku Kokugikan', location: 'Tokyo' },
    7: { name: 'Dolphins Arena', location: 'Nagoya' },
    9: { name: 'Ryōgoku Kokugikan', location: 'Tokyo' },
    11: { name: 'Kokusai Center', location: 'Fukuoka' },
  }
  const venue = venues[tournamentMonth] ?? { name: 'Unknown', location: 'Unknown' }

  return {
    startDate: tournamentStart,
    endDate: tournamentEnd,
    dayNumber,
    isActive,
    tournamentMonth: tournamentMonthName,
    venue,
  }
}

/**
 * Determines if a tournament day should be available based on current JST time.
 * Sumo matchups are typically announced the day before.
 *
 * @param requestedDay - The tournament day being requested
 * @param actualDate - The actual date from HTML (format: YYYY-MM-DD)
 * @returns true if the day should be available, false otherwise
 */
export function isDayAvailable(requestedDay: number, actualDate: string | null): boolean {
  if (actualDate === null || actualDate === '') return false

  const [year, month, day] = actualDate.split('-').map(Number)
  const htmlDate = new Date(year, month - 1, day)

  // Calculate tournament start date (2nd Sunday of odd months)
  const tournamentStartDate = getTournamentStartDate(year, month)
  if (!tournamentStartDate) return false

  const daysSinceStart = Math.floor((htmlDate.getTime() - tournamentStartDate.getTime()) / MILLISECONDS_PER_DAY) + 1

  // Allow data up to 1 day ahead (matchups announced the day before)
  const maxAllowedDay = daysSinceStart + 1

  return requestedDay <= maxAllowedDay
}
