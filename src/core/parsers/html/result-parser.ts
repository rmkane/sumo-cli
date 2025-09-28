import { type Cheerio } from 'cheerio'
import { type Element } from 'domhandler'

import { CssClasses, JapaneseTerms, MatchResult } from '@/constants'
import { lookupKimarite } from '@/core/dict'
import type { MatchResultType } from '@/types'

/**
 * Parses and translates the winning technique from a player cell
 * @param $player - Cheerio element representing the player cell
 * @returns English kimarite name or undefined if no technique found
 */
export function parseWinningTechnique($player: Cheerio<Element>): string | undefined {
  // Look for the technique in a sibling .decide cell
  const $decideCell = $player.siblings('.decide')
  if ($decideCell.length === 0) {
    return undefined
  }

  const techniqueLink = $decideCell.find('a.technic')
  if (techniqueLink.length === 0) {
    return undefined
  }

  const japaneseTechnique = techniqueLink.text().trim()
  if (!japaneseTechnique) {
    return undefined
  }

  // Remove "取組解説" suffix if present
  const cleanTechnique = japaneseTechnique.replace(JapaneseTerms.KIMARITE_SUFFIX, '').trim()

  // Look up the English translation
  return lookupKimarite(cleanTechnique)
}

/**
 * Parses the win/loss result for a player based on CSS classes.
 *
 * @param $player - Cheerio object representing the player cell
 * @returns 'W' for win, 'L' for loss, '' for no result yet
 */
export function parseResult($player: Cheerio<Element>): MatchResultType {
  // Check if the player cell has the 'win' class (completed match - winner)
  if ($player.hasClass(CssClasses.WIN)) {
    return MatchResult.WIN
  }

  // Check if the player cell has the 'player' class but no 'win' class
  // This indicates they lost (since the winner would have 'win' class)
  if ($player.hasClass(CssClasses.PLAYER) && !$player.hasClass(CssClasses.WIN)) {
    // Look for result indicators in the same row to confirm this is a completed match
    const $row = $player.closest('tr')
    const $resultCells = $row.find(`td.${CssClasses.RESULT}`)

    // Check if there are result images indicating completed match
    const hasResultImages = $resultCells.find('img[src*="result_ic"]').length > 0

    if (hasResultImages) {
      return MatchResult.LOSS
    }
  }

  // No result yet (incomplete day)
  return MatchResult.NO_RESULT
}
