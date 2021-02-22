const compressing = require('compressing')
const path = require('path')
const iterateImages = require('./iterateImages')

/**
 * 将所有静态文件图片 压缩为 gzip
 */
function compressImagesToGzip() {
  return iterateImages(dirPath => async image => {
    const imagePath = path.join(dirPath, image)
    const [fileExtension] = image.split('.').reverse()
    if (fileExtension === 'gz') return

    try {
      await compressing.gzip.compressFile(imagePath, `${imagePath}.gz`)
    } catch (err) {
      console.error(err)
    }
  })
}

module.exports = compressImagesToGzip
