import { StrArray } from '../utils/type'

export function throwSqlError(err: Error): void {
  throw { message: `SQL执行失败, ${err}`, code: 500 }
}

export function throwNoResult(): void {
  throw { message: '查询结果为空', code: 200 }
}

export function stringToArray(string: StrArray): string[] {
  return string && typeof string === 'string' ? string.split(',') : []
}
