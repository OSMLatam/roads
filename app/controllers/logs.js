
/**
 * Module dependencies.
 */

var 
	mongoose = require('mongoose'),
	Log = mongoose.model('Log');

/**
 * List
 */

exports.index = function(req,res){
	var page = (req.param('page') > 0 ? req.param('page') : 1) - 1
  var perPage = 50;
  var options = {
    perPage: perPage,
    page: page
  }


	Log.count().exec(function (err, count) {
		if (err) return res.render('500')
		if (count == 0) {
			res.redirect('/')
		} else {
			Log.list(options, function(err, logs) {
				if (err) return res.render('500')
					res.render('logs/index', {
					logs: logs,
					page: page + 1,
					pages: Math.ceil(count / perPage)
				})
			})
		}
	})
}
