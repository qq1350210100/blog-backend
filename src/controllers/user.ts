import Controller from '../utils/baseClass/Controller'
import { prefix, summary, body, tagsAll } from 'koa-swagger-decorator'
import { get, post } from '../utils/requestMapping'
import { RespMsg } from '../utils/enums'

@prefix('/user')
@tagsAll(['User'])
export default class UserController extends Controller {
  @get('/sign_status')
  @summary('fetch user sign status')
  public async signStatus() {
    const { session } = this.ctx
    if (session?.userId) {
      const userId = session.userId
      const userInfo = await this.service.User.find({ userId })
      if (userInfo) {
        const result = {
          ...userInfo.profile,
          username: userInfo.account.username
        }
        this.ctx.resp(result, RespMsg.OK, 200)
        return
      }
    }
    this.ctx.resp({}, '未登陆', 200)
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
    profile: { type: Object, required: false, example: { nickname: 'tom' } }
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
  public async signOut() {
    if (this.ctx.session && this.ctx.session.userId) {
      await this.service.User.signOut(this.ctx.session.userId)
      this.ctx.session = null
      this.ctx.resp({}, RespMsg.OK, 200)
    } else {
      this.ctx.resp({}, '未登陆', 200)
    }
  }
}
