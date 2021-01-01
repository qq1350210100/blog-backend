const path = require('path')
const { readdir, unlink } = require('fs/promises')

/**
 * 将所有静态文件图片 压缩为 gzip
 */
async function cleanGzips() {
  const dirPath = path.join(process.cwd(), 'static/images')
  const images = await readdir(dirPath)
  await Promise.all(
    images.map(async (image) => {
      const imagePath = path.join(dirPath, image)
      const [fileExtension] = image.split('.').reverse()
      if (fileExtension === 'gz') {
        try {
          await unlink(imagePath)
        } catch (err) {
          if (err.code === 'ENOENT') {
            console.error('文件不存在')
          } else {
            console.error(`删除文件失败：${err}`)
          }
        }
      }
    })
  )
}

cleanGzips()

module.exports = cleanGzips
