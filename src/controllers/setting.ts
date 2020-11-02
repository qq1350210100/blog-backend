import { body, middlewares, prefix, query, summary, tagsAll } from 'koa-swagger-decorator'
import Controller from '../utils/baseClass/Controller'
import { get, post } from '../utils/requestMapping'
import { RespMsg } from '../utils/enums'
import authorization from '../middlewares/auth'

@prefix('/setting')
@tagsAll(['Setting'])
export default class SettingController extends Controller {
  @get('/fetch')
  @summary('fetch user setting')
  @middlewares([authorization()])
  public async fetchSetting() {
    const { userId } = this.ctx
    const setting = new this.service.Setting(userId)
    const result = await setting.get()
    this.ctx.resp(result, RespMsg.OK, 200)
  }

  @post('/update')
  @summary('upload user setting')
  @body({
    drawerDefaultOpened: { type: Boolean, required: true, example: false },
    menuDefaultExpansion: { type: Boolean, required: true, example: false },
    lang: { type: String, required: true, example: 'string' },
    useMarkdownGuide: { type: Boolean, required: true, example: false },
    theme: { type: String, required: true, example: 'string' }
  })
  @middlewares([authorization()])
  public async updateSetting() {
    const {
      userId,
      request: {
        body: { drawerDefaultOpened, menuDefaultExpansion, lang, useMarkdownGuide, theme }
      }
    } = this.ctx
    const setting = new this.service.Setting(userId)
    try {
      await setting.update({
        drawerDefaultOpened,
        menuDefaultExpansion,
        lang,
        useMarkdownGuide,
        theme
      })
      this.ctx.resp({}, RespMsg.OK, 200)
    } catch (err) {
      this.ctx.resp({}, err, 500)
    }
  }
}
