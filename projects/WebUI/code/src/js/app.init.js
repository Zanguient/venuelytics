"use strict";
var app = angular.module('Mobinite', ['ngRoute', 'templates','pascalprecht.translate', 'ngCookies', 'ngclipboard', 'daterangepicker','ngMeta']);


// configure our routes
app.config(['$routeProvider', '$httpProvider', '$locationProvider', '$sceDelegateProvider','ngMetaProvider',
    function($routeProvider, $httpProvider, $locationProvider, $sceDelegateProvider, ngMetaProvider) {
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
            controller: 'HomeController'
                       
        })
        .when('/home', {
            templateUrl: 'home.html',
            controller: 'HomeController',
            title: 'Book VIP Reservations & Events'
        })
        .when('/home*', {
            templateUrl: 'home.html',
            controller: 'HomeController'
        })
        .when('/home?sb&orgId', {
            templateUrl: 'home.html',
            controller: 'HomeController'
        })
        .when('/home?nc&orgId', {
            templateUrl: 'home.html',
            controller: 'HomeController'
        })
        .when('/businessAlreadyClaimed/:venueid', {
            templateUrl: 'business/business-already-claim.html',
            controller: 'businessController'
        })
        .when('/cities', {
            templateUrl: 'new-city.html',
            controller: 'NewCityController'
        })
        .when('/cities/:cityName', {
            templateUrl: 'venue/new-venues.html',
            controller: 'NewVenueController'
        })
        .when('/cities/:cityName/:venueid', {
            templateUrl: 'venue/service-tabs.html',
            controller: 'ServiceTabController'
        })
        .when('/cities/:cityName/:venueid/:tabParam', {
            templateUrl: 'venue/service-tabs.html',
            controller: 'ServiceTabController'
        })
        .when('/cities/:cityName/:venueid/:tabParam/:new', {
            templateUrl: 'venue/service-tabs.html',
            controller: 'ServiceTabController'           
        })
        .when('/cities/:cityName/:venueid/:tabParam?i&orgId', {
            templateUrl: 'venue/service-tabs.html',
            controller: 'ServiceTabController'
        })
        .when('/searchBusiness', {
            templateUrl: 'business/business-search.html',
            controller: 'businessController'
        })
        .when('/completeBusinessClaim/:venueId', {
            templateUrl: 'business/business-verification.html',
            controller: 'BusinessClaimController'
        })
        .when('/about', {
            templateUrl: 'about.html',
            controller: 'BlogController'
        })
        .when('/contact', {
            templateUrl: 'contact.html',
            controller: 'BlogController'
        })
        .when('/privacy', {
            templateUrl: 'privacy.html',
            title: 'Venuelytics-Privacy'
        })
        .when('/terms', {
            templateUrl: 'terms-of-use.html'
        })
        .when('/claimBusiness/:venueid', {
            templateUrl: 'business/claim-business.html',
            controller: 'businessController'
        })
        .when('/deployment/:venueid', {
            templateUrl: 'business/deployment-steps.html',
            controller: 'businessController'
        })
        .when('/emailVerification/:venueid', {
            templateUrl: 'business/email-verification.html',
            controller: 'businessController'
        })
        .when('/confirm/:cityName/:venueid', {
            templateUrl: 'bottle-service/bottle-reservation.html',
            controller: 'ConfirmReservationController'
        })
        .when('/confirmPartyPackage/:cityName/:venueid', {
            templateUrl: 'party-service/party-confirm.html',
            controller: 'PartyConfirmController'
        })
        .when('/confirmTableService/:cityName/:venueid', {
            templateUrl: 'table-service/tableService-form.html',
            controller: 'TableServiceController'
        })
        .when('/confirmEvent/:cityName/:venueid', {
            templateUrl: 'private-event/private-confirm.html',
            controller: 'PrivateConfirmController'
        })
        .when('/confirmGuestList/:cityName/:venueid', {
            templateUrl: 'guest-list/guest-confirmation.html',
            controller: 'GuestConfirmController'
        })
        .when('/blog', {
            templateUrl: 'blogs/blogs.html',
            controller:'BlogController'
        })
        .when('/blogPost/:postId', {
            templateUrl: 'blogs/blog-post.html',
            controller: 'BlogPostController'
        })
        .when('/breakthrough/:throughId', {
            templateUrl: 'break-through/through-post.html',
            controller: 'Breakthrough'
        })
        .when('/:cityName/orderConfirm/:venueid', {
            templateUrl: 'order-confirm.html',
            controller:'OrderConfirmController'
        })
        .when('/:cityName/bottlePayment/:venueid', {
            templateUrl: 'bottle-service/bottle-payment.html',
            controller:'ConfirmReservationController'
        })
        .when('/:cityName/partyPackagePayment/:venueid', {
            templateUrl: 'party-service/party-payment.html',
            controller:'PartyConfirmController'
        })
        .when('/confirmFoodService/:cityName/:venueid', {
            templateUrl: 'food-service/food-confirmation.html',
            controller:'FoodConfirmController'
        })
        .when('/confirmDrinkService/:cityName/:venueid', {
            templateUrl: 'drink-service/drink-confirmation.html',
            controller:'DrinkConfirmController'
        })
        .when('/:cityName/paymentSuccess/:venueid', {
            templateUrl: 'payment-success.html',
            controller:'ConfirmReservationController'          
        })
        .when('/:cityName/partySuccess/:venueid', {
            templateUrl: 'party-service/party-payment-success.html',
            controller:'PartyConfirmController'
        })
        .when('/:cityName/foodPayment/:venueid', {
            templateUrl: 'food-service/food-payment.html',
            controller:'FoodConfirmController'
        })
        .when('/:cityName/drinkPayment/:venueid', {
            templateUrl: 'drink-service/drink-payment.html',
            controller:'DrinkConfirmController'
        })
        .when('/:cityName/foodSuccess/:venueid', {
            templateUrl: 'food-service/food-payment-success.html',
            controller:'FoodConfirmController'          
        })
        .when('/:cityName/drinkSuccess/:venueid', {
            templateUrl: 'drink-service/drink-payment-success.html',
            controller:'DrinkConfirmController'
            
        })
        .when('/:cityName/private-success/:venueid', {
            templateUrl: 'private-event/private-success.html',
            controller:'PrivateConfirmController'
        })
        .when('/:cityName/party-success/:venueid', {
            templateUrl: 'party-service/party-success.html',
            controller:'PartyConfirmController'
        })
        .when('/:cityName/food-success/:venueid', {
            templateUrl: 'food-service/food-success.html',
            controller:'FoodConfirmController'
        })
        .when('/:cityName/table-success/:venueid', {
            templateUrl: 'table-service/table-success.html',
            controller:'TableServiceController'
        })
        .when('/:cityName/drink-success/:venueid', {
            templateUrl: 'drink-service/drink-success.html',
            controller:'DrinkConfirmController'
        })
        .when('/:cityName/guest-success/:venueid', {
            templateUrl: 'guest-list/guest-success.html',
            controller:'GuestConfirmController'
        })
        .when('/cities/:cityName/:venueid/new/new/:embed', {
            templateUrl: 'business/iframe.html',
            controller:'TableServiceController'
        })
        .otherwise('/home');

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true,
        rewriteLinks: true
    });
   // $locationProvider.hashPrefix('!');
    ngMetaProvider.useTitleSuffix(true);
    ngMetaProvider.setDefaultTag('description', 'Venuelytics - is an entertainment platform for consumers to find fun places like Casinos,Clubs,Golf,Bars,Resorts,Stadium & order bottle service,food & drink,events...');
    ngMetaProvider.setDefaultTitle('Venuelytics');
    ngMetaProvider.setDefaultTitleSuffix(' | Book VIP Reservations & Events');
    ngMetaProvider.setDefaultTag('image', 'assets/img/screen2.jpg');

}]).config(['$translateProvider', function ($translateProvider) {
    var version = new Date().getTime();
    $translateProvider.useStaticFilesLoader({
        prefix : 'assets/i18n/',
        suffix : '.json?v=' + version
    });
    $translateProvider.preferredLanguage('en');
    $translateProvider.useLocalStorage();
    $translateProvider.useSanitizeValueStrategy(null);

}]).filter('to_trusted', ['$sce', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
}]).run(['$location', '$rootScope','$window','ngMeta',function($location, $rootScope, $window, ngMeta) {

    ngMeta.init();
    var hostName = $location.host();
    if (typeof hostName === 'undefined') {
        hostName = '';
    }
    hostName = $window.location.href.toLowerCase();
    $rootScope.showBusinessLink = true;
    $rootScope.embeddedFlag = false;
    var defaultPage = '/home';
    
    setTimeout(function(){
        $('.wait_loading_above_fold').remove();
    },300);

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
