
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var City = mongoose.model('City');


/**
 * List
 */

exports.index = function(req, res){
  City.find({isCapital: true}).sort({name: 1}).exec(function (err, cities) {
  	if (err) return res.render('500');
    res.render('home/index', {
      cities: cities
    })
  })
}
