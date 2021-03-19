import {
  ArticleInfo,
  ArticleDetail,
  ArticleSordBy,
  FormatedArticleInfo,
  Profile,
  Review
} from '../utils/type'
import Service from '../utils/baseClass/Service'
import User from './User'

export default class Article extends Service {
  private _info?: ArticleInfo
  private _content?: string
  private _id?: number
  private _likeList: number[]
  private _reviewList: Review[]

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

  public get likeList(): number[] {
    return this._likeList
  }

  public set likeList(value: number[]) {
    this._likeList = value
  }

  public get reviewList(): Review[] {
    return this._reviewList
  }

  public set reviewList(value: Review[]) {
    this._reviewList = value
  }

  constructor(info?: ArticleInfo) {
    super()
    this._info = info
    this._likeList = []
    this._reviewList = []
  }

  public async add(): Promise<void> {
    if (!this.info || !this.content) {
      throw { message: '数据不完整', code: 200 }
    }

    const detail: ArticleDetail = { ...this.info, content: this.content }
    await this.dao.article.add(detail)
  }

  public async init(id: number): Promise<void> {
    const results = await Article.find({ id })
    if (!results?.length) {
      throw { message: '找不到该文章', code: 200 }
    }
    this.id = id
    const [info] = results
    this.info = info
    this.likeList = info.likes
    await this.setReviewList()
  }

  private async setReviewList(): Promise<void> {
    if (!this.id) return
    const reviews = await this.dao.article.getReviewByArticle(this.id)
    if (reviews.length) {
      this.reviewList = reviews
    }
  }

  public static async remove(id: number): Promise<void> {
    await this.dao.article.remove(id)
  }

  public static async getContent(id: number): Promise<string | undefined> {
    const content = await this.dao.article.getContent(id)
    if (content) return content
  }

  public static async find({
    category,
    id,
    sortBy = 'latest'
  }: {
    category?: string
    id?: number
    sortBy?: ArticleSordBy
  }): Promise<FormatedArticleInfo[] | undefined> {
    // 考虑到 number=0
    if (id != null) {
      return await this.dao.article.findById(id)
    }
    let results: FormatedArticleInfo[] = []
    if (category) {
      function getOrderKey() {
        switch (sortBy) {
          case 'latest':
            return 'creation_time'
          case 'popular':
            return 'views'
          case 'random':
            return 'rand()'
          default:
            throw new Error(`sort by ${sortBy} not match`)
        }
      }
      const res = await this.dao.article.findAndSort(category, getOrderKey())
      if (res?.length) {
        results = res
      }
    }
    return results
  }

  /**
   * 文章模糊匹配
   * @param keywords 关键字 - title、introduce和content
   */
  public static async search(
    keywords: string,
    limit?: number
  ): Promise<
    {
      id: number
      title: string
      author: number
      category: string
    }[]
  > {
    return (await this.dao.article.search(keywords, limit)) || []
  }

  public async increaseViews(): Promise<void> {
    if (!this.info) return

    if (this.id) {
      const increment: number = 1
      const oldViews: number = this.info.views
      const newViews: number = oldViews + increment
      await this.dao.article.increaseViews(this.id, newViews)
    }
  }

  public async addLikesMember(userId: number): Promise<void> {
    this.likeList = Array.isArray(this.likeList) ? this.likeList : []
    const hadExist: boolean = this.likeList.some(item => item === userId) || false
    if (hadExist) {
      throw { message: '已经点赞过了', code: 200 }
    }
    if (this.id) {
      const newLikes = [...this.likeList, userId]
      await this.dao.article.setLikes(this.id, newLikes)
      this.likeList.push(userId)
    }
  }

  public async removeLikesMember(userId: number): Promise<void> {
    this.likeList = Array.isArray(this.likeList) ? this.likeList : []
    const hadExist: boolean = this.likeList.some(item => item === userId) || false
    if (!hadExist) return

    if (this.id) {
      const newLikes = this.likeList.filter(item => item !== userId)
      await this.dao.article.setLikes(this.id, newLikes)
      this.likeList = newLikes
    }
  }

  public async comment(userId: number, content: string): Promise<void> {
    if (!this.id) return
    const user = new User()
    await user.initById(userId)
    await this.dao.article.comment(this.id, userId, content)
    await this.setReviewList()
  }

  public async getReviews(): Promise<(Omit<Review, 'speaker'> & { speaker: Profile })[]> {
    if (!this.id) return []

    return await Promise.all(
      this.reviewList.map(async review => {
        const { speaker } = review
        const user = new User()
        await user.initById(speaker)
        const profile: Profile = user.profile ?? {}
        return { ...review, speaker: profile }
      })
    )
  }
}
