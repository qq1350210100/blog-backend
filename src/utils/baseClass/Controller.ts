import { EventEmitter } from 'events'
import Koa from 'koa'
import * as service from '../../services'

export default class Controller extends EventEmitter {
  ctx: Koa.Context
  app: Koa<Koa.DefaultState, Koa.DefaultContext>
  service: typeof service
  constructor(ctx: Koa.Context) {
    super()
    this.ctx = ctx
    this.app = ctx.app
    this.service = service
  }
}
