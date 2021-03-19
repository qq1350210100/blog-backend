import { File } from '../utils/type'
import Service from '../utils/baseClass/Service'
import { createWriteStream } from 'fs'
import { join } from 'path'
import { promisify } from 'util'
import { pipeline } from 'stream'
import { gzip } from 'compressing'

export default class IO extends Service {
  private getSuffixName(filename: string): string {
    const names = filename.split('.')
    return names[names.length - 1]
  }

  public saveImages(files: File[], dirname: string, name: string): Promise<string[]> {
    const pipeFile = async (file: File): Promise<string> => {
      const filename = `${name}.${this.getSuffixName(file.filename)}`
      const savedPath = join(process.cwd(), 'static/images', filename)
      try {
        await promisify(pipeline)(file, createWriteStream(savedPath))
        await gzip.compressFile(savedPath, `${savedPath}.gz`)
      } catch (error) {
        throw error
      }
      const imgUrl: string = `${dirname}/${join('images', filename)}`
      return imgUrl
    }

    return Promise.all(files.map(pipeFile))
  }
}
