var _ = require('underscore');
var path = require('path');
var cityConnectionCheckInterval = 3000 // in miliseconds

var development = {
  db: 'mongodb://db:27017/roads',
  osrmUrl: 'http://localhost:5000'
}

var test = {
  db: 'mongodb://db:27017/roads',
  osrmUrl: 'http://localhost:5000'
}

var production = {
  db: process.env.MONGO_URI
}

var defaults = {
  cityConnectionCheckInterval: cityConnectionCheckInterval,
  root: path.normalize(__dirname + '/..'),
  osrmUrl: 'http://router.project-osrm.org'
};

module.exports = {
  development: _.extend(development, defaults),
  test: _.extend(test, defaults),
  production: _.extend(production, defaults)
}[process.env.NODE_ENV || 'development'];
