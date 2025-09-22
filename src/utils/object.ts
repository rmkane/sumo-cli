/**
 * Finds the key in an object that matches a given value.
 *
 * @param obj - The object to search in
 * @param value - The value to search for
 * @returns The key that matches the value, or 'unknown' if not found
 * @example
 * const obj = { a: 1, b: 2, c: 3 };
 * getKeyByValue(obj, 2) // returns 'b'
 * getKeyByValue(obj, 5) // returns 'unknown'
 */
export function getKeyByValue<T extends Record<string, unknown>>(obj: T, value: T[keyof T]): string {
  return Object.keys(obj).find((key) => obj[key as keyof T] === value) || 'unknown'
}

/**
 * A function to map the original key (becomes new value after inversion).
 */
// eslint-disable-next-line no-unused-vars
export type OriginalKeyMapFn = (key: string) => string

/**
 * A function to map the original value (becomes new key after inversion).
 */
// eslint-disable-next-line no-unused-vars
export type OriginalValueMapFn = (value: string | number) => string | number

/**
 * Inverts an object by swapping keys and values.
 *
 * @param dict - The object to invert
 * @param options - Optional configuration for key/value mapping
 * @returns A new object with keys and values swapped
 * @example
 * const obj = { a: 1, b: 2, c: 3 };
 * invertDict(obj) // returns { 1: 'a', 2: 'b', 3: 'c' }
 * invertDict(obj, { originalKeyMap: (k) => k.toUpperCase() }) // returns { 1: 'A', 2: 'B', 3: 'C' }
 */
export const invertDict = <T extends Record<string, string | number>>(
  dict: T,
  options?: {
    originalKeyMap?: OriginalKeyMapFn
    originalValueMap?: OriginalValueMapFn
  },
) => {
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(dict)) {
    const mappedKey = options?.originalKeyMap ? options.originalKeyMap(key) : key
    const mappedValue = options?.originalValueMap ? options.originalValueMap(value) : value
    result[String(mappedValue)] = String(mappedKey)
  }
  return Object.freeze(result)
}
