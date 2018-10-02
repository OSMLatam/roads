'use strict';

var express = require('express');
var fs = require('fs');
var moment = require('moment');


// Config
var env = process.env.NODE_ENV || 'development';
var config = require('../config/config');
var mongoose = require('mongoose');

// Bootstrap db connection
mongoose.connect(config.db)

// Bootstrap models
var models_path = __dirname + '/models'
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file)
})

var app = express()

// express settings
require('../config/express')(app, config)

// Bootstrap routes
require('../config/routes')(app)

// Expose moment.js as local
// moment.locale('pt')
app.locals.fromNow = function(date) {
  return moment(date).fromNow()
}

// Setup logger for connection checker

var logger = require('winston');

logger
  .add(logger.transports.File, { filename: 'connection_checker.log' })
  .remove(logger.transports.Console);

// catch unhandled global errors
process.on('unhandledRejection', function(reason, p) {
  console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason);
});

// Start the app by listening on <port>
var port = process.env.PORT || 3000
app.listen(port)
console.log('Express app started on port '+port)

// When mongoose is ready
var linkChecker = require('./lib/linkChecker');
mongoose.connection.on('connected', function(){
  // linkChecker.init();
});

// expose app
exports = module.exports = app
