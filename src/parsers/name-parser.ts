import { type Cheerio } from 'cheerio'
import { type Element } from 'domhandler'

import type { RikishiName } from '@/types'
import { convertDiacriticsToAscii, toRomajiWithMacrons } from '@/utils/japanese'
import { capitalize, unwrapText } from '@/utils/string'

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
