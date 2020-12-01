import asyncBusboy from 'async-busboy'
import Koa from 'koa'

export default function busboy(): (ctx: Koa.Context, next: Koa.Next) => Promise<void> {
  return async (ctx: Koa.Context, next: Koa.Next) => {
    const { files = [], fields } = await asyncBusboy(ctx.req)

    if (fields && files?.length) {
      ctx.files = files
      ctx.fields = fields
    }
    await next()
  }
}
