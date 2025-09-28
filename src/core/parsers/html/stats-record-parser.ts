import { type Cheerio } from 'cheerio'
import { type Element } from 'domhandler'

import { DIVISION, SIDE } from '@/constants'
import { parseRank, parseRikishiShikona } from '@/core/parsers'
import type { Division, Rikishi, Side } from '@/types'

/**
 * Parses a single rikishi record from the HTML table.
 *
 * @param $box - Cheerio object representing the div.box element
 * @param rankText - Rank text from the center td
 * @param division - Division type for context
 * @param side - Side of the ranking (East or West)
 * @returns Parsed Rikishi object
 */
export function parseStatsRecord($box: Cheerio<Element>, rankText: string, division?: Division, side?: Side): Rikishi {
  const href = $box.find('a').attr('href') ?? ''
  const id = +(href.match(/\d+/)?.[0] ?? '0')

  const shikona = parseRikishiShikona($box)
  const current = parseRank(rankText, division, side)

  return {
    id,
    shikona,
    current: current ?? { division: DIVISION.MAKUUCHI, side: SIDE.EAST, rank: { kind: 'Maegashira', number: 1 } },
  }
}
