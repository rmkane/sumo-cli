import { Division } from './constants';

export type KeyOf<T> = keyof T;
export type ValueOf<T> = T[KeyOf<T>];

export type DivisionType = ValueOf<typeof Division>;

export interface Rikishi {
  id: number;
  kanji: string;
  hiragana: string;
  romaji: string;
  english: string;
}
