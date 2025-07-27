import { load } from 'cheerio'

import type { Rank, Rikishi } from '../types'
import { RankMapping } from '../constants'
import { capitalize, unwrapText } from '../utils/string'
import {
  convertDiacriticsToAscii,
  kanjiToNumber,
  toRomajiWithMacrons,
} from '../utils/japanese'

/**
 * Parses HTML content to extract rikishi data.
 *
 * @param html - Raw HTML content from the sumo website
 * @returns Array of parsed Rikishi objects
 */
export function parseRikishiFromHTML(html: string): Rikishi[] {
  const $ = load(html)
  const records: Rikishi[] = []

  $('#ew_table_sm tbody .box').each((_, box) => {
    records.push(parseRecord($(box)))
  })

  return records
}

/**
 * Parses a single rikishi record from the HTML table.
 *
 * @param $box - Cheerio object representing the table row
 * @returns Parsed Rikishi object
 */
function parseRecord($box: any): Rikishi {
  const href = $box.find('a').attr('href') || ''
  const id = +(href.match(/\d+/)?.[0] || '0')

  const rank = parseRank($box.find('.rank').text().trim())

  const kanji = $box.find('a').text().trim()
  const hiragana = unwrapText($box.find('.hoshi_br').text())
  const romaji = capitalize(toRomajiWithMacrons(hiragana))
  const english = convertDiacriticsToAscii(romaji)

  return {
    id,
    kanji,
    hiragana,
    romaji,
    english,
    rank,
  }
}

/**
 * Parses a rank string from HTML and converts it to a Rank object.
 *
 * @param rankText - Raw rank text from HTML (e.g., "横綱", "大関", "前頭六枚目", etc.)
 * @returns Rank object with division and position
 */
function parseRank(rankText: string): Rank | undefined {
  // Clean the rank text
  const cleanRank = rankText.trim()

  // Find the matching rank in our mapping
  for (const rankEntry of RankMapping) {
    if (cleanRank.startsWith(rankEntry.kanji)) {
      const division = rankEntry.english
      let position = 0

      // Extract position from remaining text (e.g., "六枚目" -> 6)
      const remainingText = cleanRank.replace(rankEntry.kanji, '').trim()

      if (remainingText) {
        // Remove "枚目" suffix if present
        const positionText = remainingText.replace('枚目', '')
        if (positionText) {
          position = kanjiToNumber(positionText)
        }
      }

      return {
        division,
        position,
      }
    }
  }

  // Fallback for unknown ranks
  return undefined
}
