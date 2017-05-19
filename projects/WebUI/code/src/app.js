
var app = angular.module('Mobinite', ['ngRoute']);

   // configure our routes
   app.config(['$routeProvider', '$httpProvider', '$locationProvider', function($routeProvider, $httpProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
   $httpProvider.defaults.withCredentials = true;
       $routeProvider
            .when('/', {
                         templateUrl : 'home.html',
                         controller : 'HomeController'
                     })
            .when('/venues', {
                         templateUrl : 'component-composite-cards.html',
                         controller : 'VenueController'
                     })
            .when('/venueDetails', {
                         templateUrl : 'blog-full2.html',
                         controller : 'VenueDetailsController'
                     })
          .otherwise('/');
   }]);