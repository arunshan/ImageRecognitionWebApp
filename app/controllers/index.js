'use strict'

var util = require('util');
var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var fs = require('fs');

var _ = require('lodash')
var helpers = require('../_helpers')
var lib = require('../lib')
var db = require('../lib/db')

exports.renderIndex = (req, res, next) => {
  res.render("index", {data: {}})
}

exports.renderTrain = (req, res, next) => {
  return db.getImages()
    .then(images => {
      res.render('train', {
        data: images
      })
    })
    .catch(err => {
      next(err)
    })
}

exports.uploadImages = (req, res, next) => {
  return lib.uploadImages(req.files)
    .then(data => {
      return db.bulkInsert(data)
    })
    .then(dbData => {
      if (req.body.uploaderType === 'true') {
        res.redirect('/train')
      } else {
        if (dbData && dbData.length === 1) {
          _.assignIn(dbData[0], {
            path: helpers.getImageURL(dbData[0].imagePath, 400)
          })
          res.render('index', {data: dbData[0]})
        }
      }
    })
    .catch(err => {
      next(err)
    })
}

exports.detectImage = (req, res, next) => {
  const image = JSON.parse(req.body.image)
  return db.getSimilarImages(image)
    .then(data => {
      res.json({
        results: {
          images: data
        }
      })
    })
}
