import { testCommandConfiguration } from '@/cli/commands/__tests__/command-test-utils'
import { createValidateCommand } from '@/cli/commands/validate'

testCommandConfiguration({
  name: 'validate',
  description: 'Validate HTML metadata for a specific tournament day',
  createCommand: createValidateCommand,
})
