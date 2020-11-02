import Koa from 'koa'
import { User } from '../services'

export default function authorization() {
  return async (ctx: Koa.Context, next: Koa.Next) => {
    const respBody = {
      message: '没有权限',
      payload: {}
    }

    if (ctx?.session?.userId) {
      const { userId } = ctx.session
      try {
        await User.find({ userId })
        ctx.userId = userId
        await next()
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
