import { controller, get } from '../common/decorator'
import { mysql } from '../middlewares/mysql'

@controller('/article')
export default class ArticleController {
	@get('/list', mysql())
	async getArticleList(ctx: any) {
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

		const articleList = await ctx.mysql.query(sql)
		const response = articleList.map((item: any) => {
			const { tags } = item
			const tagsList = tags.split(',')
			return { ...item, tags: tagsList }
		})

		ctx.body = {
			status: 'OK',
			payload: response
		}
	}

	@get('/content', mysql())
	async getArticleContent(ctx: any) {
		const { articleId } = ctx.query
		const sql = `
		  select background_image as backgroundImage, content from article where id = ${articleId};
		`
		if (articleId) {
			const data = await ctx.mysql.query(sql)
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
	}
}
