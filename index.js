'use strict'

const Koa = require('koa')
const cors = require('@koa/cors')
const Router = require('koa-router')
const bodyParser = require('koa-body-parser')
const controller = require('./controller')

const app = new Koa()
const router = new Router()

app.use(cors()).use(bodyParser()).use(router.routes()).use(router.allowedMethods())

app.listen(10086)

router
	.get('/api/articleList', controller.article.getArticleList)
	.get('/api/articleContent', controller.article.getArticleContent)
