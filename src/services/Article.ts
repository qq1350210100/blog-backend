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
  private _id?: string
  private _likeList?: string[]

  public get id() {
    return this._id
  }
  public set id(value) {
    this._id = value
  }

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

  public get likeList() {
    return this._likeList
  }
  public set likeList(value) {
    this._likeList = value
  }

  constructor(info?: ArticleInfo) {
    super()
    this._info = info
    this._likeList = []
  }

  public async add() {
    if (!this.info || !this.content) {
      throw '数据不完整，添加失败'
    }

    const detail: ArticleDetail = { ...this.info, content: this.content }
    await this.dao.article.add(detail)
  }

  public async init(id: string) {
    const results = await Article.find({ id })
    if (!results?.length) {
      throw '找不到该文章'
    }
    this.id = id
    const info = results[0]
    this.info = info
    this.likeList = info.likes
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

  public async increaseViews() {
    if (!this.info) return

    if (this.id) {
      const increment: number = 1
      const oldViews: number = this.info.views
      const newViews: number = oldViews + increment
      await this.dao.article.increaseViews(this.id, newViews)
    }
  }

  public async addLikesMember(userId: string) {
    this.likeList = Array.isArray(this.likeList) ? this.likeList : []
    const hadExist: boolean =
      this.likeList.some(item => item?.toString?.() === userId?.toString?.()) || false
    if (hadExist) {
      throw '已经点赞过了'
    }
    if (this.id) {
      const newLikes = [...this.likeList, userId]
      await this.dao.article.setLikes(this.id, newLikes)
      this.likeList.push(userId)
    }
  }

  public async removeLikesMember(userId: string) {
    this.likeList = Array.isArray(this.likeList) ? this.likeList : []
    const hadExist: boolean =
      this.likeList.some(item => item?.toString?.() === userId?.toString?.()) || false
    if (!hadExist) return

    if (this.id) {
      const newLikes = this.likeList.filter(item => item !== userId)
      await this.dao.article.setLikes(this.id, newLikes)
      this.likeList = newLikes
    }
  }
}
