export function getKeyByValue<T extends Record<string, any>>(
  obj: T,
  value: T[keyof T]
): string {
  return (
    Object.keys(obj).find((key) => obj[key as keyof T] === value) || 'unknown'
  );
}
