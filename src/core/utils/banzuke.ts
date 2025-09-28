import { DIVISION, DIVISION_ORDER, SANYAKU_ORDER, SIDE_ORDER } from '@/constants'
import type { BanzukeSlot, MakuuchiRank, NumberedRank, Rikishi } from '@/types'

const makuuchiRankOrder = (r: MakuuchiRank): number => (typeof r === 'string' ? SANYAKU_ORDER[r] : 4 + (r.number - 1))

const numberedRankOrder = (r: NumberedRank): number => r.number - 1

export const banzukeSortKey = (slot: BanzukeSlot): [number, number, number] => {
  const div = DIVISION_ORDER[slot.division]
  const side = SIDE_ORDER[slot.side]
  const r =
    slot.division === DIVISION.MAKUUCHI
      ? makuuchiRankOrder(slot.rank as MakuuchiRank)
      : numberedRankOrder(slot.rank as NumberedRank)
  return [div, r, side]
}

export const compareBanzuke = (a: BanzukeSlot, b: BanzukeSlot): number => {
  const ka = banzukeSortKey(a)
  const kb = banzukeSortKey(b)
  for (let i = 0; i < 3; i++) {
    const kaVal = ka[i] ?? 0
    const kbVal = kb[i] ?? 0
    if (kaVal !== kbVal) return kaVal - kbVal
  }
  return 0
}

export const compareRikishi = (a: Rikishi, b: Rikishi): number => compareBanzuke(a.current, b.current)
