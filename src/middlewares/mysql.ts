import mysqlDB from '../database/mysql'

export const mysql = () => async (ctx: any, next: any) => {
	ctx.mysql = mysqlDB
	await next()
}