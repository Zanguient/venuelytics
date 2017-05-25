var app = angular.module('Mobinite', ['ngRoute']);


// configure our routes
app.config(['$routeProvider', '$httpProvider', '$locationProvider', '$sceDelegateProvider', function($routeProvider, $httpProvider, $locationProvider, $sceDelegateProvider) {
    $locationProvider.hashPrefix('');
    $httpProvider.defaults.withCredentials = true;

    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        "self",
        // Allow loading from Google maps
        "http://dev.api.venuelytics.com/WebServices**"
    ]);

    $routeProvider
        .when('/home', {
            templateUrl: 'home.html',
            controller: 'HomeController'
        })
        .when('/cities', {
            templateUrl: 'city.html',
            controller: 'CityController'
        })
        .when('/venues/:cityName', {
            templateUrl: 'venues.html',
            controller: 'VenueController'
        })
        .when('/venueDetails', {
            templateUrl: 'venue-details.html',
            controller: 'VenueDetailsController'
        })
        .when('/searchBusiness', {
            templateUrl: 'businessSearch.html',
            controller: 'businessController'
        })
        .otherwise('/home');

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true,
        rewriteLinks: true
    });

}]);
