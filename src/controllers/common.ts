import Controller from '../utils/baseClass/Controller'
import { prefix, summary, query, tagsAll } from 'koa-swagger-decorator'
import { get } from '../utils/requestMapping'
import { RespMsg } from '../utils/enums'

@prefix('/common')
@tagsAll(['Common'])
export default class CommonController extends Controller {
  @get('/search')
  @summary('Fuzzy query users or articles')
  @query({
    keywords: { type: String, required: true, example: 'string' },
    limit: { type: Number, required: false, example: 10 }
  })
  public async search() {
    const query = this.ctx.query
    const keywords = query.keywords.toString()
    const limit = Number(query.limit)
    const { Article, User } = this.service
    const [articles, users] = await Promise.all([
      Article.search(keywords, limit),
      User.search(keywords, limit)
    ])
    this.ctx.resp({ articles, users }, RespMsg.OK, 200)
  }
}
