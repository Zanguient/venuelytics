"use strict";
var app = angular.module('Mobinite', ['ngRoute', 'templates','pascalprecht.translate', 'ngCookies']);


// configure our routes
app.config(['$routeProvider', '$httpProvider', '$locationProvider', '$sceDelegateProvider', 
    function($routeProvider, $httpProvider, $locationProvider, $sceDelegateProvider) {
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
        .when('/venues/:cityName/:venueid', {
            templateUrl: 'venue-details.html',
            controller: 'VenueDetailsController'
        })
        .when('/searchBusiness', {
            templateUrl: 'business-search.html',
            controller: 'businessController'
        })
        .when('/about', {
            templateUrl: 'about.html'
        })
        .when('/contact', {
            templateUrl: 'contact.html'
        })
        .otherwise('/home');

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true,
        rewriteLinks: true
    });

}]).config(['$translateProvider', function ($translateProvider) {

    $translateProvider.useStaticFilesLoader({
        prefix : 'assets/i18n/',
        suffix : '.json'
    });
    $translateProvider.preferredLanguage('en');
    $translateProvider.useLocalStorage();

}]);
angular.module('templates', []);