#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIVISIONS = ['makuuchi', 'juryo', 'makushita', 'sandanme', 'jonidan', 'jonokuchi'];

const RANK_TO_DIVISION = {
    'Yokozuna': 'makuuchi',
    'Ozeki': 'makuuchi',
    'Sekiwake': 'makuuchi',
    'Komusubi': 'makuuchi',
    'Maegashira': 'makuuchi',
    'Juryo': 'juryo',
    'Makushita': 'makushita',
    'Sandanme': 'sandanme',
    'Jonidan': 'jonidan',
    'Jonokuchi': 'jonokuchi',
}

const JAPANESE_TRANSFORMATIONS = [
    { from: 'ei', to: 'e' },
    { from: 'ou', to: 'o' },
    { from: 'uu', to: 'u' },
    { from: 'aa', to: 'a' },
    { from: 'ii', to: 'i' },
    { from: 'oo', to: 'o' }
];

function loadRikishiData(divisions, dataDir) {
    const rikishiByDivision = {};
    for (let i = 0; i < divisions.length; i++) {
        const division = divisions[i];
        const index = i + 1;
        const filename = `${dataDir}/${index}_${division}_rikishi.json`;
        const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
        rikishiByDivision[division] = data.rikishi;
    }
    return rikishiByDivision;
}

const rikishiByDivision = loadRikishiData(DIVISIONS, path.join(__dirname, '../data/json'));

main();

function main() {
    processTable(`
        Juryo #12	Takarafuji	（3-4）	Juryo #14	Nishinoryu	（4-3）
        Juryo #10	Hakuyozan	（2-5）	Juryo #13	Kyokukaiyu	（3-4）
        Juryo #9	Shirokuma	（3-4）	Juryo #13	Asanoyama	（6-1）
        Juryo #14	Shiden	（4-3）	Juryo #9	Tsurugisho	（1-6）
        Juryo #8	Hatsuyama	（4-3）	Juryo #12	Asasuiryu	（4-3）
        Juryo #11	Asahakuryu	（6-1）	Juryo #8	Kotokuzan	（6-1）
        Juryo #7	Tamashoho	（3-4）	Juryo #11	Kazekeno	（4-3）
        Juryo #10	Miyanokaze	（1-6）	Juryo #7	Hidenoumi	（2-5）
        Juryo #6	Kayo	（2-5）	Juryo #3	Nishikifuji	（5-2）
        Juryo #2	Kotoeiho	（1-6）	Juryo #4	Kagayaki	（3-4）
        Juryo #6	Tohakuryu	（2-5）	Juryo #2	Chiyoshoma	（3-4）
        Juryo #1	Daiseizan	（3-4）	Juryo #5	Fujiseiun	（5-2）
        Juryo #4	Mita	（7-0）	Juryo #1	Oshoumi	（5-2）
        `, 'juryo.csv', rikishiByDivision);

    processTable(`
        Maegashira #16	Tomokaze	（5-2）	Maegashira #17	Ryuden	（5-2）
        Maegashira #14	Sadanoumi	（3-4）	Maegashira #16	Nishikigi	（0-7）
        Juryo #5	Tochitaikai	（3-4）	Maegashira #14	Asakoryu	（2-5）
        Maegashira #13	Meisei	（2-5）	Maegashira #18	Shishi	（5-2）
        Maegashira #17	Hitoshi	（3-4）	Maegashira #13	Tokihayate	（3-4）
        Maegashira #15	Shonannoumi	（4-3）	Maegashira #12	Mitakeumi	（3-4）
        Maegashira #15	Tobizaru	（5-2）	Maegashira #11	Roga	（4-3）
        Maegashira #8	Ura	（6-1）	Maegashira #11	Shodai	（6-1）
        Maegashira #7	Takanosho	（6-1）	Maegashira #10	Churanoumi	（5-2）
        Maegashira #10	Daieisho	（2-5）	Maegashira #7	Oshoma	（3-4）
        Maegashira #6	Onokatsu	（4-3）	Maegashira #9	Midorifuji	（2-5）
        Maegashira #9	Fujinokawa	（3-4）	Maegashira #6	Kusano	（3-4）
        Maegashira #8	Kinbozan	（2-5）	Maegashira #5	Ichiyamamoto	（2-5）
        Maegashira #2	Hakuoho	（4-3）	Maegashira #5	Kotoshoho	（2-5）
        Maegashira #2	Oho	（3-4）	Maegashira #1	Abi	（0-7）
        Maegashira #1	Tamawashi	（3-4）	Komusubi	Aonishiki	（5-2）
        Sekiwake	Wakatakakage	（4-3）	Maegashira #3	Atamifuji	（2-5）
        Maegashira #4	Wakamotoharu	（5-2）	Sekiwake	Kirishima	（4-3）
        Ozeki	Kotozakura	（5-2）	Komusubi	Takayasu	（1-6）
        Yokozuna	Onosato	（6-1）	Maegashira #4	Hiradoumi	（4-3）
        Maegashira #3	Gonoyama	（0-7）	Yokozuna	Hoshoryu	（7-0）
    `, 'makuuchi.csv', rikishiByDivision);

}

