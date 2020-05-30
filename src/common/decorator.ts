import bodyParser from 'koa-bodyparser'
import { requestMethod } from './constant'

/**
 * 定义注册的路由数组
 */
export const controllers: object[] = []

/**
 * controller类装饰器
 * @param {string} prefix // 请求路径前缀
 */
export const controller = (prefix: string = '') => (target: any) => {
	target.prefix = prefix
	// 给controller类添加路由前缀
	console.log('Controller: ', target)
}

/**
 * controller类方法装饰器
 * url 可选
 * method 请求方法
 * middleware 中间件
 */
interface Options {
	url: string
	method: string
	middleware?: AsyncGeneratorFunction[]
}

export function requestMapping({ url = '', method = '', middleware = [] }: Options) {
	return (target: any, name: string, descriptor: any) => {
		// 如果没有传自定义url，默认取方法名作为url
		if (!url) url = name
		// 创建router需要的数据 url，method，middleware（非必需），最终执行的方法，装饰器对象的构造函数
		const controller = {
			url,
			method,
			middleware,
			handler: target[name],
			constructor: target.constructor
		}
		controllers.push(controller)
	}
}

/**
 * url: 请求路径
 * middleware: 中间件
 */
interface RequestDecorator {
	(url: string, ...middleware: any[]): Function
}

export const get: RequestDecorator = (url, ...middleware) =>
	requestMapping({ method: requestMethod.GET, url, middleware })

export const post: RequestDecorator = (url, ...middleware) =>
	requestMapping({ method: requestMethod.POST, url, middleware: [bodyParser(), ...middleware] })

export const put: RequestDecorator = (url, ...middleware) =>
	requestMapping({ method: requestMethod.PUT, url, middleware: [bodyParser(), ...middleware] })
