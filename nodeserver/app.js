var express = require('express')
var detect = require('./color_detection.js');
var app     = express()
var path    = require('path');
var bodyParser = require('body-parser');
var formidable = require('formidable');


//app.use( bodyParser.json() );
//app.use( bodyParser.urlencoded() );
//app.use(express.static(path.join(__dirname, 'static')));


app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.post('/clothes', function (req, res) {
  var color = req.param('color');
})

app.post('/color_detect', function(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, field, files){})
  form.on('end', function(fields, files) {
    var fullname = this.openedFiles[0].path;
    console.log(fullname);
    detect.getColor(fullname, res);
  });  
})

var server = app.listen(3002, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

});

