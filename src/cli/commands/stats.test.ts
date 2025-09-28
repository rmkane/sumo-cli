import { testCommandConfiguration } from '@/cli/commands/__tests__/command-test-utils'
import { createStatsCommand } from '@/cli/commands/stats'

testCommandConfiguration({
  name: 'stats',
  description: 'Download rikishi statistics for all divisions and save as JSON files',
  createCommand: createStatsCommand,
})
