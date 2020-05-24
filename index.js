const Koa = require('koa')
const cors = require('@koa/cors')
const Router = require('koa-router')
const bodyParser = require('koa-body-parser')
const mysql = require('./database/mysql')

const app = new Koa()
const router = new Router()

app.use(cors()).use(bodyParser()).use(router.routes()).use(router.allowedMethods())

app.listen(10086)

router
	.get('/api/articleList', async ctx => {
		const { sort } = ctx.query

		const sql = `
      select 
        id               as id,
        sort             as sort,
        title            as title,
        background_image as backgroundImage,
        author           as author,
        views            as views,
        tags             as tags
      from article
      ${sort ? `where sort = '${sort}'` : ''};
    `

		const data = await mysql.query(sql)
		const response = data.map(item => {
			const { tags } = item
			const tagsList = tags.split(',')
			return { ...item, tags: tagsList }
		})

		ctx.body = {
			status: 'OK',
			payload: response
		}
	})
	.get('/api/articleContent', async ctx => {
		const { articleId } = ctx.query

		const sql = `
      SELECT background_image as backgroundImage, content from article where id = ${articleId};
    `
		if (articleId) {
			const data = await mysql.query(sql)
			const payload = data[0]
			ctx.body = {
				status: 'OK',
				payload
			}
		} else {
			ctx.body = {
				status: 'FAIL',
				payload: '缺少参数'
			}
		}
	})
