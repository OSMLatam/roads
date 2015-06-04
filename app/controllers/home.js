
/**
 * Module dependencies.
 */

var moment = require('moment');
var mongoose = require('mongoose');
var City = mongoose.model('City');
var Link = mongoose.model('Link');


/**
 * List
 */

exports.index = function(req, res){
  Link
    .find({status: {$ne: 'connected'}})
    .populate('from to')
    .sort({updatedAt: -1})
    .limit(50)
    .exec(function(err, links){
    	if (err) return res.render('500');
      res.render('home/index', {
        moment: moment,
        links: links
      })
    });
}
