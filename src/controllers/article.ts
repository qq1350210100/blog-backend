import { prefix, summary, query, body, tagsAll, middlewares, params } from 'koa-swagger-decorator'
import omit from 'omit.js'
import Controller from '../utils/baseClass/Controller'
import { get, post, del } from '../utils/requestMapping'
import { RespMsg } from '../utils/enums'
import { ArticleDetail, ArticleInfo, ArticleSordBy } from '../utils/type'
import { auth } from '../middlewares'

@prefix('/article')
@tagsAll(['Article'])
export default class ArticleController extends Controller {
  @get('/list')
  @summary('fetch article list')
  @query({
    category: { type: String, required: false, example: 'string' },
    limit: { type: Number, required: false, example: 10 },
    sortBy: { type: String, required: true, example: 'string' }
  })
  public async list(): Promise<void> {
    let {
      category = 'all',
      sortBy,
      limit
    }: {
      category: string
      sortBy: ArticleSordBy
      limit: number
    } = this.ctx.query
    limit = Number(limit)

    const aritcles = await this.service.Article.find({ category, sortBy })
    this.ctx.resp(aritcles, RespMsg.OK, 200)
  }

  @get('/detail')
  @summary('fetch article detail')
  @query({
    articleId: { type: Number, required: true, example: 1 }
  })
  public async detail(): Promise<void> {
    let { articleId }: { articleId: number } = this.ctx.query
    articleId = Number(articleId)
    const { Article } = this.service
    const results = await Article.find({ id: articleId })
    const content = await Article.getContent(articleId)
    const article = new Article()
    await article.init(articleId)
    const reviews = await article.getReviews()

    if (!results || !results.length || !content) {
      this.ctx.resp({}, '未查询到结果', 200)
      return
    }

    const [detail] = results
    this.ctx.resp({ ...detail, content, reviews }, RespMsg.OK, 200)
  }

  @post('/add')
  @summary('add a new acticle')
  @middlewares([auth()])
  @body({
    userId: { type: Number, required: true, example: 1 },
    articleDetail: { type: Object, required: true, example: {} }
  })
  public async add(): Promise<void> {
    let {
      userId,
      articleDetail
    }: {
      userId: number
      articleDetail: ArticleDetail
    } = this.ctx.request.body
    userId = Number(userId)

    const { Article, User } = this.service

    const articleInfo: ArticleInfo = omit({ ...articleDetail }, ['content'])
    const article = new Article(articleInfo)
    article.content = articleDetail.content
    const user = new User()
    await user.initById(userId)
    await user.addArticle(article)

    this.ctx.resp({}, RespMsg.OK, 200)
  }

  @del('/remove')
  @summary('remove a existing article')
  @middlewares([auth()])
  @body({
    articleId: { type: Number, required: true, example: 1 }
  })
  public async remove(): Promise<void> {
    let { articleId }: { articleId: number } = this.ctx.request.body
    articleId = Number(articleId)
    await this.service.Article.remove(articleId)
    this.ctx.resp({}, RespMsg.OK, 200)
  }

  @post('/increase_views')
  @summary('article views count increase 1')
  @body({
    articleId: { type: Number, required: true, example: 1 }
  })
  public async increaseViews(): Promise<void> {
    let { articleId }: { articleId: number } = this.ctx.request.body
    articleId = Number(articleId)
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
  public async likes(): Promise<void> {
    let { articleId, userId }: { articleId: number; userId: number } = this.ctx.request.body
    articleId = Number(articleId)
    userId = Number(userId)

    const { Article } = this.service
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
  public async dislike(): Promise<void> {
    let { articleId, userId }: { articleId: number; userId: number } = this.ctx.request.body
    articleId = Number(articleId)
    userId = Number(userId)

    const { Article } = this.service
    const artilce = new Article()
    await artilce.init(articleId)
    await artilce.removeLikesMember(userId)
    this.ctx.resp({}, RespMsg.OK, 200)
  }

  @post('/comment')
  @summary('comment to article')
  @middlewares([auth()])
  @body({
    userId: { type: Number, required: true, example: 1 },
    articleId: { type: Number, required: true, example: 1 },
    content: { type: String, required: true, example: 'string' }
  })
  public async comment() {
    const {
      articleId,
      userId,
      content
    }: { articleId: number; userId: number; content: string } = this.ctx.request.body
    const { Article } = this.service
    const article = new Article()
    await article.init(articleId)
    await article.comment(userId, content)
    const reviews = await article.getReviews()
    const [userLastestReview] = reviews.filter(review => review.speaker.userId === userId)
    this.ctx.resp(userLastestReview, RespMsg.OK, 200)
  }

  @get('/review_list')
  @summary('get review list in article')
  @query({
    articleId: { type: Number, required: true, example: 1 }
  })
  public async getReviewList() {
    const { articleId }: { articleId: number } = this.ctx.query
    const { Article } = this.service
    const article = new Article()
    await article.init(articleId)
    const reviews = await article.getReviews()
    this.ctx.resp(reviews, RespMsg.OK, 200)
  }
}
