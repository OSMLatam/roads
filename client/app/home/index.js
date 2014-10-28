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
	function($scope) {

	}
]);