
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
  City.findOne({ibge_id: id}, function (err, city) {
    if (err) return next(err)
    if (!city) return next(new Error('not found'))
    req.city = city
    next()
  })
}

/**
 * List
 */

exports.index = function(req, res){
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1
  var perPage = 30
  var options = {
    perPage: perPage,
    page: page
  }

  City.list(options, function(err, cities) {
    if (err) return res.render('500')
    City.count().exec(function (err, count) {
      res.render('cities/index', {
        title: 'Cidades',
        citys: cities,
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
    title: req.city.name,
    city: req.city
  })
}

/**
 * Populate cities
 */

exports.populate = function(req, res){
  City.importFromCSV('/../../data/cities.csv',function(err) {
    if (err) return res.render('500')
    res.render('home/index')
  })  
}