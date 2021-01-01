import Koa from 'koa'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import session from 'koa-session'
import router from './router'
import { respHandler } from './middlewares'
import koaStatic from 'koa-static'
import koaCompress from 'koa-compress'
import path from 'path'
import zlib from 'zlib'

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
        maxAge: 8640000000 // 100 days
      },
      app
    )
  )
  .use(
    koaCompress({
      threshold: 2048,
      gzip: {
        flush: zlib.constants.Z_SYNC_FLUSH
      }
    })
  )
  .use(
    koaStatic(path.join(__dirname, '../static'), {
      gzip: true,
      maxage: 8640000000 // 100 days
    })
  )
  .use(bodyParser())
  .use(respHandler())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(10086)
