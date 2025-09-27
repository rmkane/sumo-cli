import { getCurrentTournament } from '@/services/tournament'
import { formatTournamentDate } from '@/utils/date-formatter'

export interface TournamentCommandContext {
  date?: string
}

/**
 * Handles tournament command business logic and console output
 */
export async function handleTournamentCommand(context: TournamentCommandContext): Promise<void> {
  try {
    let checkDate: Date | undefined
    if (context.date) {
      const [year, month, day] = context.date.split('-').map(Number)
      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        console.error('Error: Date must be in YYYY-MM-DD format')
        process.exit(1)
      }
      checkDate = new Date(year, month - 1, day)
    }

    const tournament = getCurrentTournament(checkDate)

    console.log(`\n🏆 Tournament Information:`)
    console.log(`📅 Tournament: ${tournament.tournamentMonth} ${tournament.startDate.getFullYear()}`)
    console.log(`🏟️ Venue: ${tournament.venue.name} (${tournament.venue.location})`)
    console.log(`📆 Start Date: ${formatTournamentDate(tournament.startDate)}`)
    console.log(`📆 End Date: ${formatTournamentDate(tournament.endDate)}`)
    console.log(`🎯 Status: ${tournament.isActive ? 'Active' : 'Upcoming'}`)

    if (tournament.dayNumber) {
      console.log(`📊 Current Day: ${tournament.dayNumber}/15`)
    }
  } catch (error) {
    console.error(`Error getting tournament info:`, error)
    process.exit(1)
  }
}
