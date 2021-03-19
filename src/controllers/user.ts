import { prefix, summary, body, tagsAll, query, middlewares } from 'koa-swagger-decorator'
import { Context } from 'koa'
import Controller from '../utils/baseClass/Controller'
import { get, post, put } from '../utils/requestMapping'
import { RespMsg } from '../utils/enums'
import { convertToBoolean } from '../utils'
import { auth } from '../middlewares'
import { Profile } from '../utils/type'

@prefix('/user')
@tagsAll(['User'])
export default class UserController extends Controller {
  @get('/init_data')
  @summary('init user data, includes accout,profile and setting')
  @middlewares([auth()])
  public async getSignStatus(): Promise<void> {
    const { userId } = this.ctx as Context & { userId: number }
    const { User, Setting } = this.service
    const userInfo = await User.find({ userId })
    const setting = new Setting(userId)
    const userSetting = await setting.get()

    if (userInfo && userSetting) {
      const result = {
        ...convertToBoolean(userInfo.account),
        ...convertToBoolean(userInfo.profile),
        setting: convertToBoolean(userSetting)
      }
      this.ctx.resp(result, RespMsg.OK, 200)
    } else {
      this.ctx.resp({}, RespMsg.OK, 200)
    }
  }

  @get('/profile')
  @summary('fetch user profile')
  @query({
    username: { type: String, required: true, example: 'string' }
  })
  public async getProfile(): Promise<void> {
    const { username }: { username: string } = this.ctx.query
    const res = await this.service.User.find({ username })
    if (res?.profile) {
      this.ctx.resp(
        {
          ...convertToBoolean(res.profile),
          username
        },
        RespMsg.OK,
        200
      )
    } else {
      this.ctx.resp({}, '用户不存在', 200)
    }
  }

  @put('/save_profile')
  @summary('save user profile')
  @body({
    avatar: { type: String, required: false, example: 'string' },
    level: { type: String, required: false, example: 'string' },
    gender: { type: String, required: false, example: 'string' },
    nickname: { type: String, required: false, example: 'string' },
    selfIntroduction: { type: String, required: false, example: 'string' }
  })
  @middlewares([auth()])
  public async saveProfile(): Promise<void> {
    let { userId } = this.ctx as Context & { userId: number }
    userId = Number(userId)
    const {
      contacts: { github, email, phone, wechat },
      ...rest
    } = this.ctx.request.body

    const { User } = this.service
    const user = new User()
    await user.initById(userId)
    await user.updateProfile({
      ...rest,
      github,
      email,
      phone,
      wechat
    })

    this.ctx.resp({}, RespMsg.OK, 200)
  }

  @post('/sign_in')
  @summary('user account sign in')
  @body({
    username: { type: String, required: true, example: 'string' },
    password: { type: String, required: true, example: 'string' }
  })
  public async signIn(): Promise<void> {
    const { username, password }: { username: string; password: string } = this.ctx.request.body
    const user = new this.service.User()
    user.profile = {
      nickname: '匿名用户'
    }
    try {
      await user.signIn(username, password)
      if (this.ctx.session) {
        this.ctx.session.userId = user.profile.userId
        this.ctx.resp({}, RespMsg.OK, 200)
      }
    } catch (err) {
      this.ctx.resp({}, err.message, err.code)
    }
  }

  @post('/register')
  @summary('user account register')
  @body({
    username: { type: String, required: true, example: 'string' },
    password: { type: String, required: true, example: 'string' },
    profile: { type: Object, required: false, example: { nickname: 'string' } }
  })
  public async register(): Promise<void> {
    const {
      username,
      password,
      profile = {}
    }: {
      username: string
      password: string
      profile: Profile
    } = this.ctx.request.body

    const user = new this.service.User()
    await user.register(username, password, {
      ...profile,
      level: 1,
      isOnline: false
    })
    this.ctx.resp({}, RespMsg.OK, 200)
  }

  @post('/sign_out')
  @summary('user account sign out')
  @middlewares([auth()])
  public async signOut(): Promise<void> {
    let { userId } = this.ctx as Context & { userId: number }
    userId = Number(userId)
    await this.service.User.signOut(userId)
    this.ctx.session = null
    this.ctx.resp({}, RespMsg.OK, 200)
  }
}
