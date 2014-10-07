
/**
 * Module dependencies.
 */


var express = require('express');
var session = require('express-session');
var compression = require('compression');

var flash = require('connect-flash');
var helpers = require('view-helpers');
var pkg = require('../package.json');

var mongoStore = require('connect-mongo')(session);  

module.exports = function (app, config, passport) {

  app.set('showStackError', true)

    // Compression middleware (should be placed before express.static)
  app.use(compression({
    threshold: 512
  }));

  app.use(express.static(config.root + '/public'))

  // set views path, template engine and default layout
  app.set('views', config.root + '/app/views')
  app.set('view engine', 'jade')


  // expose package.json to views
  app.use(function (req, res, next) {
    res.locals.pkg = pkg
    next()
  })

  // connect flash for flash messages - should be declared after sessions
  app.use(flash())

  // should be declared after session and flash
  app.use(helpers(pkg.name))

  // assume "not found" in the error msgs
  // is a 404. this is somewhat silly, but
  // valid, you can do whatever you like, set
  // properties, use instanceof etc.
  app.use(function(err, req, res, next){
    // treat as 404
    if (err.message
      && (~err.message.indexOf('not found')
      || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next()
    }

    // log it
    // send emails if you want
    console.error(err.stack)

    // error page
    res.status(500).render('500', { error: err.stack })
  })

  // assume 404 since no middleware responded
  app.use(function(req, res, next){
    res.status(404).render('404', {
      url: req.originalUrl,
      error: 'Not found'
    })
  })

}
