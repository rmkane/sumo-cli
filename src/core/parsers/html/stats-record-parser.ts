import { type Cheerio } from 'cheerio'
import { type Element } from 'domhandler'

import { parseRank, parseRikishiShikona } from '@/core/parsers'
import type { DivisionType, Rikishi, SideType } from '@/types'

/**
 * Parses a single rikishi record from the HTML table.
 *
 * @param $box - Cheerio object representing the div.box element
 * @param rankText - Rank text from the center td
 * @param division - Division type for context
 * @param side - Side of the ranking (East or West)
 * @returns Parsed Rikishi object
 */
export function parseStatsRecord(
  $box: Cheerio<Element>,
  rankText: string,
  division?: DivisionType,
  side?: SideType,
): Rikishi {
  const href = $box.find('a').attr('href') ?? ''
  const id = +(href.match(/\d+/)?.[0] ?? '0')

  const shikona = parseRikishiShikona($box)
  const rank = parseRank(rankText, division, side)

  return {
    id,
    shikona,
    rank,
  }
}
