'use strict';

require('./helpers');

/*
 * Modules
 */

// require('./home');

angular.module('ta', [
])

// .config([
// 	'$stateProvider',
// 	'$urlRouterProvider',
// 	'$locationProvider',
// 	'$httpProvider',
// 	function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

// 		$locationProvider.html5Mode({
// 			enabled: true,
// 			requireBase: false
// 		});
// 		$locationProvider.hashPrefix('!');

// 		$stateProvider
// 			.state('about', {
// 				url: '/sobre/',
// 				templateUrl: '/views/pages/about.html'
// 			})

// 		/*
// 		 * Trailing slash rule
// 		 */
// 		$urlRouterProvider.rule(function($injector, $location) {
// 			var path = $location.path(),
// 				search = $location.search(),
// 				params;

// 			// check to see if the path already ends in '/'
// 			if (path[path.length - 1] === '/') {
// 				return;
// 			}

// 			// If there was no search string / query params, return with a `/`
// 			if (Object.keys(search).length === 0) {
// 				return path + '/';
// 			}

// 			// Otherwise build the search string and return a `/?` prefix
// 			params = [];
// 			angular.forEach(search, function(v, k){
// 				params.push(k + '=' + v);
// 			});
			
// 			return path + '/?' + params.join('&');
// 		});

// 	}
// ])

// .controller('NavCtrl', [
// 	'$scope',
// 	'$sce',
// 	function($scope, $sce) {

// 		$scope.nav = [
// 			{
// 				title: 'Página inicial',
// 				href: '/',
// 				icon: $sce.trustAsHtml('&#8962;')
// 			}
// 		];

// 		$scope.updateHover = function(str) {
// 			$scope.currentHover = str;
// 		};

// 		$scope.currentHover = '';
// 	}
// ])

$(document).ready(function() {
	console.log('eita');
	// angular.bootstrap(document, ['ta']);
});