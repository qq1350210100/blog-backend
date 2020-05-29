import { controller, get, post } from '../common/decorator'
import mysql from '../middlewares/mysql'
import { responseStatus } from '../common/constant'

@controller('/setting')
export default class SettingController {
	/**
	 * 获取用户设置
	 * @param ctx Context
	 */
	@get('/options', mysql())
	async getSetting(ctx: any) {
		let status: string = responseStatus.FAIL
		let response: object = {}
		const { username } = ctx.query
		try {
			let sql: string = /*sql*/ `
				SELECT * FROM setting WHERE username = '${username}';
			`
			const result = await ctx.mysql.query(sql)
			if (result.length > 0) {
				response = [...result[0], username]
				status = responseStatus.OK
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
	 * 修改用户设置
	 * @param ctx Context
	 */
	@post('/change')
	async updateSetting(ctx: any) {
		let status: string = responseStatus.FAIL
		let response: string = '保存失败'
		const { username, options = [] } = ctx.request.body
		const { drawerOpened, darkMode, theme, syncToCloud, autoLogin, lang } = options
		try {
			let sql: string = /*sql*/ `
				SELECT id as settingId FROM setting WHERE username = '${username}'
			`
			const exists = await ctx.mysql.query(sql)
			let variableSql: string =
				exists.length > 0
					? /*sql*/ `
						UPDATE setting SET
							drawer_opened = '${drawerOpened}',
							dark_mode = '${darkMode}',
							theme = '${theme}',
							sync_to_cloud = '${syncToCloud}',
							auto_login = '${autoLogin}',
							lang = '${lang}'
						WHERE username = '${username}';
					`
					: /*sql*/ `
						INSERT INTO setting SET 
							drawer_opened = '${drawerOpened}',
							dark_mode = '${darkMode}',
							theme = '${theme}',
							sync_to_cloud = '${syncToCloud}',
							auto_login = '${autoLogin}',
							lang = '${lang}';
					`
			try {
				await ctx.mysql.query(variableSql)
				status = responseStatus.OK
				response = '修改成功'
			} catch (e) {
				console.error('SQL语句执行失败', e)
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
