import { controller, post } from '../common/decorator'
import { mysql } from '../middlewares/mysql'

@controller('/user')
export default class UserController {
	/**
	 * 用户登录
	 * @param ctx
	 */
	@post('/login', mysql())
	async userLogin(ctx: any) {
		const { username, password } = ctx.request.body
		let status: string = 'FAIL'
		let response: string = '登入失败'

		try {
			const passwords = await ctx.mysql.query(`
				SELECT password FROM user WHERE username = '${username}';
			`)

			if (passwords && passwords.length > 0) {
				const { password: existPassword } = passwords[0]
				if (password === existPassword) {
					try {
						await ctx.mysql.query(`
							UPDATE user SET is_online = 1 WHERE username = '${username}';
						`)
						status = 'OK'
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
	 * @param ctx
	 */
	@post('/register', mysql())
	async userRegister(ctx: any) {
		const { username, password, nickname = '匿名' } = ctx.request.body
		let status: string = 'FAIL'
		let response: string = '注册失败！'

		if (username && password) {
			try {
				const existUsername = await ctx.mysql.query(`
					SELECT username FROM user WHERE username = '${username}';
				`)

				if (existUsername.length > 0) {
					response = '该账号已存在！'
				} else {
					try {
						await ctx.mysql.query(`
							INSERT INTO user SET 
								username = '${username}', 
								password = '${password}', 
								nickname = '${nickname}';
						`)
						status = 'OK'
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
	 * @param ctx
	 */
	@post('/logout', mysql())
	async userLogout(ctx: any) {
		let status: string = 'FAIL'
		let response: string = 'Logout failed'
		const { username } = ctx.request.body
		if (username) {
			try {
				const result = await ctx.mysql.query(`SELECT username FROM user`)
				if (result.length > 0) {
					try {
						await ctx.mysql.query(`
							UPDATE user SET is_online = 0 WHERE username = '${username}';
						`)
						status = 'OK'
						response = '登出成功！'
					} catch (e) {
						console.error('执行SQL语句失败', e)
					}
				} else {
					response = '账号不存在！'
				}
			} catch (e) {
				console.error('执行SQL语句失败', e)
			}
		}
		ctx.body = {
			status,
			payload: response
		}
	}
}
