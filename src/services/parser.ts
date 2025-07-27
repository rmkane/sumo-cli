import { load } from 'cheerio';

import type { Rikishi } from '../types';
import { capitalize, unwrapText } from '../utils/string';
import {
  convertDiacriticsToAscii,
  toRomajiWithMacrons,
} from '../utils/japanese';

/**
 * Parses HTML content to extract rikishi data.
 *
 * @param html - Raw HTML content from the sumo website
 * @returns Array of parsed Rikishi objects
 */
export function parseRikishiFromHTML(html: string): Rikishi[] {
  const $ = load(html);
  const records: Rikishi[] = [];

  $('#ew_table_sm tbody .box').each((_, box) => {
    records.push(parseRecord($(box)));
  });

  return records;
}

/**
 * Parses a single rikishi record from the HTML table.
 *
 * @param $box - Cheerio object representing the table row
 * @returns Parsed Rikishi object
 */
function parseRecord($box: any): Rikishi {
  const href = $box.find('a').attr('href') || '';
  const id = +(href.match(/\d+/)?.[0] || '0');

  const kanji = $box.find('a').text().trim();
  const hiragana = unwrapText($box.find('.hoshi_br').text());
  const romaji = capitalize(toRomajiWithMacrons(hiragana));
  const english = convertDiacriticsToAscii(romaji);

  return {
    id,
    kanji,
    hiragana,
    romaji,
    english,
  };
}
