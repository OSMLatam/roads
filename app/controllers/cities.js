
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , City = mongoose.model('City')
  , _ = require('underscore')

/**
 * Load
 */

exports.load = function(req, res, next, id){
  City.findOne({ibge_id: id}).populate('nearCities.id').exec(function (err, city) {
    if (err) return next(err)
    if (!city) return next(new Error('not found'))
    // fires update if nearests cities not present
    if (city.nearCities.length == 0)
      city.updateConnections(5)
    req.city = city
    next()
  })
}

/**
 * List
 */

exports.index = function(req, res){
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1
  var perPage = 1000
  var options = {
    select: 'ibge_id name uf connectionStats.totalConnected connectionStats.totalChecked connectionStats.percentualConnected',
    sortBy: {'connectionStats.percentualConnected': -1},
    perPage: perPage,
    page: page
  }
  
  City.list(options, function(err, cities) {
    if (err) return res.render('500')
    City.count().exec(function (err, count) {
      res.render('cities/index', {
        cities: cities,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      })
    })
  })  
}

/**
 * Show
 */

exports.show = function(req, res){
  res.render('cities/show', {
    city: req.city
  })        
}

/**
 * Populate cities
 */

exports.populate = function(req, res){

  City.importFromCSV('/../../data/cities.csv',function(err) {
    if (err) return res.render('500')
    res.redirect('/')
  })  
}

/**
 * Update city
 */

exports.update = function(req, res){
  req.city.needsUpdate()
  res.redirect('/cidades/'+req.city.ibge_id)
}