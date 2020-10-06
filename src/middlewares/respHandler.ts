import Koa from 'koa'
import { RespMsg } from '../utils/enums'
import { AnyObj } from '../utils/type'

export default function responseHandle() {
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
      const code = err.statusCode ?? 500
      ctx.status = code
      ctx.body = {
        payload: { code },
        message: err.message ?? RespMsg.FAIL
      }
    }
  }
}
