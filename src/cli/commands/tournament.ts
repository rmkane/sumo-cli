import { Command } from 'commander'

import { getCurrentTournament } from '@/services/tournament'
import { formatTournamentDate } from '@/utils/date-formatter.js'

export function createTournamentCommand(program: Command): Command {
  return (
    program
      .command('tournament [date]')
      .description('Get current or next tournament information for a given date (YYYY-MM-DD)')
      // eslint-disable-next-line no-unused-vars
      .action(async (date, _options) => {
        try {
          let checkDate: Date | undefined
          if (date) {
            const [year, month, day] = date.split('-').map(Number)
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
      })
  )
}
