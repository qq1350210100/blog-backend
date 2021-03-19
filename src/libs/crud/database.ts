import mysql from 'mysql2'

export class Mysql {
  pool: mysql.Pool
  escape: (value: unknown) => string
  constructor(config: mysql.PoolOptions) {
    this.pool = mysql.createPool(config)
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
