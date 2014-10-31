/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var config = require('../../config/config');
var Schema = mongoose.Schema;
var csv = require('csv');
var _ = require('underscore');
var request = require('request-json');
var client = request.newClient(config.osrmUrl);
var async = require('async');
var geolib = require('geolib');
var logger = require('winston');


// setup logger
// logger
//   .add(logger.transports.File, { filename: 'connection_checker.log' })
//   .remove(logger.transports.Console);

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
	stats: {
		percentualConnected: { type: Number, default: 0},
		totalConnected: { type: Number, default: 0},
		totalTortuous: { type: Number, default: 0},
		totalInexistent: { type: Number, default: 0},
		totalChecked: { type: Number, default: 0}
	},
	loc: { type: {type: String}, coordinates: []},
	updatedAt: {type: Date},
	shouldUpdate: {type: Boolean, default: true},
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
	needsUpdate: function(){
		this.shouldUpdate = true
		this.save()
	},
	getLon: function(){
		return this.loc.coordinates[0]
	},
	getLat: function(){
		return this.loc.coordinates[1]
	},
	getPercentualConnected: function(){
		return (this.stats.totalConnected / this.stats.totalChecked * 100 | 0)
	},
	getPercentualTortuous: function(){
		return this.stats.totalTortuous / this.stats.totalChecked * 100
	},
	getPercentualInexistent: function(){
		return this.stats.totalInexistent / this.stats.totalChecked * 100
	},
	getStraightDistanceTo: function(city){
		return geolib.getDistance({
			latitude: this.getLon(),
			longitude: this.getLat()
		}, {
			latitude:
			city.getLon(),
			longitude: this.getLat()
		})
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
			if (!error && response.statusCode == 200) {
				callback(null, body)
			} else {
				logger.error('Houve um erro ao buscar a rota entre ' + self.fullName() + ' e ' + city_to.fullName())
				callback(error)
			}
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
				if (typeof(routeAB.route_summary)=='undefined')  {
					routeABDistance = routeAB.route_summary.total_distance / 1000
				} else {
					routeABDistance = 0 // route doesn't exist
				}

				if (typeof(routeBA.route_summary)=='undefined') {
					routeBADistance = routeBA.route_summary.total_distance / 1000
				} else {
					routeBADistance = 0 // route doesn't exist
				}

				route = {
					id: targetCity,
					straightDistance: straightDistance,
					routeForwardDistanceRatio: routeABDistance > 0 ? (routeABDistance / straightDistance - 1) * 100 : 0,
					routeBackwardDistanceRatio: routeABDistance > 0 ? (routeBADistance / straightDistance - 1) * 100 : 0
				}
				self.nearCities.push(route)

				// update connection counter
				if (route.routeForwardDistanceRatio >= 50) {
					self.stats.totalTortuous += 1
				} else if (route.routeForwardDistanceRatio > 0 && route.routeForwardDistanceRatio < 50)
					self.stats.totalConnected += 1
				else {
					self.stats.totalInexistent += 1
				}

				// update connection counter
				if (route.routeBackwardDistanceRatio >= 50) {
					self.stats.totalTortuous += 1
				} else if (route.routeBackwardDistanceRatio > 0 && route.routeBackwardDistanceRatio < 50) {
					self.stats.totalConnected += 1
				} else {
					self.stats.totalInexistent += 1
				}

				self.stats.totalChecked += 2

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
		self.stats.totalConnected = 0
		self.stats.totalTortuous = 0
		self.stats.totalInexistent = 0
		self.stats.totalChecked = 0
		self.save(function(err){
			if (err) {
				logger.error(err)
			} else {
				logger.info('Started to check connections of ' + self.fullName())
				// find nearest cities
				self.findNearest(cities_qty, function(err,nearCities){
					if (err) logger.error(err)
					// check routes
					async.eachSeries(nearCities, function(nearCity, doneCheckingAConnection){
							self.checkConnectionTo(nearCity.obj,nearCity.dis,doneCheckingAConnection)
						}, function(err){
							if (err) logger.error(err)

							// update start and save
							self.stats.percentualConnected = self.stats.totalConnected / self.stats.totalChecked || 0
							self.isUpdating = false
							self.shouldUpdate = false
							self.updatedAt = Date.now()
							self.save(function(err){
								if (err)
									logger.error(err)
								else
									logger.info('A atualização de ' + self.fullName() + ' terminou.');
							})
					})
				})
			}
		})
	},
	fullName: function(){
		return this.name + ' (' + this.uf + ')'
	},
	getConnectivity: function(){
		return (this.stats.percentualConnected || 0)
	},
	getColor: function(){
		var percentColors = [
				{ pct: 0, color: { r: 0xff, g: 0x00, b: 0 } },
				{ pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
				{ pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } } ];

		var getColorForPercentage = function(pct) {
				for (var i = 0; i < percentColors.length; i++) {
					if (pct == 0) {
							return 'rgb(255, 0, 0)'
					} else if (pct <= percentColors[i].pct) {
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
		return getColorForPercentage(this.getPercentualConnected()/100)
	},
	findNearest: function(limit, callback){
		var City = mongoose.model('City')

		this.model('City').collection
			.geoNear(this.getLon(), this.getLat(), {spherical: true, num: limit + 1, distanceMultiplier: 6371}, function(err, cities){
				if (err) return callback(err)

				// remove first element
				cities.results.shift()

				var nearest = [];
				_.each(cities.results, function(result){
					nearest.push({
						distance: parseFloat(result.dis.toFixed(1)),
						id: result.obj._id
					});
				})

				callback(null, nearest)
		})
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
			.sort(options.sortBy || {'name': 1})
			.select('name uf')
			.limit(options.perPage)
			.skip(options.perPage * options.page)
			.exec(cb)
	},
	importFromCSV: function(filename, callback) {
		var self = this;
		var City = mongoose.model('City');

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
		});

		function updateCity(id, properties, done) {

		}


	}
}


mongoose.model('City', CitySchema)
