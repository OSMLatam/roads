
/**
 * Module dependencies.
 */
var 
    moment = require('moment'),
    http = require('http'),
    csv = require('csv'),
    pg = require('pg'),
    express = require('express'),
    orm = require('orm'),
    routes = require('./routes'),
    path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('is_updating_cities', false);
app.set('least_cities_update_interval', 5 * 60 * 1000); // 5 minutes
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(orm.express("postgres://postgres@localhost/b5500", {
    define: function (db, models) {
        models.city = db.define("cities", {
                id        : Number,
                lon       : Number,
                lat       : Number,
                tags      : Object            
        },{
          methods: {
            update_from_geojson: function(geojson){
              console.log(geojson);
            }
          }
        });
    }
}));
app.use(app.router);  


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/popular', routes.populate);
// app.get('/cidades', city.index)

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
