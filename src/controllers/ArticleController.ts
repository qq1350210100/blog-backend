import { controller, get, post } from '../common/decorator'
import { mysql } from '../middlewares/mysql'

@controller('/article')
export default class ArticleController {
	/**
	 * 获取文章列表
	 * @param ctx Context
	 */
	@get('/list', mysql())
	async getArticleList(ctx: any) {
		let status: string = 'FAIL'
		let response: any = '没有数据'
		const { sort } = ctx.query
		const articleList: string[] = await ctx.mysql.query(`
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
		`)
		if (articleList.length > 0) {
			status = 'OK'
			response = articleList.map((item: any) => {
				const { tags } = item
				const tagsList: string[] = tags.split(',')
				return { ...item, tags: tagsList }
			})
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
		let status: string = 'FAIL'
		let response: any = '没有数据'
		const { articleId } = ctx.query
		if (articleId) {
			try {
				const data: any[] = await ctx.mysql.query(`
					SELECT 
						background_image AS backgroundImage, 
						title,
						author,
						introduce,
						content,
						views,
						tags 
					FROM article WHERE id = ${articleId};
				`)
				const result = data[0]
				if (result) {
					const { tags } = result
					const tagArr: string[] = tags ? tags.split(',') : []
					status = 'OK'
					response = { ...result, articleId, tags: tagArr }
				}
			} catch (e) {
				console.error('执行SQL语句失败')
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
		let status: string = 'FAIL'
		let response: any = null
		const { nickname, title, content, sort, tags = [] } = ctx.request.body
		let tagsStr: string = ''
		if (tags.length > 0) {
			tagsStr = tags.join(',')
		}
		try {
			await ctx.mysql.query(`
				INSERT INTO article SET 
					title = '${title}',
					content = '${content}',
					author = '${nickname}',
					sort = '${sort}',
					tags = '${tagsStr}';
			`)
			status = 'OK'
			response = '添加成功'
		} catch (e) {
			console.error('执行SQL语句失败')
		}
		ctx.body = {
			status,
			payload: response
		}
	}
}
