var _ = require('underscore');
var path = require('path');
var cityConnectionCheckInterval = 3000 // in miliseconds

var development = {
  db: 'mongodb://localhost/monitor-dev',
  osrmUrl: 'http://localhost:5000'
  // osrmUrl: 'http://router.project-osrm.org'
}

var test = {
  db: 'mongodb://localhost/monitor-test',  
  osrmUrl: 'http://localhost:5000'
}

var production = {
}

var defaults = {
  cityConnectionCheckInterval: cityConnectionCheckInterval,
  root: path.normalize(__dirname + '/..')
}; 

module.exports = {
  development: _.extend(development, defaults),
  test: _.extend(test, defaults),
  production: _.extend(production, defaults)
}[process.env.NODE_ENV || 'development'];
