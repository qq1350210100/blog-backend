import { Mysql } from './database'
import { escape } from 'mysql2'

/**
 * 简单封装一层 SQL 语句。支持链式调用。
 */
export class Query {
  db: Mysql
  sql: string
  constructor(db: Mysql) {
    this.db = db
    this.sql = ''
    this.init()
  }

  public init(): this {
    this.sql = ''
    return this
  }

  /**
   * 调用此方法表示 SQL 语句拼接结束，随即进行 query 操作。
   * @returns
   */
  public end(): Promise<any> {
    return this.db.query(`${this.sql};`)
  }

  /**
   * 由于封装的 mysql 方法覆盖不到所有 SQL 语句，所以此 API 允许拼接自定义语句到当前 SQL 后边，方便使用。
   * @param sql 自定义的 SQL 语句
   * @returns
   */
  public custom(sql: string): this {
    this.sql += sql
    return this
  }

  /**
   * SELECT
   * @param args
   * @returns
   */
  public select(...args: string[]): this {
    this.sql += ` SELECT ${args.join(', ')}`
    return this
  }

  /**
   * FROM
   * @param table
   * @returns
   */
  public from(table: string): this {
    this.sql += ` FROM ${table}`
    return this
  }

  /**
   * WHERE
   * @returns
   */
  public where(): this {
    this.sql += ` WHERE `
    return this
  }

  /**
   * =
   * @param a
   * @param b
   * @returns
   */
  public equal(key: string, value: unknown): this {
    this.sql += `${key} = ${escape(value)}`
    return this
  }

  /**
   * LIKE
   * @param value
   * @param keywords
   * @returns
   */
  public like(value: string, keywords: string): this {
    this.sql += `${value} LIKE ${escape(keywords)}`
    return this
  }

  /**
   * OR
   * @returns
   */
  public or(): this {
    this.sql += ` OR `
    return this
  }

  /**
   * LIMIT
   * @param condition
   * @returns
   */
  public limit(condition?: number): this {
    if (!condition) return this

    this.sql += ` LIMIT ${condition}`
    return this
  }

  /**
   * UPDATE
   * @param table
   * @returns
   */
  public update(table: string): this {
    this.sql += ` UPDATE ${table}`
    return this
  }

  /**
   * SET
   * @param values
   * @returns
   */
  public set(values: Record<string, unknown>): this {
    const valuesArr = Object.keys(values)
    const setStatement = valuesArr
      .map((key, index) => {
        const newValue = escape(values[key])
        const isLast = index === valuesArr.length - 1
        return `${key} = ${newValue}${isLast ? '' : `, `}`
      })
      .join('')

    this.sql += ` SET ${setStatement}`
    return this
  }

  /**
   * INSERT INTO
   * @param table
   * @returns
   */
  public insertInto(table: string): this {
    this.sql += ` INSERT INTO ${table}`
    return this
  }

  /**
   * ORDER BY
   * @param key
   * @returns
   */
  public orderBy(key: string): this {
    this.sql += ` ORDER BY ${key}`
    return this
  }

  /**
   * DESC
   * @returns
   */
  public desc(): this {
    this.sql += ` DESC`
    return this
  }

  /**
   * ASC
   * @returns
   */
  public asc(): this {
    this.sql += ` ASC`
    return this
  }

  /**
   * DELETE
   * @returns
   */
  public delete(): this {
    this.sql += ` DELETE`
    return this
  }
}
