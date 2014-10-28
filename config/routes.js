/*!
 * Module dependencies.
 */

var async = require('async');
var config = require('./config');

/**
 * Controllers
 */

var home = require('../app/controllers/home');
var tasks = require('../app/controllers/tasks');
var cities = require('../app/controllers/cities');

/**
 * Expose routes
 */

module.exports = function (app) {


	// // tasks
	// app.get('/tasks/refresh-links', tasks.refreshLinks)
	//
	// // application init
	// app.get('/iniciar', cities.init)
	//
	// // city routes
	// app.get('/cidades', cities.index)
	// app.get('/cidades/:cityId', cities.show)
	// app.get('/cidades/:cityId/atualizar', cities.update)
	// app.get('/autocompletar/:term', cities.autocomplete)
	// app.param('cityId', cities.load)

	app.get('/*', function(req, res) {
		res.sendFile(config.root + '/dist/views/index.html');
	});

}
