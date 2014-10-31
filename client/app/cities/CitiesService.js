'use strict';

module.exports = [
	'$http',
	'$q',
	'$window',
	function($http, $q, $window) {

		return {
			search: function(term){
				var cities = {};
				var deferred = $q.defer();
				$http.get('/api/v1/cities/search/' + term).success(function(data) {
					event = _.extend(event, data);
					event._loaded = true;
					deferred.resolve(event);
				});
			}
		}
	}
];
