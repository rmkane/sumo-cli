export const Division = {
  MAKUUCHI: 1,
  JURYO: 2,
  MAKUSHITA: 3,
  SANDANME: 4,
  JONIDAN: 5,
  JONOKUCHI: 6,
} as const

export const RankMapping = [
  { kanji: '横綱', english: 'Yokozuna' },
  { kanji: '大関', english: 'Ozeki' },
  { kanji: '関脇', english: 'Sekiwake' },
  { kanji: '小結', english: 'Komusubi' },
  { kanji: '前頭', english: 'Maegashira' },
  { kanji: '十両', english: 'Juryo' },
  { kanji: '幕下', english: 'Makushita' },
  { kanji: '三段目', english: 'Sandanme' },
  { kanji: '序二段', english: 'Jonidan' },
  { kanji: '序ノ口', english: 'Jonokuchi' },
]
