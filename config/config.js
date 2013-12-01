
var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')
  , cityConnectionCheckInterval = 1000 // in miliseconds

module.exports = {
  development: {
    db: 'mongodb://localhost/b5500',
    root: rootPath,
    cityConnectionCheckInterval: cityConnectionCheckInterval,
    osrmUrl: 'http://localhost:5000',
    app: {
      name: 'b5500 - Conexões entre as cidades brasileiras'
    }
  },
  test: {
    db: 'mongodb://localhost/b5500',
    root: rootPath,
    cityConnectionCheckInterval: cityConnectionCheckInterval,
    osrmUrl: 'http://localhost:5000',
    app: {
      name: 'b5500 - Conexões entre as cidades brasileiras'
    }
  },
  production: {}
} 