var _ = require('underscore');
var path = require('path');

var defaults = {
  osrmInterval: 10000,
  root: path.normalize(__dirname + '/..'),
  osrmUrl: 'http://router.project-osrm.org'
};

var development = {
  db: 'mongodb://localhost:27017/roads',
  osrmUrl: 'http://localhost:5000'
}

var test = {
  db: 'mongodb://db:27017/roads',
  osrmUrl: 'http://localhost:5000'
}

var production = {
  db: process.env.MONGO_URI
}

module.exports = {
  development: _.extend(development, defaults),
  test: _.extend(test, defaults),
  production: _.extend(production, defaults)
}[process.env.NODE_ENV || 'development'];
