/*!
 * Module dependencies.
 */

var async = require('async')

/**
 * Controllers
 */

var cities = require('../app/controllers/cities')

/**
 * Route middlewares
 */

// var articleAuth = [auth.requiresLogin, auth.article.hasAuthorization]

/**
 * Expose routes
 */

module.exports = function (app, passport) {

  // cities routes
  app.get('/cidades', cities.index)
  // app.get('/cidades/:id', cities.show)
  app.get('/cidades/atualizar', cities.update)
  
  // app.param('id', cities.load)

  // home route
  app.get('/', cities.index)


}
