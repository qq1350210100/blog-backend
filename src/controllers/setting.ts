import { body, middlewares, prefix, summary, tagsAll } from 'koa-swagger-decorator'
import Controller from '../utils/baseClass/Controller'
import { get, put } from '../utils/requestMapping'
import { RespMsg } from '../utils/enums'
import { auth } from '../middlewares'

@prefix('/setting')
@tagsAll(['Setting'])
export default class SettingController extends Controller {
  @get('/fetch')
  @summary('fetch user setting')
  @middlewares([auth()])
  public async fetchSetting(): Promise<void> {
    const { userId } = this.ctx
    const setting = new this.service.Setting(userId)
    const result = await setting.get()
    this.ctx.resp(result, RespMsg.OK, 200)
  }

  @put('/update')
  @summary('upload user setting')
  @body({
    drawerDefaultOpened: { type: Boolean, required: false, example: false },
    lang: { type: String, required: false, example: 'string' },
    useMarkdownGuide: { type: Boolean, required: false, example: false },
    theme: { type: String, required: false, example: 'string' }
  })
  @middlewares([auth()])
  public async updateSetting(): Promise<void> {
    const {
      userId,
      request: {
        body: { drawerDefaultOpened, lang, useMarkdownGuide, theme }
      }
    } = this.ctx
    const setting = new this.service.Setting(userId)
    try {
      await setting.update({
        drawerDefaultOpened,
        lang,
        useMarkdownGuide,
        theme
      })
      this.ctx.resp({}, RespMsg.OK, 200)
    } catch (err) {
      this.ctx.resp({}, err.message, 500)
    }
  }
}
