/*!
 * Module dependencies.
 */

var 
	async = require('async'),
	cities = require('../app/controllers/cities'),
	logs = require('../app/controllers/logs')

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
  app.get('/instalacao', cities.install)
  app.get('/cidades/:cityId', cities.show)
  app.get('/cidades/:cityId/logs', cities.logs);  
  app.get('/cidades/:cityId/atualizar', cities.update)  
  app.param('cityId', cities.load)  

	// logs route
  app.get('/logs', logs.index);  

}
