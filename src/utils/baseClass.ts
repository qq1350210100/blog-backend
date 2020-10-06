import Koa from 'koa'

export class Controller {
  ctx: Koa.Context
  app: Koa<Koa.DefaultState, Koa.DefaultContext>
  public constructor(ctx: Koa.Context) {
    this.ctx = ctx
    this.app = ctx.app
  }
}
