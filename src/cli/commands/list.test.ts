import { testCommandConfiguration } from '@/cli/commands/__tests__/command-test-utils'
import { createListCommand } from '@/cli/commands/list'

testCommandConfiguration({
  name: 'list',
  description: 'List available data files',
  createCommand: createListCommand,
})
