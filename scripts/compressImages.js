const compressing = require('compressing')
const path = require('path')
const { readdir } = require('fs/promises')
const cleanGzips = require('./cleanGzips')

/**
 * 将所有静态文件图片 压缩为 gzip
 */
async function compressImages() {
  const dirPath = path.join(process.cwd(), 'static/images')
  const images = await readdir(dirPath)
  await Promise.all(
    images.map(async (image) => {
      const imagePath = path.join(dirPath, image)
      const [fileExtension] = image.split('.').reverse()
      if (fileExtension === 'gz') return

      try {
        await compressing.gzip.compressFile(imagePath, `${imagePath}.gz`)
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.error('文件不存在')
        } else {
          console.error(`压缩文件失败：${err}`)
        }
      }
    })
  )
}

cleanGzips().then(compressImages)
