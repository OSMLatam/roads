/*!
 * Module dependencies.
 */

var async = require('async')
  , cities = require('../app/controllers/cities')

/**
 * Controllers
 */

var home = require('../app/controllers/home')

/**
 * Expose routes
 */

module.exports = function (app) {

  // home
  app.get('/', home.index)

  // city routes
  app.get('/cidades', cities.index)
  app.get('/cidades/:cityId', cities.show)
  app.get('/cidades/popular', cities.populate)
  app.param('cityId', cities.load)  
}
