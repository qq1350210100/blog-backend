import { controller, get, post } from '../common/decorator'
import mysql from '../middlewares/mysql'
import { responseStatus } from '../common/constant'

@controller('/user')
export default class UserController {
	/**
	 * 用户登录
	 * @param ctx Context
	 */
	@post('/login', mysql())
	async userLogin(ctx: any) {
		const { username, password } = ctx.request.body
		let status: string = responseStatus.FAIL
		let response: string = '登入失败'

		try {
			let sql: string = /*sql*/ `	
				SELECT password FROM user WHERE username = '${username}';
			`
			const passwords: any[] = await ctx.mysql.query(sql)

			if (passwords && passwords.length > 0) {
				const { password: existPassword } = passwords[0]
				if (password === existPassword) {
					try {
						let sql: string = /*sql*/ `
							UPDATE user SET is_online = 1 WHERE username = '${username}';
						`
						await ctx.mysql.query(sql)
						status = responseStatus.OK
						response = '登入成功'
					} catch (e) {
						console.error('SQL语句执行失败', e)
					}
				} else {
					response = '账号或密码错误!'
				}
			} else {
				response = '账号不存在!'
			}
		} catch (e) {
			console.error('SQL语句执行失败', e)
		}

		ctx.body = {
			status,
			payload: response
		}
	}

	/**
	 * 用户注册
	 * @param ctx Context
	 */
	@post('/register', mysql())
	async userRegister(ctx: any) {
		const { username, password, nickname = '匿名' } = ctx.request.body
		let status: string = responseStatus.FAIL
		let response: string = '注册失败！'

		if (username && password) {
			try {
				let sql: string = /*sql*/ `
					SELECT username FROM user WHERE username = '${username}';
				`
				const existUsername: object[] = await ctx.mysql.query(sql)

				if (existUsername.length > 0) {
					response = '该账号已存在！'
				} else {
					try {
						let sql: string = /*sql*/ `
							INSERT INTO user SET 
								username = '${username}', 
								password = '${password}', 
								nickname = '${nickname}';
						`
						await ctx.mysql.query(sql)
						status = responseStatus.OK
						response = '注册成功！'
					} catch (e) {
						console.error('SQL语句执行失败', e)
					}
				}
			} catch (e) {
				console.error('SQL语句执行失败', e)
			}
		}

		ctx.body = {
			status,
			payload: response
		}
	}

	/**
	 * 用户登出
	 * @param ctx Context
	 */
	@post('/logout', mysql())
	async userLogout(ctx: any) {
		let status: string = responseStatus.FAIL
		let response: string = '登出失败！'
		const { username } = ctx.request.body
		if (username) {
			try {
				let sql: string = /*sql*/ `SELECT username FROM user`
				const result = await ctx.mysql.query(sql)
				if (result.length > 0) {
					try {
						let sql: string = /*sql*/ `
							UPDATE user SET is_online = 0 WHERE username = '${username}';
						`
						await ctx.mysql.query(sql)
						status = responseStatus.OK
						response = '登出成功！'
					} catch (e) {
						console.error('SQL语句执行失败', e)
					}
				} else {
					response = '账号不存在！'
				}
			} catch (e) {
				console.error('SQL语句执行失败', e)
			}
		}
		ctx.body = {
			status,
			payload: response
		}
	}

	/**
	 * 获取用户基本信息
	 * @param ctx Context
	 */
	@get('/baseInfo', mysql())
	async getUserBaseInfo(ctx: any) {
		let status: string = responseStatus.FAIL
		let response: object = {}
		const { username } = ctx.query
		try {
			let sql: string = /*sql*/ `
				SELECT 
					id AS userId,
					username,
					nickname,
					level,
					is_online AS isOnline
				FROM user
				WHERE username = '${username}';
			`
			const result: object[] = await ctx.mysql.query(sql)
			if (result.length > 0) {
				status = responseStatus.OK
				response = result[0]
			}
		} catch (e) {
			console.error('SQL语句执行失败', e)
		}
		ctx.body = {
			status,
			payload: response
		}
	}
}
