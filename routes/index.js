var http = require('http'),
    each = require('each'),
    moment = require('moment');

moment.lang('pt');

/*
 * GET home page.
 */

exports.index = function(req, res){
  console.log(cities);
  res.render('index', { title: 'B5500', city_connections_depth: 10, city_qty: 0 });
};

exports.setup = function(req,res) {
  req.app.get('')
}

// 
exports.populate = function(req,res){
  
  var url = 'http://overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%3Bnode%5B%22IBGE%3AGEOCODIGO%22%5D%5B%22place%22%3D%22city%22%5D%28%2D28%2E130127737874016%2C%2D52%2E0751953125%2C%2D19%2E828725387681168%2C%2D37%2E5732421875%29%3Bout%20body%3B%3E%3Bout%20skel%3B';
    
  // calculate last request age
  last_cities_update = req.app.get('last_city_update') || 0
  
  // fires a request if isn't updating already
  if (!req.app.get('is_updating_cities') && 
        last_cities_update < ( Date.now() - req.app.get('least_cities_update_interval'))) {
    
    // set flag to avoid new requests
    req.app.set('is_updating_cities', true);

    // the request
    http.get(url, function(response) {
        console.log('request started.');
        var body = '';
        
        response.on('data', function(chunk) {
          body += chunk;
        });

        response.on('end', function() {
            var geojson = JSON.parse(body)
            var db_objects = [];
            
            
            req.models.city.initFromJSON(geojson.elements);
            // console.log(req.models.city.nearest({lon: -23, lat: -46}));
            
            req.app.set('is_updating_cities', false);
            req.app.set('last_city_update', Date.now());
        });

    })
    .on('error', function(e) {
          console.log("Got error: ", e);
    });    
  }
  
  res.render('populate', {
    is_updating: req.app.get('is_updating_cities'),
    last_update: moment(req.app.get('last_city_update')).fromNow(),
    update_allowed_in: moment((req.app.get('last_city_update') || Date.now() - 1000) + req.app.get('least_cities_update_interval')).fromNow()
  });
}
