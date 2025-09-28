import { testCommandConfiguration } from '@/cli/commands/__tests__/command-test-utils'
import { createDivisionCommand } from '@/cli/commands/division'

testCommandConfiguration({
  name: 'division',
  description: 'List all rikishi in a division in English alphabetical order',
  createCommand: createDivisionCommand,
})
