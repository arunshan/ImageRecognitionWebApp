const config = require('../../config')

exports.getImageURL = (path, width) => {
  if (!path) return null
  return config.cdn.url + path + '?w=' + width
}
