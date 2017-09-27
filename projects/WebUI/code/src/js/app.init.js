"use strict";
var app = angular.module('Mobinite', ['ngRoute', 'templates','pascalprecht.translate', 'ngCookies', 'ngclipboard', 'daterangepicker']);


// configure our routes
app.config(['$routeProvider', '$httpProvider', '$locationProvider', '$sceDelegateProvider',
    function($routeProvider, $httpProvider, $locationProvider, $sceDelegateProvider) {
    $locationProvider.hashPrefix('');
    $httpProvider.defaults.withCredentials = true;

    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        "self",
        "127.0.0.1",
        // Allow loading from Google maps
        "https://dev.api.venuelytics.com/WebServices**",
        "http://dev.api.venuelytics.com/WebServices**"
    ]);


    $routeProvider
        .when('/', {
            templateUrl: 'home.html',
            controller: 'HomeController',
            title: 'Book VIP Reservations & Events',
            description: 'Venuelytics - a real time venue experience platform enabling businesses to provide table &amp; bottle reservations, private event, rewards, food &amp; drink ordering...'
        })
        .when('/home', {
            templateUrl: 'home.html',
            controller: 'HomeController',
            title: 'Book VIP Reservations & Events',
            description: 'Venuelytics - a real time venue experience platform enabling businesses to provide table &amp; bottle reservations, private event, rewards, food &amp; drink ordering...'
        })
        .when('/home*', {
            templateUrl: 'home.html',
            controller: 'HomeController',
            title: 'Book VIP Reservations & Events',
            description: 'Venuelytics - a real time venue experience platform enabling businesses to provide table &amp; bottle reservations, private event, rewards, food &amp; drink ordering...'
        })
        .when('/home?sb&orgId', {
            templateUrl: 'home.html',
            controller: 'HomeController',
            title: 'Book VIP Reservations & Events',
            description: 'Venuelytics - a real time venue experience platform enabling businesses to provide table &amp; bottle reservations, private event, rewards, food &amp; drink ordering...'
        })
        .when('/home?nc&orgId', {
            templateUrl: 'home.html',
            controller: 'HomeController',
            title: 'Book VIP Reservations & Events',
            description: 'Venuelytics - a real time venue experience platform enabling businesses to provide table &amp; bottle reservations, private event, rewards, food &amp; drink ordering...'
        })
        /* .when('/cities', {
            templateUrl: 'city.html',
            controller: 'CityController',
            title: 'Venuelytics-City',
            description: 'Venuelytics - is an entertainment platform for consumers to find fun places like Casinos,Clubs,Golf,Bars,Resorts,Stadium & order bottle service,food & drink,events...'
        }) 
        .when('/cities/:cityName', {
            templateUrl: 'venue/venues.html',
            controller: 'VenueController',
            description: 'Venuelytics - is an entertainment platform for consumers to find fun places like Casinos,Clubs,Golf,Bars,Resorts,Stadium & order bottle service,food & drink,events...'
        })
        .when('/cities/:cityName/:venueid/:serviceType', {
            templateUrl: 'venue/venue-details.html',
            controller: 'VenueDetailsController',
            title: 'Venuelytics-Service',
            description: 'Venuelytics - is an entertainment platform for consumers to find fun places like Casinos,Clubs,Golf,Bars,Resorts,Stadium & order bottle service,food & drink,events...'
        })
        .when('/cities/:cityName/:venueid', {
            templateUrl: 'venue/venue-details.html',
            controller: 'VenueDetailsController',
            description: 'Venuelytics - is an entertainment platform for consumers to find fun places like Casinos,Clubs,Golf,Bars,Resorts,Stadium & order bottle service,food & drink,events...'
        })
        .when('/cities/:cityName/:venueid?i&orgId', {
            templateUrl: 'venue/venue-details.html',
            controller: 'VenueDetailsController',
            description: 'Venuelytics - is an entertainment platform for consumers to find fun places like Casinos,Clubs,Golf,Bars,Resorts,Stadium & order bottle service,food & drink,events...'
        })*/
        .when('/businessAlreadyClaimed/:venueid', {
            templateUrl: 'business/business-already-claim.html',
            controller: 'businessController',
            title: 'Venuelytics-BusinessAlreadyClaim',
            description: 'Venuelytics - a real time venue experience platform enabling Business Already Claimed'
        })
        .when('/cities', {
            templateUrl: 'new-city.html',
            controller: 'NewCityController',
            title: 'Venuelytics-City',
            description: 'Venuelytics - is an entertainment platform for consumers to find fun places like Casinos,Clubs,Golf,Bars,Resorts,Stadium & order bottle service,food & drink,events...'

        })
        .when('/cities/:cityName', {
            templateUrl: 'venue/new-venues.html',
            controller: 'NewVenueController',
            description: 'Venuelytics - is an entertainment platform for consumers to find fun places like Casinos,Clubs,Golf,Bars,Resorts,Stadium & order bottle service,food & drink,events...'
        })
        .when('/cities/:cityName/:venueid', {
            templateUrl: 'venue/service-tabs.html',
            controller: 'ServiceTabController',
            description: 'Venuelytics - is an entertainment platform for consumers to find fun places like Casinos,Clubs,Golf,Bars,Resorts,Stadium & order bottle service,food & drink,events...'
        })
        .when('/cities/:cityName/:venueid/:tabParam', {
            templateUrl: 'venue/service-tabs.html',
            controller: 'ServiceTabController',
            description: 'Venuelytics - is an entertainment platform for consumers to find fun places like Casinos,Clubs,Golf,Bars,Resorts,Stadium & order bottle service,food & drink,events...'
        })
        .when('/cities/:cityName/:venueid/:tabParam/:new', {
            templateUrl: 'venue/service-tabs.html',
            controller: 'ServiceTabController',
            description: 'Venuelytics - is an entertainment platform for consumers to find fun places like Casinos,Clubs,Golf,Bars,Resorts,Stadium & order bottle service,food & drink,events...'
        })
        .when('/cities/:cityName/:venueid/:tabParam?i&orgId', {
            templateUrl: 'venue/service-tabs.html',
            controller: 'ServiceTabController',
            description: 'Venuelytics - is an entertainment platform for consumers to find fun places like Casinos,Clubs,Golf,Bars,Resorts,Stadium & order bottle service,food & drink,events...'
        })
        .when('/searchBusiness', {
            templateUrl: 'business/business-search.html',
            controller: 'businessController',
            title: 'Venuelytics-BusinessSearch',
            description: 'Venuelytics - a real time venue experience platform enabling Business Search'
        })
        .when('/completeBusinessClaim/:venueId', {
            templateUrl: 'business/business-verification.html',
            controller: 'BusinessClaimController',
            title: 'Venuelytics-BusinessSearch',
            description: 'Venuelytics - a real time venue experience platform enabling Business Search'
        })
        .when('/about', {
            templateUrl: 'about.html',
            title: 'Venuelytics-About',
            controller: 'BlogController',
            description: 'Venuelytics - a real time venue experience platform enabling About Information'
        })
        .when('/contact', {
            templateUrl: 'contact.html',
            title: 'Venuelytics-Contact',
            controller: 'BlogController',
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
            templateUrl: 'business/claim-business.html',
            controller: 'businessController',
            title: 'Venuelytics-ClaimBusiness',
            description: 'Venuelytics - a real time venue experience platform enabling Claim Business Information'
        })
        .when('/deployment/:venueid', {
            templateUrl: 'business/deployment-steps.html',
            controller: 'businessController',
            title: 'Venuelytics-Deployment',
            description: 'Venuelytics - a real time venue experience platform enabling Deployment Information'

        })
        .when('/emailVerification/:venueid', {
            templateUrl: 'business/email-verification.html',
            controller: 'businessController',
            title: 'Venuelytics-EmailVerification',
            description: 'Venuelytics - a real time venue experience platform enabling Email Verfication'
        })
        .when('/confirm/:cityName/:venueid', {
            templateUrl: 'bottle-service/bottle-reservation.html',
            controller: 'ConfirmReservationController',
            title: 'Venuelytics-ConfirmReservation',
            description: 'Venuelytics - a real time venue experience platform enabling Email Verfication'
        })
        .when('/confirmPartyPackage/:cityName/:venueid', {
            templateUrl: 'party-service/party-confirm.html',
            controller: 'PartyConfirmController',
            title: 'Venuelytics-ConfirmPartyPackage',
            description: 'Venuelytics - a real time venue experience platform enabling Email Verfication'
        })
        .when('/confirmTableService/:cityName/:venueid', {
            templateUrl: 'table-service/tableService-form.html',
            controller: 'TableServiceController',
            title: 'Venuelytics-ConfirmTableService',
            description: 'Venuelytics - a real time venue experience platform enabling Table Service'
        })
        .when('/confirmEvent/:cityName/:venueid', {
            templateUrl: 'private-event/private-confirm.html',
            controller: 'PrivateConfirmController',
            title: 'Venuelytics-ConfirmReservation',
            description: 'Venuelytics - a real time venue experience platform enabling Email Verfication'
        })
        .when('/confirmGuestList/:cityName/:venueid', {
            templateUrl: 'guest-list/guest-confirmation.html',
            controller: 'GuestConfirmController',
            title: 'Venuelytics-GuestListConfirmation',
            description: 'Venuelytics - a real time venue experience platform enabling Email Verfication'
        })
        .when('/blog', {
            templateUrl: 'blogs/blogs.html',
            title: 'Venuelytics-Blog',
            controller:'BlogController',
            description: 'Venuelytics - a real time venue experience platform enabling Blog Information'
        })
        .when('/blogPost/:postId', {
            templateUrl: 'blogs/blog-post.html',
            controller: 'BlogPostController',
            title: 'Venuelytics-Blog-Post',
            description: 'Venuelytics - a real time venue experience platform enabling Blog Information'
        })
        .when('/breakthrough/:throughId', {
            templateUrl: 'break-through/through-post.html',
            controller: 'Breakthrough',
            title: 'Venuelytics-Break-Through',
            description: 'Venuelytics - a real time venue experience platform enabling Blog Information'
        })
        .when('/:cityName/orderConfirm/:venueid', {
            templateUrl: 'order-confirm.html',
            title: 'Venuelytics-Order-Confirm',
            controller:'OrderConfirmController',
            description: 'Venuelytics - a real time venue experience platform enabling Order'
        })
        .when('/:cityName/bottlePayment/:venueid', {
            templateUrl: 'bottle-service/bottle-payment.html',
            title: 'Venuelytics-Bottle-Payment',
            controller:'ConfirmReservationController',
            description: 'Venuelytics - a real time venue experience platform for bottle payment'
        })
        .when('/:cityName/partyPackagePayment/:venueid', {
            templateUrl: 'party-service/party-payment.html',
            title: 'Venuelytics-Bottle-Payment',
            controller:'PartyConfirmController',
            description: 'Venuelytics - a real time venue experience platform for bottle payment'
        })
        .when('/confirmFoodService/:cityName/:venueid', {
            templateUrl: 'food-service/food-confirmation.html',
            title: 'Venuelytics-Food-Confirmation',
            controller:'FoodConfirmController',
            description: 'Venuelytics - a real time venue experience platform for food confirmation'
        })
        .when('/confirmDrinkService/:cityName/:venueid', {
            templateUrl: 'drink-service/drink-confirmation.html',
            title: 'Venuelytics-Drink-Confirmation',
            controller:'DrinkConfirmController',
            description: 'Venuelytics - a real time venue experience platform for drink confirmation'
        })
        .when('/:cityName/paymentSuccess/:venueid', {
            templateUrl: 'payment-success.html',
            title: 'Venuelytics-Payment-Success',
            controller:'ConfirmReservationController',
            description: 'Venuelytics - a real time venue experience platform for payment success'
        })
        .when('/:cityName/partySuccess/:venueid', {
            templateUrl: 'party-service/party-payment-success.html',
            title: 'Venuelytics-Party-Payment-Success',
            controller:'PartyConfirmController',
            description: 'Venuelytics - a real time venue experience platform for party payment success'
        })
        .when('/:cityName/foodPayment/:venueid', {
            templateUrl: 'food-service/food-payment.html',
            title: 'Venuelytics-Food-Payment',
            controller:'FoodConfirmController',
            description: 'Venuelytics - a real time venue experience platform for food success'
        })
        .when('/:cityName/drinkPayment/:venueid', {
            templateUrl: 'drink-service/drink-payment.html',
            title: 'Venuelytics-Drink-Payment',
            controller:'DrinkConfirmController',
            description: 'Venuelytics - a real time venue experience platform for drink success'
        })
        .when('/:cityName/foodSuccess/:venueid', {
            templateUrl: 'food-service/food-payment-success.html',
            title: 'Venuelytics-Food-Payment-Success',
            controller:'FoodConfirmController',
            description: 'Venuelytics - a real time venue experience platform for food payment success'
        })
        .when('/:cityName/drinkSuccess/:venueid', {
            templateUrl: 'drink-service/drink-payment-success.html',
            title: 'Venuelytics-Drink-Payment-Success',
            controller:'DrinkConfirmController',
            description: 'Venuelytics - a real time venue experience platform for drink payment success'
        })
        .when('/:cityName/private-success/:venueid', {
            templateUrl: 'private-event/private-success.html',
            title: 'Venuelytics-Private-Success',
            controller:'PrivateConfirmController',
            description: 'Venuelytics - a real time venue experience platform for private success'
        })
        .when('/:cityName/party-success/:venueid', {
            templateUrl: 'party-service/party-success.html',
            title: 'Venuelytics-Private-Success',
            controller:'PartyConfirmController',
            description: 'Venuelytics - a real time venue experience platform for private success'
        })
        .when('/:cityName/food-success/:venueid', {
            templateUrl: 'food-service/food-success.html',
            title: 'Venuelytics-Food-Success',
            controller:'FoodConfirmController',
            description: 'Venuelytics - a real time venue experience platform for Food success'
        })
        .when('/:cityName/table-success/:venueid', {
            templateUrl: 'table-service/table-success.html',
            title: 'Venuelytics-Table-Success',
            controller:'TableServiceController',
            description: 'Venuelytics - a real time venue experience platform for Table success'
        })
        .when('/:cityName/drink-success/:venueid', {
            templateUrl: 'drink-service/drink-success.html',
            title: 'Venuelytics-Drink-Success',
            controller:'DrinkConfirmController',
            description: 'Venuelytics - a real time venue experience platform for Drink success'
        })
        .when('/:cityName/guest-success/:venueid', {
            templateUrl: 'guest-list/guest-success.html',
            title: 'Venuelytics-Guest-Success',
            controller:'GuestConfirmController',
            description: 'Venuelytics - a real time venue experience platform for guest success'
        })
        .when('/cities/:cityName/:venueid/new/new/:embed', {
            templateUrl: 'business/iframe.html',
            controller:'TableServiceController',
            description: 'Venuelytics - is an entertainment platform for consumers to find fun places like Casinos,Clubs,Golf,Bars,Resorts,Stadium & order bottle service,food & drink,events...'
        })
        .otherwise('/home');

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true,
        rewriteLinks: true
    });
   // $locationProvider.hashPrefix('!');

}]).config(['$translateProvider', function ($translateProvider) {
    var version = new Date().getTime();
    $translateProvider.useStaticFilesLoader({
        prefix : 'assets/i18n/',
        suffix : '.json?v=' + version
    });
    $translateProvider.preferredLanguage('en');
    $translateProvider.useLocalStorage();

}]).run(['$location', '$rootScope','$window',function($location, $rootScope, $window) {

    var hostName = $location.host();
    if (typeof hostName === 'undefined') {
        hostName = '';
    }
    hostName = $window.location.href.toLowerCase();
    $rootScope.showBusinessLink = true;
    $rootScope.embeddedFlag = false;
    var defaultPage = '/home';
    /* if (hostName.indexOf("itzfun.com") >= 0){
        defaultPage = '/cities';
        $rootScope.showBusinessLink = false;
    } */

    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {

        if (current.hasOwnProperty('$$route')) {
            if(current.$$route.title) {
                $rootScope.title = current.$$route.title;
                $rootScope.description = current.$$route.description;
            }
        }
        if (typeof previous === 'undefined' && current.templateUrl  === 'home.html') {
             $location.path( defaultPage );
        }
    });
}]);
angular.module('templates', []);
