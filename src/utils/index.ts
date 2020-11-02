export function convertToBoolean<T extends object>(params: T): T {
  Reflect.ownKeys(params).forEach(key => {
    if (params[key] === 0) {
      params[key] = false
    }
    if (params[key] === 1) {
      params[key] = true
    }
  })
  return params
}
