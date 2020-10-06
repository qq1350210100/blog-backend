export function object(value: any): boolean {
  return typeof value == 'object' && value != null && !Array.isArray(value)
}
