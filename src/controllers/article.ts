import Controller from '../utils/baseClass/Controller'
import { prefix, summary, query, body, tagsAll } from 'koa-swagger-decorator'
import { get, post } from '../utils/requestMapping'
import { RespMsg } from '../utils/enums'
import { ArticleDetail, ArticleInfo } from '../utils/type'
import omit from 'omit.js'

@prefix('/article')
@tagsAll(['Article'])
export default class ArticleController extends Controller {
  @get('/list')
  @summary('fetch article list by sort')
  @query({
    sort: { type: String, required: false, example: 'string' }
  })
  public async list() {
    const { sort = 'all' }: { sort: string } = this.ctx.query
    const aritcles = await this.service.Article.find({ sort })
    this.ctx.resp(aritcles, RespMsg.OK, 200)
  }

  @get('/detail')
  @summary('fetch article detail')
  @query({
    articleId: { type: String, required: true, example: 'string' }
  })
  public async detail() {
    const { articleId }: { articleId: string } = this.ctx.query
    const results = await this.service.Article.find({ id: articleId })
    const content = await this.service.Article.getContent(articleId)

    if (!results || !results.length || !content) {
      this.ctx.resp({}, RespMsg.FAIL, 200)
      return
    }

    const detail = results[0]
    this.ctx.resp({ ...detail, content }, RespMsg.OK, 200)
  }

  @post('/add')
  @summary('add a new acticle')
  @body({
    userId: { type: String, required: true, example: 'string' },
    articleDetail: { type: Object, required: true, example: {} }
  })
  public async add() {
    const {
      userId,
      articleDetail
    }: { userId: string; articleDetail: ArticleDetail } = this.ctx.request.body

    const articleInfo: ArticleInfo = omit({ ...articleDetail }, ['content'])
    const article = new this.service.Article(articleInfo)
    article.content = articleDetail.content
    const user = new this.service.User()
    await user.initById(userId)
    await user.addArticle(article)

    this.ctx.resp({}, RespMsg.OK, 200)
  }

  @post('/remove')
  @summary('remove a existing article')
  @body({
    articleId: { type: String, required: true, example: 'string' }
  })
  public async remove() {
    const { articleId }: { articleId: string } = this.ctx.request.body
    await this.service.Article.remove(articleId)
    this.ctx.resp({}, RespMsg.OK, 200)
  }
}
