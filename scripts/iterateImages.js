const path = require('path')
const { readdir } = require('fs/promises')

async function iterateImages(callback) {
  const dirPath = path.join(process.cwd(), 'static/images')
  const images = await readdir(dirPath)
  await Promise.all(images.map(callback(dirPath)))
}

module.exports = iterateImages
