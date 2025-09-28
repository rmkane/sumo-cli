import { testCommandConfiguration } from '@/cli/commands/__tests__/command-test-utils'
import { createTournamentCommand } from '@/cli/commands/tournament'

testCommandConfiguration({
  name: 'tournament',
  description: 'Get current or next tournament information for a given date (YYYY-MM-DD)',
  createCommand: createTournamentCommand,
})
