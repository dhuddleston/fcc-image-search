var express = require('express');
var app = express();
var path = require('path');

var routes = require('./routes/index');
var api = require('./controllers/api');

// Allows the usage of process.env to get variables from the .env file
 require('dotenv').config({
   silent: true
 });

// var mongo = require('mongodb').MongoClient
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// To render the homepage
app.use('/', routes);

// To use the API
api(app, mongoose);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
});

module.exports = app;