

var linkChecker = require('../lib/linkChecker')

exports.refreshLinks = function(req, res) {
	linkChecker.refreshLinks()
	res.redirect('/');
}
