import mysql from 'mysql2'
import { localConfig } from '../config'

export class Mysql {
  pool: mysql.Pool
  escape: (value: unknown) => string
  constructor() {
    this.pool = mysql.createPool(localConfig)
    this.escape = mysql.escape
  }

  public query = (sql: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.pool.query(sql, (error, results) => {
        error ? reject(error) : resolve(results)
      })
    })
  }
}

export const db = new Mysql()
