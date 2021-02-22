const path = require('path')
const { unlink } = require('fs/promises')
const iterateImages = require('./iterateImages')

function cleanUselessImages() {
  return iterateImages(dirPath => async image => {
    const imagePath = path.join(dirPath, image)
    // 由于未登录时 userId 为 undefined，临时上传的图片以 undefined_ 开头
    if (!image.startsWith('undefined_')) return
    try {
      await unlink(imagePath)
    } catch (err) {
      console.error(err)
    }
  })
}

module.exports = cleanUselessImages
