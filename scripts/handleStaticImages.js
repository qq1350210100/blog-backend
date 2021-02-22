const cleanImagesGzips = require('./cleanImagesGzips')
const cleanUselessImages = require('./cleanUselessImages')
const compressImagesToGzip = require('./compressImagesToGzip')

cleanImagesGzips().then(cleanUselessImages).then(compressImagesToGzip)
