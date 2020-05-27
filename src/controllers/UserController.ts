import { controller, post } from '../common/decorator'
import { mysql } from '../middlewares/mysql'

@controller('/user')
export default class TestController {
	@post('/login', mysql())
	async login(ctx: any) {
		const { key } = ctx.request.body
		
		ctx.body = {
			status: 'OK',
			payload: 'login' + key
		}
	}

	@post('/register', mysql())
	async test(ctx: any) {
		const { username } = ctx.request.body
		
		ctx.body = {
			status: 'OK',
			payload: 'register' + username
		}
	}
}
