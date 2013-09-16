
// var 
//     http = require('http'),
//     csv = require('csv'),
//     pg = require('pg'),
//     orm = require('orm'),
//     routes = require('./routes'),
//     path = require('path'),
//     kdtree = require('./lib/kdTree.js'),
//     cities = require('./models/city.js');

/**
 * Module dependencies.
 */
var
 express = require('express'),
 fs = require('fs');
 
// Load configurations
// if test env, load example file
var env = process.env.NODE_ENV || 'development'
 , config = require('./config/config')[env]
 , mongoose = require('mongoose');

// Bootstrap db connection
mongoose.connect(config.db)

// Bootstrap models
var models_path = __dirname + '/app/models'
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file)
})

var app = express()
// express settings
require('./config/express')(app, config)

// Bootstrap routes
require('./config/routes')(app)

// Start the app by listening on <port>
var port = process.env.PORT || 3000
app.listen(port)
console.log('Express app started on port '+port)

// expose app
exports = module.exports = app


// var app = express();
// 
// // all environments
// app.set('port', process.env.PORT || 3000);
// app.set('views', __dirname + '/views');
// app.set('view engine', 'jade');
// app.set('is_updating_cities', false);
// app.set('least_cities_update_interval', 5 * 60 * 1000); // 5 minutes
// app.use(express.favicon());
// app.use(express.logger('dev'));
// app.use(express.bodyParser());
// app.use(express.methodOverride());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(orm.express("postgres://postgres@localhost/b5500", {
//     define: function (db, models) {
//         models.city = require('./models/city.js');
//         console.log(models.city);
//     }
// }));
// app.use(app.router);  
// 
// 
// // development only
// if ('development' == app.get('env')) {
//   app.use(express.errorHandler());
// }
// 
// app.get('/', routes.index);
// app.get('/popular', routes.populate);
// // app.get('/cidades', city.index)
// 
// http.createServer(app).listen(app.get('port'), function(){
//   console.log('Express server listening on port ' + app.get('port'));
// });
