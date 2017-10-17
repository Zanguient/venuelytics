'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('venuelytics', [
  'ngRoute',
  'venuelytics.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.when('/home', {
    templateUrl: 'html/home.html',
    controller: 'homeController'
  });

  $routeProvider.otherwise({redirectTo: '/home'});
}]);
