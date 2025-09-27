import path from 'node:path'

import { DATA_DIRS, DATA_PATHS } from '@/config/data'

export interface ListCommandContext {
  outputDir?: string
}

/**
 * Handles list command business logic and console output
 */
export async function handleListCommand(context: ListCommandContext): Promise<void> {
  const dir = context?.outputDir?.trim() ?? ''
  const outputDir = dir || DATA_PATHS.OUTPUT_DIR
  const isCustom = dir !== '' && dir !== DATA_PATHS.OUTPUT_DIR

  console.log('\nData storage locations:')
  console.log(`📁 ${path.resolve(DATA_PATHS.USER_DATA_DIR, DATA_DIRS.JSON)} - Rikishi data by division (cached)`)
  console.log(`📁 ${path.resolve(DATA_PATHS.USER_DATA_DIR, DATA_DIRS.CACHE)} - Raw HTML data (cached)`)
  console.log(`📁 ${path.resolve(DATA_PATHS.USER_DATA_DIR, DATA_DIRS.LOGS)} - Application logs`)

  console.log('\nOutput locations:')
  console.log(`📁 ${path.resolve(outputDir)} - CSV output files (${isCustom ? 'custom' : 'default'})`)
}
