import { controller, get, post } from '../common/decorator'
import mysql from '../middlewares/mysql'
import { responseStatus } from '../common/constant'

@controller('/article')
export default class ArticleController {
	/**
	 * 获取文章列表
	 * @param ctx Context
	 */
	@get('/list', mysql())
	async getArticleList(ctx: any) {
		let status: string = responseStatus.FAIL
		let response: any = '没有数据'
		const { sort } = ctx.query
		try {
			let sql: string = /*sql*/ `
				SELECT
					id               AS id,
					sort             AS sort,
					title            AS title,
					background_image AS backgroundImage,
					author           AS author,
					views            AS views,
					tags             AS tags
				FROM article
				${sort ? `WHERE sort = '${sort}'` : ''};
			`
			const articleList: string[] = await ctx.mysql.query(sql)
			if (articleList.length > 0) {
				status = responseStatus.OK
				response = articleList.map((item: any) => {
					const { tags } = item
					const tagsList: string[] = tags.split(',')
					return { ...item, tags: tagsList }
				})
			}
		} catch (e) {
			console.error('SQL语句执行失败', e)
		}
		ctx.body = {
			status,
			payload: response
		}
	}

	/**
	 * 获取文章详细内容
	 * @param ctx Context
	 */
	@get('/detail', mysql())
	async getArticleDetail(ctx: any) {
		let status: string = responseStatus.FAIL
		let response: any = '没有数据'
		const { articleId } = ctx.query
		if (articleId) {
			try {
				let sql: string = /*sql*/ `
					SELECT 
						background_image AS backgroundImage, 
						title,
						author,
						introduce,
						content,
						views,
						tags 
					FROM article WHERE id = ${articleId};
				`
				const data: any[] = await ctx.mysql.query(sql)
				const result = data[0]
				if (result) {
					const { tags } = result
					const tagArr: string[] = tags ? tags.split(',') : []
					status = responseStatus.OK
					response = { ...result, articleId, tags: tagArr }
				}
			} catch (e) {
				console.error('SQL语句执行失败', e)
			}
		}
		ctx.body = {
			status,
			payload: response
		}
	}

	/**
	 * 添加文章
	 * @param ctx Context
	 */
	@post('/add_article', mysql())
	async addArticle(ctx: any) {
		let status: string = responseStatus.FAIL
		let response: any = null
		const { userId, articleDetail } = ctx.request.body
		const { title, author, content, sort, tags = [] } = articleDetail
		let tagsStr: string = ''
		if (tags.length > 0) {
			tagsStr = tags.join(',')
		}
		try {
			let sql: string = /*sql*/ `
				INSERT INTO article SET 
					title = '${title}',
					content = '${content}',
					author = '${author}',
					sort = '${sort}',
					tags = '${tagsStr}';
			`
			await ctx.mysql.query(sql)
			status = responseStatus.OK
			response = '添加成功'
		} catch (e) {
			console.error('SQL语句执行失败', e)
		}
		ctx.body = {
			status,
			payload: response
		}
	}
}
