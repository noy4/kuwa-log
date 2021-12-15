export const pick = <T extends object, U extends keyof T>(
  obj: T,
  ...keys: U[]
): Pick<T, U> => {
  const ret = Object.create(null)
  for (const k of keys) {
    ret[k] = obj[k]
  }
  return ret
}
