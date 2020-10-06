import mysql from 'mysql'

const config = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'blog',
  port: 3306,
  multipleStatements: true //允许多条sql同时执行
}

export class Mysql {
  pool: mysql.Pool
  public constructor(config: string | mysql.PoolConfig) {
    this.pool = mysql.createPool(config)
  }

  public query = (sql: string) => {
    return new Promise((resolve, reject) => {
      this.pool.query(sql, (error, results: any) => {
        if (error) reject(error)
        resolve(results)
      })
    })
  }
}

export const db = new Mysql(config)
