import { controller, requestMapping, requestMethod } from '../common/decorator'
import { mysql } from '../middlewares/mysql'

// 添加Controller前缀
@controller('/api/test')
export default class TestController {
	// 基本面使用 /api/test/login
	@requestMapping({
		url: '/login',
		method: requestMethod.GET, // 定义请求方法
		middleware: [mysql]
	})
	async login(ctx: any) {
		const { mysql } = ctx
		const result = await mysql.query('select * from article')
		ctx.body = {
			code: 0,
			message: result
		}
	}

	// 定义有中间件的router  /api/test/test
	@requestMapping({
		url: '/test',
		method: requestMethod.POST // 定义请求方法
	})
	async test(ctx: any) {
		ctx.body = {
			code: 0,
			message: 'success'
		}
	}
}
