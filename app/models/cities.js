/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema
  , csv = require('csv')
  , _ = require('underscore')
  , request = require('request-json')
  , client = request.newClient(config.osrmUrl)  
  , async = require('async')
  , geolib = require('geolib')


/**
 * City Schema
 */

var CitySchema = new Schema({
  ibge_id: {type : String, default : '', trim : true},
  name: {type : String, default : '', trim : true, required: true},
  uf: {type: String},  
  isCapital: {type: Boolean, defaut: false},
  nearCities: [{
    id: { type: Schema.ObjectId, ref: 'City'},
    straightDistance: {type: Number, default: 0},
    routeForwardDistanceRatio: {type: Number, default: 0},
    routeBackwardDistanceRatio: {type: Number, default: 0}
  }],
  connectionStats: {
    percentualConnected: { type: Number, default: 0},    
    totalConnected: { type: Number, default: 0},
    totalChecked: { type: Number, default: 0}
  },
  loc: { type: {type: String}, coordinates: []},
  lastUpdate: {type: Date, default: '01/01/1980'},
  isUpdating: {type: Boolean, default: false}
})

/**
 * Geo index
 **/

CitySchema.index({ loc: '2dsphere' })

/**
 * Methods
 */

CitySchema.methods = {
  getLon: function(){
    return this.loc.coordinates[0]
  },
  getLat: function(){
    return this.loc.coordinates[1]    
  },
  findNearest: function(limit, callback){
    var City = mongoose.model('City')
    
    this.model('City').collection
      .geoNear(this.getLon(), this.getLat(), {spherical: true, num: limit + 1, distanceMultiplier: 6371}, function(err, cities){
        if (err) callback(err)

        // remove first element
        cities.results.shift()

        // City model should be reconstruted because of geoNear possible bug
        _.map(cities.results, function(result){
          result.dis = parseFloat(result.dis.toFixed(1));
          result.obj = new City(result.obj)
        })

        callback({},cities.results)
    })    
  },
  getStraightDistanceTo: function(city){
    return geolib.getDistance({latitude: this.getLon(), longitude: this.getLat()}, {latitude: city.getLon(), longitude: this.getLat()})
  },
  getViewInOSRMLink: function(city_to){
    return "http://map.project-osrm.org/?loc="+this.getLat()+","+this.getLon()
      +"&loc="+city_to.loc.coordinates[1]+","+city_to.loc.coordinates[0]
      +"&output=json"
      +"&z=0"
      +"&hl=pt"
  },
  routeTo: function(city_to, callback){
    var self = this
      , query_str = "viaroute?loc="+this.getLat()+","+this.getLon()
        +"&loc="+city_to.getLat()+","+city_to.getLon()
        +"&output=json"
        +"&z=0"        

    client.get(query_str, function(error, response, body) {
      if (error) callback(error)
      callback(null, body)
    })
  },
  checkConnectionTo: function(targetCity, straightDistance, doneCheckConnectionTo){
    var self = this

   // fetch foward route
    self.routeTo(targetCity, function(err, routeAB){
      if (err) doneCheckConnectionTo(err)

      // fetch backward route
      targetCity.routeTo(self, function(err, routeBA){
        if (err) doneCheckConnectionTo(err)
        
        // get route distances
        routeABDistance = routeAB.route_summary.total_distance / 1000
        routeBADistance = routeBA.route_summary.total_distance / 1000
        
                
        route = {
          id: targetCity,
          straightDistance: straightDistance,
          routeForwardDistanceRatio: routeABDistance > 0 ? (routeABDistance / straightDistance - 1) * 100 : 0,
          routeBackwardDistanceRatio: routeABDistance > 0 ? (routeBADistance / straightDistance - 1) * 100 : 0
        }
        self.nearCities.push(route)
        
        console.log(route)
        
        // update connection counter
        if ((routeABDistance > 0) && (route.routeForwardDistanceRatio <= 150)) {
          self.connectionStats.totalConnected += 1
        }
        if ((routeBADistance > 0) && (route.routeBackwardDistanceRatio <= 150)) {
          self.connectionStats.totalConnected += 1
        }
        self.connectionStats.totalChecked += 2
        doneCheckConnectionTo()
      })
    })
    
  },
  updateConnections: function(cities_qty){
    var self = this
    
    // flag as a updating city and save
    self.isUpdating = true

    // clear prior information
    self.nearCities = []
    self.connectionStats.totalConnected = 0
    self.connectionStats.totalChecked = 0    
    self.save(function(err){
      if (err) {
        console.log(err)
      } else {
        // find nearest cities
        self.findNearest(cities_qty, function(err,nearCities){
          // check routes
          async.eachSeries(nearCities, function(nearCity, doneCheckingAConnection){
              self.checkConnectionTo(nearCity.obj,nearCity.dis,doneCheckingAConnection)
            }, function(err){
              if (err) console.log(err)
              
              // update start and save
              self.connectionStats.percentualConnected = self.connectionStats.totalConnected / self.connectionStats.totalChecked || 0
              self.isUpdating = false
              self.lastUpdate = Date.now()
              self.save()
          })
        })
      }      
    })
  },
  fullName: function(){
    return this.name + ' (' + this.uf + ')'
  },
  getConnectivity: function(){
    return (this.connectionStats.percentualConnected || 0)
  },
  getColor: function(){
    var percentColors = [
        { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
        { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
        { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } } ];

    var getColorForPercentage = function(pct) {
        for (var i = 0; i < percentColors.length; i++) {
            if (pct <= percentColors[i].pct) {
                var lower = percentColors[i - 1];
                var upper = percentColors[i];
                var range = upper.pct - lower.pct;
                var rangePct = (pct - lower.pct) / range;
                var pctLower = 1 - rangePct;
                var pctUpper = rangePct;
                var color = {
                    r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
                    g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
                    b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
                };
                return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
                // or output as hex if preferred
            }
        }
    }
    return getColorForPercentage(this.percentualConnected())
  }
}

/**
 * Statics
 */

CitySchema.statics = {

  load: function (id, doneLoading) {
    this
      .findOne({ _id : id })
      .exec(doneLoading)      
  },
  list: function (options, cb) {
    var criteria = options.criteria || {}
    this.find(options.criteria)
      .sort(options.sortBy || {'lastUpdate': -1})
      .select(options.select)
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  },
  importFromCSV: function(filename, callback) {
    var self = this
      , City = mongoose.model('City')
    csv()
    .from.path(__dirname+filename, { columns: true, delimiter: ',', escape: '"' })
    .on('record', function(row, index){
      City.findOne({ibge_id: row.ibge_id}, function(err, city){
        if (err) doneSavingAFinancing(err)
        if (!city) {
          city = new City({ibge_id: row.ibge_id})
        }
        city.name = row.name
        city.uf = row.uf
        city.isCapital = row.capital        
        city.loc = {type: 'Point', coordinates: [new Number(row.lon),new Number(row.lat)]}
        city.save()
      })
    })
    .on('end', function(count){
      callback()
    })
    .on('error', function(err){
      callback(err)
    })
  }
}


mongoose.model('City', CitySchema)