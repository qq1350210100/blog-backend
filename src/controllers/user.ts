import Controller from '../utils/baseClass/Controller'
import { prefix, summary, body, tagsAll, query, middlewares } from 'koa-swagger-decorator'
import { get, post } from '../utils/requestMapping'
import { RespMsg } from '../utils/enums'
import authorization from '../middlewares/auth'
import { convertToBoolean } from '../utils'

@prefix('/user')
@tagsAll(['User'])
export default class UserController extends Controller {
  @get('/init_data')
  @summary('init user data, include accout,profile and setting')
  @middlewares([authorization()])
  public async getSignStatus() {
    const { userId } = this.ctx
    const userInfo = await this.service.User.find({ userId })
    const setting = new this.service.Setting(userId)
    const userSetting = await setting.get()

    if (userInfo && userSetting) {
      const result = {
        ...convertToBoolean(userInfo.account),
        ...convertToBoolean(userInfo.profile),
        setting: convertToBoolean(userSetting)
      }
      this.ctx.resp(result, RespMsg.OK, 200)
      return
    }
    this.ctx.resp({}, '用户未登录', 200)
  }

  @get('/profile')
  @summary('fetch user profile')
  @query({
    username: { type: String, required: true, example: 'string' }
  })
  public async getProfile() {
    const { username } = this.ctx.query
    const res = await this.service.User.find({ username })
    if (res?.profile) {
      this.ctx.resp({ ...convertToBoolean(res.profile), username }, RespMsg.OK, 200)
    } else {
      this.ctx.resp({}, '用户不存在', 200)
    }
  }

  @post('/save_profile')
  @summary('save user profile')
  @body({
    avatar: { type: String, required: false, example: 'string' },
    level: { type: String, required: false, example: 'string' },
    gender: { type: String, required: false, example: 'string' },
    nickname: { type: String, required: false, example: 'string' },
    selfIntroduction: { type: String, required: false, example: 'string' }
  })
  @middlewares([authorization()])
  public async saveProfile() {
    const { userId } = this.ctx
    const profile = this.ctx.request.body
    const result = await this.service.User.find({ userId })
    if (!result) {
      this.ctx.resp({}, '用户不存在', 200)
      return
    }
    const user = new this.service.User()
    await user.initById(userId)
    await user.updateProfile(profile)

    this.ctx.resp({}, RespMsg.OK, 200)
  }

  @post('/sign_in')
  @summary('user account sign in')
  @body({
    username: { type: String, required: true, example: 'string' },
    password: { type: String, required: true, example: 'string' }
  })
  public async signIn() {
    const { username, password } = this.ctx.request.body
    const user = new this.service.User()
    user.profile = {
      nickname: '匿名'
    }
    try {
      await user.signIn(username, password)
      if (this.ctx.session) {
        this.ctx.session.userId = user.profile.userId
        this.ctx.resp({}, RespMsg.OK, 200)
      }
    } catch (err) {
      this.ctx.resp({}, err, 200)
    }
  }

  @post('/register')
  @summary('user account register')
  @body({
    username: { type: String, required: true, example: 'string' },
    password: { type: String, required: true, example: 'string' },
    profile: { type: Object, required: false, example: { nickname: 'string' } }
  })
  public async register() {
    const { username, password, profile = {} } = this.ctx.request.body
    const user = new this.service.User()
    try {
      await user.register(username, password, {
        ...profile,
        level: 1,
        isOnline: 0
      })
      this.ctx.resp({}, RespMsg.OK, 200)
    } catch (err) {
      this.ctx.resp({}, err, 200)
    }
  }

  @post('/sign_out')
  @summary('user account sign out')
  @middlewares([authorization()])
  public async signOut() {
    const { userId } = this.ctx
    if (!userId) {
      this.ctx.resp({}, '用户未登录', 200)
      return
    }
    await this.service.User.signOut(userId)
    this.ctx.session = null
    this.ctx.resp({}, RespMsg.OK, 200)
  }
}
