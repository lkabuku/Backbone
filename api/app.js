var express = require('express');
var app = express();

app.listen(3002, function () {
  console.log('API listening on port 3002!');
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});