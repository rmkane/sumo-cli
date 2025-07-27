import { load } from 'cheerio';

import type { DivisionType, Rikishi } from './types';
import { Division } from './constants';
import { sleep } from './utils/async';
import { saveJSON } from './utils/file';
import { fetchHTML } from './utils/html';
import {
  convertDiacriticsToAscii,
  toRomajiWithMacrons,
} from './utils/japanese';
import { getKeyByValue } from './utils/object';
import { capitalize, unwrapText } from './utils/string';
import {
  ensureCacheDirectory,
  getCachePath,
  readFromCache,
  writeToCache,
} from './utils/cache';

main();

async function main(): Promise<void> {
  try {
    // Check if force refresh is requested (you can pass --refresh as a command line arg)
    const forceRefresh = process.argv.includes('--refresh');

    // Loop through all divisions
    for (const [divisionName, divisionId] of Object.entries(Division)) {
      await processDivision(divisionName, divisionId, forceRefresh);
    }

    console.log('\n=== All divisions processed ===');
  } catch (error) {
    console.error('Error in main:', error);
  }
}

async function processDivision(
  divisionName: string,
  divisionId: DivisionType,
  forceRefresh: boolean
): Promise<void> {
  console.log(`\n=== Processing ${divisionName} (${divisionId}) ===`);

  const wasFetched = await fetchResults(divisionId, forceRefresh);
  await saveResults(wasFetched.results, divisionId);

  console.log(
    `Fetched ${wasFetched.results.length} rikishi for ${divisionName}`
  );

  // Sleep only if we actually fetched from server (except for the last division)
  if (
    wasFetched.fromServer &&
    divisionId !== Object.values(Division).slice(-1)[0]
  ) {
    console.log('Sleeping for 2 seconds...');
    await sleep(2000);
  }
}

async function fetchResults(
  division: DivisionType,
  forceRefresh: boolean = false
): Promise<{ results: Rikishi[]; fromServer: boolean }> {
  const url = `https://sumo.or.jp/ResultData/hoshitori/${division}/1/`;
  const cachePath = getCachePath(url);

  let html: string;
  let fromServer = false;

  try {
    await ensureCacheDirectory();

    // Try cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = await readFromCache(cachePath);
      if (cached) {
        html = cached;
        fromServer = false;
      } else {
        html = await fetchHTML(url);
        await writeToCache(cachePath, html);
        fromServer = true;
      }
    } else {
      html = await fetchHTML(url);
      await writeToCache(cachePath, html);
      fromServer = true;
    }
  } catch (error) {
    console.error(`Error fetching results for division ${division}:`, error);
    throw error;
  }

  const $ = load(html);
  const records: Rikishi[] = [];

  $('#ew_table_sm tbody .box').each((_, box) => {
    records.push(parseRecord($(box)));
  });

  return { results: records, fromServer };
}

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

async function saveResults(
  results: Rikishi[],
  division: DivisionType
): Promise<void> {
  const divisionName = getKeyByValue(Division, division);
  const filename = `./data/${divisionName.toLowerCase()}_rikishi.json`;

  const data = {
    division: divisionName,
    divisionId: division,
    timestamp: new Date().toISOString(),
    count: results.length,
    rikishi: results,
  };

  await saveJSON(filename, data);
}
