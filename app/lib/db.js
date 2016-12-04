'use strict'
const ImageModel = require('../models/Image')
const config = require('../../config')
const helpers = require('../_helpers')
const _ = require('lodash')

function insert(image) {
  return new Promise((resolve, reject) => {
    var newImage = new ImageModel({
      pHash: JSON.stringify(image.hash),
      path: image.imagePath
    });
    const promise = newImage.save();
    promise.then((data) => {
      return resolve(image)
    })
    .catch(err => {
      return reject(err)
    })
  })
}

exports.bulkInsert = (images) => {
  let promises = []
  images.map(image => {
    promises.push(insert(image))
  })
  return Promise.all(promises)
    .then(data => {
      return data
    })
    .catch(err => {
      return err
    })
}

exports.getImages = () => {
  return ImageModel.find().exec()
    .then(images => {
      let imageData = []
      images.map(image => {
        if (image && image.pHash && image.path) {
          imageData.push({
            id: image._id,
            pHash: image.pHash,
            path: helpers.getImageURL(image.path, 200)
          })
        }
      })
      return imageData
    })
    .catch(err => {
      console.log('the error in db is ', err)
      return err
    })
}

function toArray(x) {
  return x.match(/[\-0-9]{4}/g).map(function(x) {
    return parseInt(x, 10)/100;
  });
};

function hammingDistance (str1, str2) {
  var x = toArray(str1)
  var y = toArray(str2)
  var sse = 0

  for (var i=0; i < x.length; i++) {
    sse += Math.pow(x[i] - y[i], 2);
  }

  return sse;
}

exports.getSimilarImages = (testImage) => {
  return ImageModel.find().exec()
    .then(images => {
      let imageData = []
      for (var i = 0; i < images.length; i++) {
        var tempImage = images[i]
        var hammingDistanceValue = hammingDistance(JSON.parse(tempImage.pHash).pHash, testImage.hash.pHash)
        tempImage.hamDistance = hammingDistanceValue
        tempImage.path = config.cdn.url + tempImage.path
        imageData.push(tempImage)
      }
      imageData = _.sortBy(imageData, ['hamDistance'], ['asc']);

      if (imageData.length < 3) {
        return imageData
      } else {
        return imageData.slice(0, 3)
      }
    })
    .catch(err => {
      console.log('the error in db is ', err)
      return err
    })
}
