import mysql from 'mysql2'

const baseConfig = {
  database: 'blog',
  multipleStatements: true, //允许多条sql同时执行
  insecureAuth: true
}

export const localConfig: mysql.PoolOptions = {
  ...baseConfig,
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  port: 3306
}

export const remoteConfig: mysql.PoolOptions = {
  ...baseConfig,
  host: '8.129.105.196',
  user: 'root',
  password: '11568171',
  port: 3306
}
