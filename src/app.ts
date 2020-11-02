import Koa from 'koa'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import session from 'koa-session'
import router from './router'
import { respHandler } from './middlewares'
import koaStatic from 'koa-static'
import path from 'path'

const app = new Koa()
app.keys = ['SESSION_KEYS']
app
  .use(
    cors({
      credentials: true
    })
  )
  .use(
    session(
      {
        key: 'koa.sess',
        maxAge: 864000000
      },
      app
    )
  )
  .use(koaStatic(path.join(__dirname, '../static')))
  .use(bodyParser())
  .use(respHandler())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(10086)
