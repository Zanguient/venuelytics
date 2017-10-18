'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('venuelytics', [
  'ngRoute',
  'venuelytics.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.when('/:portalName', {
    templateUrl: 'html/home.html',
    controller: 'homeController'
  })
  .when('/welcome', {
    templateUrl: 'html/welcome.html'
  });

  $routeProvider.otherwise({redirectTo: '/welcome'});
}]);
