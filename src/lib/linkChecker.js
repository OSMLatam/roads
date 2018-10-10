const config = require('../../config');
var async = require('async');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var City = mongoose.model('City');
var Link = mongoose.model('Link');
var osrm = require('./osrm');

var nearCitiesCount = 5;

/*
 * Link generation
 */

function clearLinks(done) {
	Link.remove({}, done);
}

function generateAllLinks(app, done) {
	City
		.find({uf: {$in: ['ES']}})
		.sort('name')
		.exec( function(err, cities){
			if (err) return done(err);
			async.eachSeries(cities, function(city, doneEach){
				generateCityLinks(city, doneEach);
			}, done);
		});
}

function generateCityLinks(city, done) {
	city.findNearest(nearCitiesCount, function(err, nearest){
		if (err) return done(err);
		async.eachSeries(nearest, function(result, doneEach){
			Link.findBetween(city, result.id, function(err, link){
				if (err) return doneEach(err);
				if (!link) var link = new Link({A: city, B: result.id});
				link.distance = result.distance;
				link.save(doneEach);
			});
		}, done)
	})
}

exports.refreshLinks = function (app, done){
	clearLinks(generateAllLinks);
}

/*
 * Link check
 */

function updateLink(done) {
	Link
		.findOne({})
		.populate('A')
		.populate('B')
		.sort({updatedAt: 1})
		.exec(function(err, link){
			if (err) return done(err);

			

			if (link) {
				osrm.getRoute(link.A, link.B, function(err, result){

					var route;
					if (result.routes) {
						route = result.routes[0].legs[0];
					} else {
						return;
					}

					console.log({result});

					if (err && (result.code == 'NoRoute')) {
						link.status = 'broken';
					} else {
						console.log(route);
						link.tortuosityAB = Math.round(((route.distance / 1000 ) / link.distance - 1) * 1000) / 10;
					}

					link.updatedAt = new Date();
					link.save();
				})
			} else {
				console.log('No links to check, database is empty?');
			}
		});
}

exports.init = function (app, done){

	// Check if db is populated
	City.count({}, function(err, count){
		console.log('Watching ' + count + ' cities');
		if (!err && !count) {
			City.importFromCSV("/../../data/cities.csv", function(err){
				if (!err) generateAllLinks();
				else console.log('error importing cities ' + err.message);
			});
		}
	})

	// start update link job
	setInterval(updateLink, config.osrmInterval);
}
