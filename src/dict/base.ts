export const invertDict = <T extends Record<string, string>>(dict: T) => {
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(dict)) {
    result[value] = key
  }
  return Object.freeze(result)
}
