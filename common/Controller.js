const mysql = require('../database/mysql')

class Controller {
	constructor(opts) {
		this.opts = opts,
		this.mysql = mysql
	}
}

module.exports = Controller