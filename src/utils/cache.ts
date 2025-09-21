import fs from 'node:fs/promises'

import { DATA_DIRS, DATA_PATHS } from '@/config/data'

// Cache utilities
function getCacheKey(url: string): string {
  return Buffer.from(url)
    .toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
}

export function getCachePath(url: string): string {
  return `${DATA_PATHS.USER_DATA_DIR}/${DATA_DIRS.CACHE}/${getCacheKey(url)}.html`
}

export async function ensureCacheDirectory(): Promise<void> {
  await fs.mkdir(`${DATA_PATHS.USER_DATA_DIR}/${DATA_DIRS.CACHE}`, { recursive: true })
}

export async function readFromCache(cachePath: string): Promise<string | null> {
  try {
    const cached = await fs.readFile(cachePath, 'utf-8')
    console.log(`Using cached version`)
    return cached
  } catch {
    return null
  }
}

export async function writeToCache(cachePath: string, content: string): Promise<void> {
  await fs.writeFile(cachePath, content, 'utf-8')
  console.log(`Cached to ${cachePath}`)
}
