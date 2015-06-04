
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
		.find({uf: {$in: ['AC','AP','AM','PA','RO','RR','TO','MT']}})
		.sort('name')
		.exec( function(err, cities){
			if (err) return done(err);
			async.eachSeries(cities, function(city, doneEach){
				console.log(city.name);
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
			osrm.getRoute(link.from, link.to, function(err, route){
				if (err) return done(err);


				if (route.status == 207) {
					link.status = 'broken'
				} else if (route.route_summary.total_distance / 1000 > (link.straightDistance * 2)) {
					link.status = 'tortuous'
				} else {
					link.status = 'connected'
				}

				link.updatedAt = new Date();
				link.save();
			})
		});
}

exports.run = function (app, done){
	setInterval(updateLink, 1000);
}
