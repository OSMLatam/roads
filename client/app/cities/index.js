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
