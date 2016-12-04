// esversion: 6
var express = require('express');
var router = express.Router();

/* GET home page. */
const api = require('../app/controllers')
router.get('/', (req, res, next) => api.renderIndex(req, res, next))
router.get('/train', (req, res, next) => api.renderTrain(req, res, next))
router.get('/upload', (req, res, next) => res.redirect('/train'))
router.post('/upload', (req, res, next) => api.uploadImages(req, res, next))
router.post('/detect', (req, res, next) => api.detectImage(req, res, next))

module.exports = router;
