import { ArticleInfo, ArticleDetail } from '../utils/type'
import * as artileDAO from '../dao/article'
import { EventEmitter } from 'events'

export default class Article extends EventEmitter {
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

  public constructor(info: ArticleInfo) {
    super()
    this._info = info
  }

  public async add() {
    if (!this.info || !this.content) throw new Error('数据不完整，添加失败')

    const detail: ArticleDetail = { ...this.info, content: this.content }
    await artileDAO.add(detail)
  }

  public static async remove(id: string) {
    await artileDAO.remove(id)
  }

  public static async getContent(id: string) {
    const content = await artileDAO.getContent(id)
    if (content) return content
  }

  public static async find({ sort, id }: { sort?: string; id?: string }) {
    if (sort) return await artileDAO.findBySort(sort)
    // 考虑到 number 0
    if (id != null) return await artileDAO.findById(id)
  }
}
