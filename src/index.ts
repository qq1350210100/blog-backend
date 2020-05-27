import Koa from 'koa'
import cors from '@koa/cors'
import Router from 'koa-router'
import koaBody from 'koa-body'
import {initRoutes} from './common/initRoute'

const app = new Koa()
const router = new Router()

app.use(cors()).use(koaBody())

initRoutes(app, router)
app.listen(10086)
