import Koa from 'koa'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import session from 'koa-session'
import router from './router'
import { respHandler } from './middlewares'
import config from './config'

const app = new Koa()
app.keys = ['SESSION_KEYS']
app
  .use(
    cors({
      credentials: true
    })
  )
  .use(session(config.SESSION, app))
  .use(bodyParser())
  .use(respHandler())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(10086)
