import { StrArray } from '../utils/type'
import { WhereKey } from '../utils/enums'

export function throwSqlError(err: Error) {
  throw `SQL执行失败, ${err}`
}

export function throwNoResult() {
  throw `查询结果为空`
}

export function stringToArray(string: StrArray): string[] {
  return string && typeof string === 'string' ? string.split(',') : []
}

export function where(key: WhereKey, value: string | number): string {
  switch (key) {
    case WhereKey.USERNAME:
      return `WHERE username = "${value}"`
    case WhereKey.USER_ID:
      return `WHERE id = ${value}`
    default:
      throw `${key} is not found`
  }
}
