import { ArticleInfo, ArticleDetail } from '../utils/type'
import { EventEmitter } from 'events'
import Service from '../utils/baseClass/Service'

export class Service1 extends EventEmitter {
  constructor() {
    super()
  }
}

export default class Article extends Service {
  private _info?: ArticleInfo
  private _content?: string

  public get info() {
    return this._info
  }
  public set info(value) {
    this._info = value
  }

  public get content() {
    return this._content
  }
  public set content(value) {
    this._content = value
  }

  constructor(info: ArticleInfo) {
    super()
    this._info = info
  }

  public async add() {
    if (!this.info || !this.content) throw '数据不完整，添加失败'

    const detail: ArticleDetail = { ...this.info, content: this.content }
    await this.dao.article.add(detail)
  }

  public static async remove(id: string) {
    await this.dao.article.remove(id)
  }

  public static async getContent(id: string) {
    const content = await this.dao.article.getContent(id)
    if (content) return content
  }

  public static async find({ sort, id }: { sort?: string; id?: string }) {
    if (sort) return await this.dao.article.findBySort(sort)
    // 考虑到 number 0
    if (id != null) return await this.dao.article.findById(id)
  }

  public async increaseViews(articleId: string) {
    if (!this.info) return

    const increment: number = 1
    const oldViews: number = this.info.views
    const newViews: number = oldViews + increment
    await this.dao.article.increaseViews(articleId, newViews)
  }
}
