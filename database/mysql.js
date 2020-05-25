const mysql = require('mysql')

const config = {
	host: 'localhost',
	user: 'root',
	password: '123456',
	database: 'blog',
	port: 3306,
	multipleStatements: true //允许多条sql同时执行
}

const pool = mysql.createPool(config)

class Mysql {
	constructor() {}
	query(sql) {
		return new Promise((resolve, reject) => {
			pool.query(sql, function (error, results, fields) {
				if (error) {
					reject(error)
				}
				resolve(results)
			})
		})
	}
}

const mysqlInstance = new Mysql()

module.exports = mysqlInstance
