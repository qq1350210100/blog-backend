import mysql from '../database/mysql'

export default class Controller {
	constructor(opts) {
		this.opts = opts,
		this.mysql = mysql
	}
}