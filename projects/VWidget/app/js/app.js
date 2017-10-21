'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('venuelytics', ['ngRoute', 'templates', 'ngIframeResizer'])
.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  
  $routeProvider
  .when('/:portalName', {
    templateUrl: 'html/home.html',
    controller: 'homeController'
  })
  .when('/', {
    templateUrl: 'html/welcome.html'
  })
  .otherwise('/');

  $locationProvider.html5Mode({
        enabled: true,
        requireBase: true,
        rewriteLinks: true
    });
}]);

angular.module('templates', []);
