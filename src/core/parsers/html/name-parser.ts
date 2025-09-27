import { type Cheerio } from 'cheerio'
import { type Element } from 'domhandler'

import { convertDiacriticsToAscii, toRomajiWithMacrons } from '@/core/utils/japanese'
import { capitalize, unwrapText } from '@/core/utils/string'
import type { RikishiName } from '@/types'

/**
 * Parses rikishi name information from HTML elements.
 *
 * @param $box - Cheerio element containing name information
 * @returns Structured name information
 */
export function parseRikishiName($box: Cheerio<Element>): RikishiName {
  const kanji = $box.find('a span').text().trim() || $box.find('a').text().trim()
  const hiragana = unwrapText($box.find('.hoshi_br').text())
  const romaji = capitalize(toRomajiWithMacrons(hiragana))
  const english = convertDiacriticsToAscii(romaji)
  return { kanji, hiragana, romaji, english }
}
