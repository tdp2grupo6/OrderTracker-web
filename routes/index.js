'use strict';
var environment = require('./environment');
var express = require('express','angular','jquery-file-upload-middleware');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/imagen', function(req, res) {
  res.render('subirImagen', {
  	title:'Subir Imagen',
  	dir: environment.getRutaBackend(),
  	uploadUrl: environment.getRutaBackend() + 'OrderTracker/imagen/subir',
  	imgTest: environment.getRutaBackend() + 'OrderTracker/imagen/miniatura/1' });
});

module.exports = router;

