export const invertDict = <T extends Record<string, string>>(dict: T) =>
  Object.entries(dict).reduce((result, [k, v]) => ({ ...result, [v]: k }), {} as Record<string, string>)
