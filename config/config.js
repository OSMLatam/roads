
var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')
  , cityConnectionCheckInterval = 3000 // in miliseconds

module.exports = {
  development: {
    db: 'mongodb://localhost/orc',
    root: rootPath,
    cityConnectionCheckInterval: cityConnectionCheckInterval,
    osrmUrl: 'http://router.project-osrm.org',
    app: {
      name: 'ORC - OpenStreetMap Route Checker'
    }
  },
  test: {
    db: 'mongodb://localhost/orc',
    root: rootPath,
    cityConnectionCheckInterval: cityConnectionCheckInterval,
    osrmUrl: 'http://localhost:5000',
    app: {
      name: 'ORC - OpenStreetMap Route Checker'
    }
  },
  production: {}
} 