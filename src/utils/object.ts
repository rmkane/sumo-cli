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
export function getKeyByValue<T extends Record<string, any>>(
  obj: T,
  value: T[keyof T]
): string {
  return (
    Object.keys(obj).find((key) => obj[key as keyof T] === value) || 'unknown'
  );
}
