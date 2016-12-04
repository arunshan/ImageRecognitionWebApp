var AWS = require('aws-sdk')
var fs = require('fs')
var config = require('../../config')
var _ = require('lodash');
var pHash = require('phash-imagemagick');

AWS.config.update({
  accessKeyId: config.amazon.ACCESS_KEY,
  secretAccessKey: config.amazon.SECRET_KEY
});
var s3 = new AWS.S3();

function uploadImageToS3(image) {
  return new Promise((resolve, reject) => {
    var keyName = image.filename + image.originalname.substring(image.originalname.indexOf('.'))
    var params = {Bucket: config.amazon.bucket,
      Key: keyName,
      Body: fs.createReadStream(image.path),
      ContentType: image.mimetype
    };
    s3.putObject(params, (err, data) => {
      if (err) return reject(err)
      // delete file from server
      computePHash(image.path)
        .then(hashData => {
          fs.unlink(image.path)
          // return the image object
          return resolve(_.assignIn(image, {
            imagePath: keyName,
            hash: hashData
          }))
        })
    });
  })
}

exports.uploadImages = (images) => {
  var promises = []
  images.map(image => promises.push(uploadImageToS3(image)))
  return Promise.all(promises)
    .then(data => {
      return data
    })
}

function computePHash(imagePath) {
  return new Promise((resolve, reject) => {
    pHash.get(imagePath, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    });
  })
}
