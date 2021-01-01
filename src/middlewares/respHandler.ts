import Koa from 'koa'
import { RespMsg } from '../utils/enums'
import { AnyObj } from '../utils/type'

export default function responseHandle(): (ctx: Koa.Context, next: Koa.Next) => Promise<void> {
  return async (ctx: Koa.Context, next: Koa.Next) => {
    ctx.resp = (payload: AnyObj = {}, message = RespMsg.OK, statusCode = 200) => {
      ctx.type = 'application/json'
      ctx.status = statusCode
      ctx.body = {
        payload,
        message: String(message)
      }
    }
    try {
      await next()
    } catch (err) {
      console.error(`Server internal error: ${err}`)
      const code: number = err.code ?? 500
      ctx.status = code
      ctx.body = {
        payload: {},
        message: err.message ?? RespMsg.FAIL
      }
    }
  }
}
