import { formData, middlewaresAll, prefix, summary, tagsAll } from 'koa-swagger-decorator'
import Controller from '../utils/baseClass/Controller'
import { post } from '../utils/requestMapping'
import { busboy } from '../middlewares'
import { RespMsg } from '../utils/enums'
import { v4 as uuid } from 'uuid'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import stream from 'stream'
import { File } from '../utils/type'

function getSuffixName(filename: string): string {
  const names = filename.split('.')
  return names[names.length - 1]
}

@prefix('/file')
@tagsAll(['File'])
@middlewaresAll([busboy()])
export default class FileController extends Controller {
  @post('/upload_image')
  @summary('upload image to static path')
  @formData({
    userId: { type: String, required: true, example: 'string' },
    image: { type: Object, required: true, example: {} }
  })
  async uploadImage() {
    const {
      fields: { userId },
      files,
      request
    } = this.ctx

    const pipeFile = async (file: File): Promise<string> => {
      // 文件命名规则: 用户ID_uuid.文件类型
      const filename: string = `${userId}_${uuid()}.${getSuffixName(file.filename)}`
      const savedPath: string = path.join(process.cwd(), 'static/images', filename)
      await promisify(stream.pipeline)(file, fs.createWriteStream(savedPath))
      const imgUrl: string = request.origin + '/' + path.join('images', filename)
      return imgUrl
    }
    const results: string[] = await Promise.all(files.map(pipeFile))
    this.ctx.resp(results, RespMsg.OK, 200)
  }
}
