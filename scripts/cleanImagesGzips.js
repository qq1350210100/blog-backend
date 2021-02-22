const path = require('path')
const { unlink } = require('fs/promises')
const iterateImages = require('./iterateImages')

function cleanImagesGzips() {
  return iterateImages(dirPath => async image => {
    const imagePath = path.join(dirPath, image)
    const [fileExtension] = image.split('.').reverse()
    if (fileExtension === 'gz') {
      try {
        await unlink(imagePath)
      } catch (err) {
        console.error(err)
      }
    }
  })
}

module.exports = cleanImagesGzips
