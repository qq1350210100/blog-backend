import { prefix, summary, query, tagsAll } from 'koa-swagger-decorator'
import { readFile } from 'fs/promises'
import { join } from 'path'
import Controller from '../utils/baseClass/Controller'
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
  public async search(): Promise<void> {
    let { keywords, limit } = this.ctx.query
    keywords = String(keywords)
    limit = Number(limit)

    const { Article, User } = this.service
    const [articles, users] = await Promise.all([
      Article.search(keywords, limit),
      User.search(keywords, limit)
    ])
    this.ctx.resp({ articles, users }, RespMsg.OK, 200)
  }

  @get('/urls')
  @summary('Get some development documents')
  public async fetchUrls(): Promise<void> {
    const jsonPath = join(process.cwd(), 'static/json/urls.json')
    const json = await readFile(jsonPath, 'utf-8')
    this.ctx.resp(JSON.parse(json), RespMsg.OK, 200)
  }
}
