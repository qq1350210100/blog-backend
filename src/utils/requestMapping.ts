import { request } from 'koa-swagger-decorator'
import { Method } from '../utils/enums'

const get = (url: string) => request(Method.GET, url)

const post = (url: string) => request(Method.POST, url)

const put = (url: string) => request(Method.PUT, url)

const del = (url: string) => request(Method.DELELTE, url)

export { request, get, post, put, del }
