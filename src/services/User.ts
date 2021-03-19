import Service from '../utils/baseClass/Service'
import Article from './Article'
import { Profile } from '../utils/type'
import * as is from '../utils/is'
import { Setting } from '.'

export default class User extends Service {
  private _userId?: number
  private _username?: string
  private _password?: string
  private _profile?: Profile
  private _aritlceList: Article[]

  public get password() {
    return this._password
  }

  public set password(value) {
    this._password = value
  }

  public get userId() {
    return this._userId
  }

  public set userId(value) {
    this._userId = value
  }

  public get username() {
    return this._username
  }

  public set username(value) {
    this._username = value
  }

  public get profile() {
    return this._profile
  }

  public set profile(value) {
    this._profile = value
  }

  public get aritlceList() {
    return this._aritlceList
  }

  public set aritlceList(value) {
    this._aritlceList = value
  }

  constructor() {
    super()
    this._aritlceList = []
  }

  public async addArticle(article: Article): Promise<void> {
    if (!article.info || !this.username) return

    article.info.author = this.username
    await article.add()
    this.aritlceList.push(article)
  }

  public async removeArticle(articleId: number): Promise<void> {
    await Article.remove(articleId)
    this.aritlceList = this.aritlceList.filter(
      (article: Article) => article.info?.articleId !== articleId
    )
  }

  private setUserInfo(userId: number, username: string, password: string, profile: Profile): void {
    this.userId = userId
    this.username = username
    this.password = password
    this.profile = profile
  }

  public async initById(userId: number): Promise<void> {
    const result = await User.find({ userId })
    if (!result) throw { message: '用户不存在', code: 200 }

    const {
      account: { username, password },
      profile
    } = result
    this.setUserInfo(userId, username, password, profile)
  }

  public async register(username: string, password: string, profile: Profile): Promise<void> {
    const userHadExist = Boolean(await User.find({ username }))
    if (userHadExist) throw { message: '用户已存在', code: 200 }
    if (!is.object(profile)) throw { message: '资料不全，注册失败', code: 200 }

    await this.dao.user.create(username, password, profile)

    // 初始化用户设置
    const result = await User.find({ username })
    if (result?.profile?.userId) {
      const { userId } = result.profile
      const setting = new Setting(userId)
      await setting.create()
      this.setUserInfo(userId, username, password, profile)
    } else {
      throw { message: '注册失败', code: 200 }
    }
  }

  public async signIn(username: string, password: string): Promise<void> {
    const result = await User.find({ username })
    if (!result) {
      throw { message: '用户不存在', code: 200 }
    }

    await this.dao.user.signIn(username, password)
    const userId = result.profile.userId
    if (userId) {
      this.setUserInfo(userId, username, password, result.profile)
    }
  }

  public async updateProfile(profile: Profile): Promise<void> {
    const newProfile = { ...this.profile, ...profile }

    if (!this.userId) {
      throw { message: '用户不存在', code: 200 }
    }
    this.dao.user.setProfile(this.userId, newProfile)
  }

  public static async signOut(userId: number): Promise<void> {
    if (!(await User.find({ userId }))) {
      throw { message: '用户不存在', code: 200 }
    }

    await this.dao.user.signOut(userId)
  }

  public static async find({ username, userId }: { username?: string; userId?: number }) {
    if (username) {
      return await this.dao.user.findByName(username)
    }
    if (userId) {
      return await this.dao.user.findById(userId)
    }
    throw { message: '用户不存在', code: 200 }
  }

  /**
   * 文章模糊匹配
   * @param keywords 关键字 - username、nickname
   */
  public static async search(
    keywords: string,
    limit?: number
  ): Promise<
    {
      id: number
      username: string
      nickname: string
      avatar: string
    }[]
  > {
    return (await this.dao.user.search(keywords, limit)) || []
  }
}
