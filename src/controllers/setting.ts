import { formData, prefix, query, summary, tagsAll } from 'koa-swagger-decorator'
import Controller from '../utils/baseClass/Controller'
import { get, post } from '../utils/requestMapping'
import { RespMsg } from '../utils/enums'

@prefix('/setting')
@tagsAll(['Setting'])
export default class SettingController extends Controller {
  @get('/fetch')
  @summary('fetch user setting')
  async fetchSetting() {
    this.ctx.resp({}, RespMsg.OK, 200)
  }

  @post('/update')
  @summary('upload user setting')
  @formData({
    userId: { type: String, required: true, example: 'string' },
    setting: { type: Object, required: true, example: {} }
  })
  async updateSetting() {
    this.ctx.resp({}, RespMsg.OK, 200)
  }
}
