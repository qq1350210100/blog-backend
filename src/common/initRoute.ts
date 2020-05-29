import { controllers } from './decorator'
import'../controllers/UserController'
import'../controllers/ArticleController'
import'../controllers/SettingController'

export default function initRoutes(app: any, router: any) {
	controllers.forEach((controller: any) => {
		// 获取每个路由的前缀
		const {
			constructor: { prefix },
			url,
			method,
			middleware,
			handler
		} = controller
		const integralUrl = prefix ? prefix + url : url // 组合完整的url
		console.log(`「METHOD」:${method}, 「PATH」:${integralUrl}`) // 打印请求的路由method,url
		router[method](integralUrl, ...middleware, handler) // 创建路由
	})
	app.use(router.routes()).use(router.allowedMethods()) // 路由装箱
}
