
var config = require('../../config/config');
var request = require('superagent');

exports.getRoute = function(city1, city2, done) {

	var queryString =
			config.osrmUrl +
			"/route/v1/driving/" +
				city1.getLon()+","+city1.getLat() + ";" +
				city2.getLon()+","+city2.getLat();

	request
		.get(queryString)
		.end(function(err, res){
			done(err, res.body);
		})

}
