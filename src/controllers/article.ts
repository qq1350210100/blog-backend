import Controller from '../utils/baseClass/Controller'
import { prefix, summary, query, body, tagsAll, middlewares } from 'koa-swagger-decorator'
import { get, post } from '../utils/requestMapping'
import { RespMsg } from '../utils/enums'
import { ArticleDetail, ArticleInfo } from '../utils/type'
import omit from 'omit.js'
import { auth } from '../middlewares'

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
    articleId: { type: Number, required: true, example: 1 }
  })
  public async detail() {
    const body: { articleId: number } = this.ctx.query
    const articleId = Number(body.articleId)
    const { Article } = this.service
    const results = await Article.find({ id: articleId })
    const content = await Article.getContent(articleId)

    if (!results || !results.length || !content) {
      this.ctx.resp({}, '未查询到结果', 200)
      return
    }

    const detail = results[0]
    this.ctx.resp({ ...detail, content }, RespMsg.OK, 200)
  }

  @post('/add')
  @summary('add a new acticle')
  @middlewares([auth()])
  @body({
    userId: { type: Number, required: true, example: 1 },
    articleDetail: { type: Object, required: true, example: {} }
  })
  public async add() {
    const body: {
      userId: number
      articleDetail: ArticleDetail
    } = this.ctx.request.body
    const { articleDetail } = body
    const userId = Number(body.userId)
    const { Article, User } = this.service

    const articleInfo: ArticleInfo = omit({ ...articleDetail }, ['content'])
    const article = new Article(articleInfo)
    article.content = articleDetail.content
    const user = new User()
    await user.initById(userId)
    await user.addArticle(article)

    this.ctx.resp({}, RespMsg.OK, 200)
  }

  @post('/remove')
  @summary('remove a existing article')
  @middlewares([auth()])
  @body({
    articleId: { type: Number, required: true, example: 1 }
  })
  public async remove() {
    const body: { articleId: number } = this.ctx.request.body
    const articleId = Number(body.articleId)
    await this.service.Article.remove(articleId)
    this.ctx.resp({}, RespMsg.OK, 200)
  }

  @post('/increase_views')
  @summary('article views count increase 1')
  @body({
    articleId: { type: Number, required: true, example: 1 }
  })
  public async increaseViews() {
    const body: { articleId: number } = this.ctx.request.body
    const articleId = Number(body.articleId)
    const { Article } = this.service

    if (!articleId) return

    const article = new Article()
    await article.init(articleId)
    await article.increaseViews()

    if (!article.info) return

    const views = article.info.views + 1
    this.ctx.resp({ views }, RespMsg.OK, 200)
  }

  @post('/likes')
  @summary('user likes a article')
  @middlewares([auth()])
  @body({
    userId: { type: Number, required: true, example: 1 },
    articleId: { type: Number, required: true, example: 1 }
  })
  public async likes() {
    const body: { articleId: number; userId: number } = this.ctx.request.body
    const articleId = Number(body.articleId)
    const userId = Number(body.userId)

    const { User, Article } = this.service
    const user = new User()
    await user.initById(userId)
    const artilce = new Article()
    await artilce.init(articleId)
    await artilce.addLikesMember(userId)
    this.ctx.resp({}, RespMsg.OK, 200)
  }

  @post('/dislike')
  @summary('user dislike a article')
  @middlewares([auth()])
  @body({
    userId: { type: Number, required: true, example: 1 },
    articleId: { type: Number, required: true, example: 1 }
  })
  public async dislike() {
    const body: { articleId: number; userId: number } = this.ctx.request.body
    const articleId = Number(body.articleId)
    const userId = Number(body.userId)

    const { User, Article } = this.service
    const user = new User()
    await user.initById(userId)
    const artilce = new Article()
    await artilce.init(articleId)
    await artilce.removeLikesMember(userId)
    this.ctx.resp({}, RespMsg.OK, 200)
  }
}
