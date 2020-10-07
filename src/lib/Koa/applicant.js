import http from 'http'
import EventEmitter from 'events'
import context from './context.js'
import request from './request.js'
import response from './response.js'
import { koaCompose } from './utils.js'

export default class Applicant extends EventEmitter {
  public constructor() {
    super()
    this.middlewares = []
    this.context = context
    this.request = request
    this.response = response
  }

  use(middleware) {
    if (typeof middleware != 'function') {
      throw new TypeError(`middleware ${middleware} is not a function`)
    }
    this.middlewares.push(middleware)
    return this
  }

  listen(...args) {
    const server = http.createServer(this.callback())
    server.listen(...args)
  }

  callback() {
    const middlewareFn = koaCompose(...this.middlewares) // 中间件只 compose 一次
    return (req, res) => {
      const ctx = this.createContext(req, res)

      return this.handleRequest(ctx, middlewareFn)
    }
  }

  handleRequest(ctx, middlewareFn) {
    ctx.res.statusCode = 404
    ctx.body = 'Not found'
    middlewareFn(ctx).then(() => this.handleEnd(ctx))
  }

  handleEnd(ctx) {
    ctx.res.end(ctx.body)
  }

  createContext(req, res) {
    const ctx = Object.create(this.context)
    const request = (ctx.request = Object.create(this.request))
    const response = (ctx.response = Object.create(this.response))

    ctx.app = request.app = response.app = this
    ctx.req = request.req = response.req = req
    ctx.res = request.res = response.res = res
    return ctx
  }
}