function processTable(rawData, filename, rikishiData) {
    const rows = rawData.trim().split('\n').map(row => row.trim().split('\t'));
    const bouts = processRows(rows, rikishiData);
    const csv = boutsToCsv(bouts);

    // Write to file
    const csvPath = path.join(__dirname, '../data/csv');
    fs.mkdirSync(csvPath, { recursive: true });
    fs.writeFileSync(path.join(csvPath, filename), csv);
}

function boutsToCsv(bouts) {
    const csv = [
        ['', '', 'East', '', '', '', '', '', '', 'West', '', ''],
        ['Rank', 'Record', 'Kanji', 'Hiragana', 'Name', '', '', 'Name', 'Hiragana', 'Kanji', 'Record', 'Rank'],
        ...bouts
            .filter(([rikishi1, rikishi2]) => rikishi1.success && rikishi2.success)
            .map(([rikishi1, rikishi2]) => [
                rikishi1.data.rank,
                rikishi1.data.record,
                rikishi1.data.kanji,
                rikishi1.data.hiragana,
                rikishi1.data.name,
                '',
                '',
                rikishi2.data.name,
                rikishi2.data.hiragana,
                rikishi2.data.kanji,
                rikishi2.data.record,
                rikishi2.data.rank,
            ])
    ]
    return csv.map(row => row.join('\t')).join('\n');
}

function processRows(rows, rikishiData) {
   return rows.map(row => processRow(row, rikishiData));
}

function processRow(row, rikishiData) {
    const [rank1, name1, record1, rank2, name2, record2] = row;
    const rikishi1 = processRikishi(name1, rank1, record1, rikishiData);
    const rikishi2 = processRikishi(name2, rank2, record2, rikishiData);
    return [rikishi1, rikishi2];
}

function processRikishi(name, rank, record, rikishiData) {
    const division = getDivisionByRank(rank);
    if (!division) {
        return { success: false, error: `Division not found: ${rank} ${name}` };
    }
    const rikishi = findRikishiByNameAndDivision(name, division, rikishiData);
    if (!rikishi) {
        return { success: false, error: `Rikishi not found: ${name}` };
    }
    const recordSimple = record.replace(/（/g, '(').replace(/）/g, ')');
    return { success: true, data: { ...rikishi, name, rank, record: recordSimple } };
}

function getDivisionByRank(rank) {
    const match = rank.match(/([A-Za-z]+)(?:\s#(\d+))?/);
    if (!match) {
        console.warn(`Invalid rank format: ${rank}`);
        return null;
    }
    const [, division, _number] = match;
    return RANK_TO_DIVISION[division];
}

function findRikishiByNameAndDivision(name, division, rikishiData) {
    const normalizedInput = normalizeName(name);

    // First try exact match with normalization
    let rikishi = rikishiData[division].find(r => normalizeName(r.english) === normalizedInput);
    if (rikishi) return rikishi;

    // Try fuzzy matching for common variations (input -> JSON variations)
    const variations = getCommonVariations(name);
    for (const variation of variations) {
        rikishi = rikishiData[division].find(r => normalizeName(r.english) === variation);
        if (rikishi) return rikishi;
    }

    // Try reverse transformations (JSON -> input variations)
    for (const rikishiDataItem of rikishiData[division]) {
        const jsonVariations = getCommonVariations(rikishiDataItem.english);
        for (const jsonVariation of jsonVariations) {
            if (jsonVariation === normalizedInput) {
                return rikishiDataItem;
            }
        }
    }

    return null;
}

function getCommonVariations(name, transformations = JAPANESE_TRANSFORMATIONS) {
    const variations = [];
    const normalized = normalizeName(name);

    // Generate variations by applying transformations
    for (const transform of transformations) {
        if (normalized.includes(transform.from)) {
            const variation = normalized.replace(new RegExp(transform.from, 'g'), transform.to);
            if (variation !== normalized) {
                variations.push(variation);
            }
        }
    }

    return variations;
}

function normalizeName(name) {
    return name.toLowerCase().trim().replace(/[^a-z]/g, '');
}
