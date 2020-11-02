import { request } from 'koa-swagger-decorator'
import { Method } from '../utils/enums'

export const get = (url: string) => request(Method.GET, url)

export const post = (url: string) => request(Method.POST, url)

export const put = (url: string) => request(Method.PUT, url)

export const delelte = (url: string) => request(Method.DELELTE, url)
