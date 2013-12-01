
/*!
 * b5500
 * Copyright(c) 2013 Vitor George <vitor.george@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var express = require('express')
  , fs = require('fs')
  , moment = require('moment')

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Load configurations
// if test env, load example file
var env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]
  , mongoose = require('mongoose')

// Bootstrap db connection
mongoose.connect(config.db)

// Bootstrap models
var models_path = __dirname + '/app/models'
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file)
})

var app = express()
// express settings
require('./config/express')(app, config)

// Bootstrap routes
require('./config/routes')(app)

// Start the app by listening on <port>
var port = process.env.PORT || 3000
app.listen(port)
console.log('Express app started on port '+port)

// Start updating routes
// var runCityCheck = function() {
//   // find a city needing a update
//   mongoose.model('City')
//     .findOne({isUpdating: false})
//     .sort({lastUpdate: 1})
//     .exec(function(err, city){
//       if (!err) city.updateConnections()
//   })
// }
// setInterval(runCityCheck, 100);  

// expose app
exports = module.exports = app