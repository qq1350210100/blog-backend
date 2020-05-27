import { controller, post } from '../common/decorator'
import { mysql } from '../middlewares/mysql'

@controller('/user')
export default class TestController {
	@post('/login', mysql)
	async login(ctx: any) {
		ctx.body = {
			status: 'OK',
			payload: 'login'
		}
	}

	@post('/register', mysql)
	async test(ctx: any) {
		ctx.body = {
			code: 0,
			message: 'register'
		}
	}
}
