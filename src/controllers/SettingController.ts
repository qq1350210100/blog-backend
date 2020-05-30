import { controller, get, post } from '../common/decorator'
import mysql from '../middlewares/mysql'
import { responseStatus } from '../common/constant'
import { mapToBoolean } from '../utils/textMap'

interface AnyInObject {
	[key: string]: any
}

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
		const { userId } = ctx.query
		try {
			let sql: string = /*sql*/ `
				SELECT 
					user.username AS username,
					user.id AS settingId,
					setting.user_id AS userId,
					setting.drawer_opened AS drawerOpened,
					setting.dark_mode AS darkMode,
					setting.theme AS theme,
					setting.sync_to_cloud AS syncToCloud,
					setting.auto_login AS autoLogin,
					setting.lang AS lang
				FROM setting INNER JOIN user ON setting.user_id = user.id 
				WHERE user.id = ${userId};
			`
			const result = await ctx.mysql.query(sql)
			if (result.length === 1) {
				response = result[0]
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
	@post('/update_options', mysql())
	async updateSetting(ctx: any) {
		let status: string = responseStatus.FAIL
		let response: string = '保存失败'
		const { userId, options = {} } = ctx.request.body
		const finallyOptions: AnyInObject = {}
		for (const key in options) {
			if (options.hasOwnProperty(key)) {
				const value = options[key]
				finallyOptions[key] = mapToBoolean(value)
			}
		}
		const { drawerOpened, darkMode, theme, syncToCloud, autoLogin, lang } = finallyOptions
		try {
			let sql: string = /*sql*/ `
				SELECT id as settingId FROM setting WHERE user_id = ${userId};
			`
			const result: any[] = await ctx.mysql.query(sql)
			const exists = result.length > 0
			try {
				const setOptionsSql: string = /*sql*/ `
					drawer_opened = ${drawerOpened},
					dark_mode = ${darkMode},
					sync_to_cloud = ${syncToCloud},
					auto_login = ${autoLogin},
					theme = '${theme}',
					lang = '${lang}'
				`
				let insertOrUpdateSql: string = exists
					? /*sql*/ `UPDATE setting SET ${setOptionsSql} WHERE user_id = ${userId};`
					: /*sql*/ `INSERT INTO setting SET ${setOptionsSql}, user_id = ${userId};`
				await ctx.mysql.query(insertOrUpdateSql)
				status = responseStatus.OK
				response = exists ? '修改成功' : '添加成功'
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
