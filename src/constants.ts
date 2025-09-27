export const Division = {
  MAKUUCHI: 1,
  JURYO: 2,
  MAKUSHITA: 3,
  SANDANME: 4,
  JONIDAN: 5,
  JONOKUCHI: 6,
} as const

export const Side = {
  EAST: 'East',
  WEST: 'West',
} as const

export const MatchResult = {
  WIN: 'W',
  LOSS: 'L',
  NO_RESULT: '',
} as const

export const DivisionNames = {
  YOKOZUNA: 'Yokozuna',
  OZEKI: 'Ozeki',
  SEKIWAKE: 'Sekiwake',
  KOMUSUBI: 'Komusubi',
  MAEGASHIRA: 'Maegashira',
  JURYO: 'Juryo',
  MAKUSHITA: 'Makushita',
  SANDANME: 'Sandanme',
  JONIDAN: 'Jonidan',
  JONOKUCHI: 'Jonokuchi',
  UNKNOWN: 'Unknown',
} as const

export const CssClasses = {
  WIN: 'win',
  PLAYER: 'player',
  RESULT: 'result',
  DECIDE: 'decide',
} as const
