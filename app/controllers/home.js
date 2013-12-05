
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , City = mongoose.model('City')


/**
 * List
 */

exports.index = function(req, res){
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1
  var perPage = 10
  var options = {
    select: 'ibge_id name uf connectionStats.totalConnected connectionStats.totalChecked connectionStats.percentualConnected',
    sortBy: {'connectionStats.percentualConnected': -1},
    perPage: perPage,
    page: page
  }
  
  City.list(options, function(err, cities) {
    if (err) return res.render('500')
    City.count().exec(function (err, count) {
      res.render('home/index', {
        cities: cities,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      })
    })
  })
}