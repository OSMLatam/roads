
var async = require('async');
var mongoose = require('mongoose');
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
				if (!link) var link = new Link({from: city, to: result.id});
				link.straightDistance = result.distance;
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
		.populate('from')
		.populate('to')
		.sort({updatedAt: 1})
		.exec(function(err, link){
			if (err) return done(err);

			if (link) {
				osrm.getRoute(link.from, link.to, function(err, result){

					var route;
					if (result.routes) {
						route = result.routes[0].legs[0];
					}

					if (err && (result.code == 'NoRoute')) {
						link.status = 'broken';
					} else if (route.distance / 1000 > (link.straightDistance * 2)) {
						link.status = 'tortuous';
					} else {
						link.status = 'connected';
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
	setInterval(updateLink, 3000);
}