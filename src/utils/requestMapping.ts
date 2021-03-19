import { request } from 'koa-swagger-decorator'
import { Method } from '../utils/enums'

type RequestDecorator = (
  target: any,
  name: string,
  descriptor: PropertyDescriptor
) => PropertyDescriptor

export const get = (url: string): RequestDecorator => request(Method.GET, url)

export const post = (url: string): RequestDecorator => request(Method.POST, url)

export const put = (url: string): RequestDecorator => request(Method.PUT, url)

export const del = (url: string): RequestDecorator => request(Method.DELETE, url)
