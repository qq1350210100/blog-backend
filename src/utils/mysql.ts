import mysql from 'mysql2'

const config = {
  host: '8.129.105.196',
  user: 'root',
  password: '11568171',
  database: 'blog',
  port: 3306,
  multipleStatements: true, //允许多条sql同时执行
  insecureAuth: true
}

export class Mysql {
  pool: mysql.Pool
  constructor(config: mysql.PoolOptions) {
    this.pool = mysql.createPool(config)
  }

  public query = (sql: string): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.pool.query(sql, (error, results: unknown[]) => {
        error ? reject(error) : resolve(results)
      })
    })
  }
}

export const db = new Mysql(config)
