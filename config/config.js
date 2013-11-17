
var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')

module.exports = {
  development: {
    db: 'mongodb://localhost/b5500',
    root: rootPath,
    app: {
      name: 'b5500 - Conexões entre as cidades brasileiras'
    }
  },
  test: {
    db: 'mongodb://localhost/b5500',
    root: rootPath,
    app: {
      name: 'b5500 - Conexões entre as cidades brasileiras'
    }
  },
  production: {}
} 