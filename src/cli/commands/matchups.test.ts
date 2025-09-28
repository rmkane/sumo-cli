import { testCommandConfiguration } from '@/cli/commands/__tests__/command-test-utils'
import { createMatchupsCommand } from '@/cli/commands/matchups'

testCommandConfiguration({
  name: 'matchups',
  description: 'Download matchup data for a specific tournament day (1-15) and save as CSV files',
  createCommand: createMatchupsCommand,
})
