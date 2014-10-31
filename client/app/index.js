'use strict';

require('./helpers');

/*
 * Modules
 */

require('./home');
require('./cities');

angular.module('ta', [
	'ui.router',
	'ui.bootstrap',
	'ta.home',
	'ta.cities'
])

.config([
	'$stateProvider',
	'$urlRouterProvider',
	'$locationProvider',
	'$httpProvider',
	function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});
		$locationProvider.hashPrefix('!');

		/*
		 * Trailing slash rule
		 */
		$urlRouterProvider.rule(function($injector, $location) {
			var path = $location.path(),
				search = $location.search(),
				params;

			// check to see if the path already ends in '/'
			if (path[path.length - 1] === '/') {
				return;
			}

			// If there was no search string / query params, return with a `/`
			if (Object.keys(search).length === 0) {
				return path + '/';
			}

			// Otherwise build the search string and return a `/?` prefix
			params = [];
			angular.forEach(search, function(v, k){
				params.push(k + '=' + v);
			});

			return path + '/?' + params.join('&');
		});

	}
])

$(document).ready(function() {
	window.ta = {};
	// $.get('/api/v1/cities', function(data) {
		// window.ta.cities = data;
		angular.bootstrap(document, ['ta']);
	// });
});
