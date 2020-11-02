import { Tags } from '../utils/type'
import { WhereKey } from '../utils/enums'

export function throwSqlError(err: Error) {
  throw `SQL执行失败, ${err}`
}

export function convertTags(tags: Tags) {
  return typeof tags === 'string' ? tags.split(',') : []
}

export function where(key: WhereKey, value: string): string {
  switch (key) {
    case WhereKey.USERNAME:
      return `WHERE username = "${value}"`
    case WhereKey.USER_ID:
      return `WHERE id = ${value}`
    default:
      throw `${key} is not found`
  }
}
