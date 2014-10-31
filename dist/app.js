(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

angular.module('ta.cities', [
])
.config([
  '$stateProvider',
  function($stateProvider) {

    $stateProvider
      .state('cities', {
        url: '/cities',
        controller: 'CitiesController',
        templateUrl: '/views/pages/home.html'
      });

  }
])
.controller('CitiesController', [
  '$scope',
  '$window',
  function($scope, $window) {

    $scope.selected = undefined;
    $scope.cities = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
  }
]);

},{}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
'use strict';

angular.module('ta.home', [
])
.config([
	'$stateProvider',
	function($stateProvider) {

		$stateProvider
			.state('home', {
				url: '/',
				controller: 'HomeController',
				templateUrl: '/views/pages/home.html'
			});

	}
])
.controller('HomeController', [
	'$scope',
	'$window',
	function($scope, $window) {

		$scope.items = $window.ta.cities;

		$scope.alerts = [
	    { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
	    { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
	  ];

	  $scope.addAlert = function() {
	    $scope.alerts.push({msg: 'Another alert!'});
	  };

	  $scope.closeAlert = function(index) {
	    $scope.alerts.splice(index, 1);
	  };

	}
]);

},{}],4:[function(require,module,exports){
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

},{"./cities":1,"./helpers":2,"./home":3}]},{},[4]);
