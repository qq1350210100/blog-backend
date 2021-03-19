import { formData, middlewaresAll, prefix, summary, tagsAll } from 'koa-swagger-decorator'
import { v4 as uuid } from 'uuid'
import { RespMsg } from '../utils/enums'
import { busboy } from '../middlewares'
import { post } from '../utils/requestMapping'
import Controller from '../utils/baseClass/Controller'

@prefix('/file')
@tagsAll(['File'])
@middlewaresAll([busboy()])
export default class FileController extends Controller {
  @post('/upload_image')
  @summary('upload image to static path')
  @formData({
    userId: { type: Number, required: true, example: 1 },
    image: { type: Object, required: true, example: {} }
  })
  public async uploadImage(): Promise<void> {
    const { fields, files, request } = this.ctx
    const { userId }: { userId: number } = fields

    const io = new this.service.IO()
    const dirname = request.origin
    // 文件命名规则: 用户ID_uuid.文件类型
    const imageName = `${userId || 'anonymous'}_${uuid()}`
    try {
      const urls = await io.saveImages(files, dirname, imageName)
      const result = files.length > 1 ? urls : urls[0]
      this.ctx.resp(result, RespMsg.OK, 200)
    } catch (error) {
      this.ctx.resp({}, error, 500)
    }
  }
}
