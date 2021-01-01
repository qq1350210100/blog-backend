import Koa from 'koa'
import { User } from '../services'

export default function authorization(): (ctx: Koa.Context, next: Koa.Next) => Promise<void> {
  return async (ctx: Koa.Context, next: Koa.Next) => {
    const respBody = {
      message: '没有权限',
      payload: {}
    }

    if (ctx?.session?.userId) {
      const { userId } = ctx.session
      try {
        await User.find({ userId })
        ctx.userId = Number(userId)
        try {
          await next()
        } catch (err) {
          ctx.status = 200
          ctx.body = {
            message: err,
            payload: {}
          }
        }
        return
      } catch (err) {
        respBody.message = err
        ctx.status = 500
      }
    }
    ctx.status = 401
    ctx.body = respBody
  }
}
