"use strict";
var app = angular.module('Mobinite', ['ngRoute', 'templates','pascalprecht.translate', 'ngCookies', 'ngclipboard']);


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
            controller: 'HomeController',
            title: 'Venuelytics',
            description: 'Venuelytics - a real time venue experience platform enabling businesses to provide table &amp; bottle reservations, private event, rewards, food &amp; drink ordering...'
        })
        .when('/home*', {
            templateUrl: 'home.html',
            controller: 'HomeController',
            title: 'Venuelytics',
            description: 'Venuelytics - a real time venue experience platform enabling businesses to provide table &amp; bottle reservations, private event, rewards, food &amp; drink ordering...'
        })
        .when('/home?sb&orgId', {
            templateUrl: 'home.html',
            controller: 'HomeController',
            title: 'Venuelytics',
            description: 'Venuelytics - a real time venue experience platform enabling businesses to provide table &amp; bottle reservations, private event, rewards, food &amp; drink ordering...'
        })
        .when('/cities', {
            templateUrl: 'city.html',
            controller: 'CityController',
            title: 'Venuelytics-City',
            description: 'Venuelytics - a real time venue experience platform enabling City Information'

        })
        .when('/venues/:cityName', {
            templateUrl: 'venues.html',
            controller: 'VenueController',
            description: 'Venuelytics - a real time venue experience platform enabling Particular City Information'
        })
        .when('/venues/:cityName/:venueid/:serviceType', {
            templateUrl: 'venue-details.html',
            controller: 'VenueDetailsController',
            title: 'Venuelytics-Service',
            description: 'Venuelytics - a real time venue experience platform enabling Particular City Service'
        })
        .when('/venues/:cityName/:venueid', {
            templateUrl: 'venue-details.html',
            controller: 'VenueDetailsController',
            description: 'Venuelytics - a real time venue experience platform enabling Particular City Details'
        })
        .when('/searchBusiness', {
            templateUrl: 'business-search.html',
            controller: 'businessController',
            title: 'Venuelytics-BusinessSearch',
            description: 'Venuelytics - a real time venue experience platform enabling Business Search'
        })
        .when('/about', {
            templateUrl: 'about.html',
            title: 'Venuelytics-About',
            description: 'Venuelytics - a real time venue experience platform enabling About Information'
        })
        .when('/contact', {
            templateUrl: 'contact.html',
            title: 'Venuelytics-Contact',
            description: 'Venuelytics - a real time venue experience platform enabling Contact Information'
        })
        .when('/privacy', {
            templateUrl: 'privacy.html',
            title: 'Venuelytics-Privacy',
            description: 'Venuelytics - a real time venue experience platform enabling Privacy Information'
        })
        .when('/terms', {
            templateUrl: 'terms-of-use.html',
            title: 'Venuelytics-Terms',
            description: 'Venuelytics - a real time venue experience platform enabling Terms Information'
        })
        .when('/claimBusiness/:venueid', {
            templateUrl: 'claim-business.html',
            controller: 'businessController',
            title: 'Venuelytics-ClaimBusiness',
            description: 'Venuelytics - a real time venue experience platform enabling Claim Business Information'
        })
        .when('/deployment/:venueid', {
            templateUrl: 'deployment-steps.html',
            controller: 'businessController',
            title: 'Venuelytics-Deployment',
            description: 'Venuelytics - a real time venue experience platform enabling Deployment Information'
        })
        .when('/emailVerification/:venueid', {
            templateUrl: 'emailVerification.html',
            controller: 'businessController',
            title: 'Venuelytics-EmailVerfication',
            description: 'Venuelytics - a real time venue experience platform enabling Email Verfication'
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

}]).run(['$location', '$rootScope', function($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {

        if (current.hasOwnProperty('$$route')) {
            if(current.$$route.title) {
                $rootScope.title = current.$$route.title;
                $rootScope.description = current.$$route.description;
            }
        }
    });
}]);
angular.module('templates', []);