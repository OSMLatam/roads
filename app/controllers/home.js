
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , City = mongoose.model('City')


/**
 * List
 */

exports.index = function(req, res){
  City.count().exec(function (err, count) {
    res.render('home/index', {
      citiesCount: count
    })
  })
}
