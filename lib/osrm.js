
var config = require('../config/config');
var request = require('request');

exports.getRoute = function(city1, city2, done) {
		// var query_str = "viaroute?loc="+city1.getLat()+","+city1.getLon()
		// 	+"&loc="+city2.getLat()+","+city2.getLon()
		// 	+"&output=json"
		// 	+"&z=0"        
	console.log(city1);
	console.log(city2);

	var routeReq = {
		method: 'GET',
		url: config.osrmUrl + '/viaroute',
		loc: city1.getLat()+","+city1.getLon(),
		loc: city2.getLat()+","+city2.getLon(),
		output: 'json',
		z: 0
	}

	request(routeReq, function(err, res, body) {
		if (!err && res.statusCode == 200) {
			console.log(body);
			callback(null, body)
		} else {
			logger.error('Houve um erro ao buscar a rota entre ' + city1.fullName() + ' e ' + city2.fullName())
			callback(error)
		}
	})
}