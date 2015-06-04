
var config = require('../config/config');
var request = require('superagent');

exports.getRoute = function(city1, city2, done) {

	var queryString = config.osrmUrl + "/viaroute?loc="+city1.getLat()+","+city1.getLon()
		+"&loc="+city2.getLat()+","+city2.getLon()
		+"&output=json"
		+"&z=0"

	request
		.get(queryString)
		.end(function(err, res){
			done(err, res.body);
		})

}
