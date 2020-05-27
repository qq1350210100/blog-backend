import { controller, post } from '../common/decorator'
import { mysql } from '../middlewares/mysql'

@controller('/user')
export default class TestController {
	@post('/login', mysql())
	async login(ctx: any) {
		const { username, password } = ctx.request.body
		let status: string = 'FAIL'
		let response: string = 'Login failed'

		try {
			let getPasswordSql: string = `select password from user where username = '${username}';`
			const passwords = await ctx.mysql.query(getPasswordSql)

			if (passwords && passwords.length > 0) {
				const { password: existPassword } = passwords[0]
				if (password === existPassword) {
					try {
						let onlineSql: string = `update user set is_online = true where username = '${username}';`
						await ctx.mysql.query(onlineSql)
						status = 'OK'
						response = 'Login successeed'
					} catch (e) {
						console.error('SQL语句执行失败', e)
					}
				} else {
					response = '账号或密码错误'
				}
			} else {
				response = '账号不存在'
			}
		} catch (e) {
			console.error('SQL语句执行失败', e)
		}

		ctx.body = {
			status,
			payload: response
		}
	}

	@post('/register', mysql())
	async test(ctx: any) {
		const { username, password, nickname = '匿名' } = ctx.request.body
		let status: string = 'FAIL'
		let response: string = 'Register failed'

		if (username && password) {
			try {
				let fetchCurrentUsernameSql: string = `select username as existUsername from user where username = '${username}';`
				const existUsername = await ctx.mysql.query(fetchCurrentUsernameSql)

				if (existUsername.length > 0) {
					response = '该用户已存在！'
				} else {
					try {
						let addUserSql: string = `
							insert into user set 
								username = '${username}', 
								password = '${password}', 
								nickname = '${nickname}';
						`
						await ctx.mysql.query(addUserSql)
						status = 'OK'
						response = 'Register successeed'
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
}
