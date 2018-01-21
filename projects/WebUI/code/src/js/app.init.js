"use strict";
var app = angular.module('Mobinite', ['ngRoute', 'templates','pascalprecht.translate', 'ngCookies', 'ngclipboard','daterangepicker','ngMeta', 'satellizer', 'ngStorage']);


// configure our routes
app.config(['$routeProvider', '$httpProvider', '$locationProvider', '$sceDelegateProvider','ngMetaProvider','$authProvider',
    function($routeProvider, $httpProvider, $locationProvider, $sceDelegateProvider, ngMetaProvider, $authProvider) {
    $locationProvider.hashPrefix('');
    $httpProvider.defaults.withCredentials = true;

    initAuthProvisers();
    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        "self",
        "127.0.0.1",
        // Allow loading from Google maps
        "https://dev.api.venuelytics.com/WebServices**",
        "http://dev.api.venuelytics.com/WebServices**",
         "https://prod.api.venuelytics.com/WebServices**",
          "http://prod.api.venuelytics.com/WebServices**",
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
        .when('/businessAlreadyClaimed/:venueId', {
            templateUrl: 'business/business-already-claim.html',
            controller: 'BusinessSearchController'
        })
        .when('/cities', {
            templateUrl: 'city.html',
            controller: 'CityController'
        })
        .when('/cities/:cityName', {
            templateUrl: 'venue/new-venues.html',
            controller: 'NewVenueController'
        })
        .when('/cities/:cityName/:venueId', {
            templateUrl: 'venue/service-tabs.html',
            controller: 'ServiceTabController'
        })
        .when('/cities/:cityName/:venueId/:tabParam', {
            templateUrl: 'venue/service-tabs.html',
            controller: 'ServiceTabController'
        })
        .when('/cities/:cityName/:venueId/:tabParam/:new', {
            templateUrl: 'venue/service-tabs.html',
            controller: 'ServiceTabController'           
        })
        .when('/business', {
            templateUrl: 'business/business.html',
            controller: 'BusinessController'
        })
        .when('/searchBusiness', {
            templateUrl: 'business/business-search.html',
            controller: 'BusinessSearchController'
        })
        .when('/completeBusinessClaim/:venueId', {
            templateUrl: 'business/business-verification.html',
            controller: 'BusinessClaimController'
        })
        .when('/solution', {
            templateUrl: 'solution/solution.html',
            controller: 'SolutionController'
        })
        .when('/pricing', {
            templateUrl: 'pricing.html',
            controller: 'PricingController'
        })
        .when('/about', {
            templateUrl: 'about.html',
            controller: 'AboutController'
        })
        .when('/contact', {
            templateUrl: 'contact.html',
            controller: 'ContactController'
        })
        .when('/privacy', {
            templateUrl: 'privacy.html',
            title: 'Venuelytics-Privacy'
        })
        .when('/terms', {
            templateUrl: 'terms-of-use.html'
        })
        
        .when('/deployment/:venueId', {
            templateUrl: 'business/deployment-steps.html',
            controller: 'BusinessSearchController'
        })
        .when('/emailVerification/:venueId', {
            templateUrl: 'business/email-verification.html',
            controller: 'BusinessSearchController'
        })
        .when('/confirm/:cityName/:venueId', {
            templateUrl: 'bottle-service/bottle-reservation.html',
            controller: 'ConfirmReservationController'
        })
        .when('/reserve/:cityName/:venueId', {
            templateUrl: 'reservation-service/reserve-reservation.html',
            controller: 'ConfirmReservationController'
        })
        .when('/confirmPartyPackage/:cityName/:venueId', {
            templateUrl: 'party-service/party-confirm.html',
            controller: 'PartyConfirmController'
        })
        .when('/confirmBachelorParty/:cityName/:venueId', {
            templateUrl: 'bachelor-party/bachelor-confirm.html',
            controller: 'bachelorConfirmController'
        })
        .when('/confirmTableService/:cityName/:venueId', {
            templateUrl: 'table-service/tableService-form.html',
            controller: 'TableServiceController'
        })
        .when('/confirmEvent/:cityName/:venueId', {
            templateUrl: 'private-event/private-confirm.html',
            controller: 'PrivateConfirmController'
        })
        .when('/confirmGuestList/:cityName/:venueId', {
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
        .when('/:cityName/orderConfirm/:venueId', {
            templateUrl: 'order-confirm.html',
            controller:'OrderConfirmController'
        })
        .when('/:cityName/bottlePayment/:venueId', {
            templateUrl: 'bottle-service/bottle-payment.html',
            controller:'ConfirmReservationController'
        })
        .when('/:cityName/partyPackagePayment/:venueId', {
            templateUrl: 'party-service/party-payment.html',
            controller:'PartyConfirmController'
        })
        .when('/:cityName/bachelorPayment/:venueId', {
            templateUrl: 'bachelor-party/bachelor-payment.html',
            controller:'bachelorConfirmController'
        })
        .when('/confirmFoodService/:cityName/:venueId', {
            templateUrl: 'food-service/food-confirmation.html',
            controller:'FoodConfirmController'
        })
        .when('/confirmDrinkService/:cityName/:venueId', {
            templateUrl: 'drink-service/drink-confirmation.html',
            controller:'DrinkConfirmController'
        })
        .when('/:cityName/paymentSuccess/:venueId', {
            templateUrl: 'payment-success.html',
            controller:'ConfirmReservationController'          
        })
        .when('/:cityName/partySuccess/:venueId', {
            templateUrl: 'party-service/party-payment-success.html',
            controller:'PartyConfirmController'
        })
        .when('/:cityName/bachelorSuccess/:venueId', {
            templateUrl: 'bachelor-party/bachelor-payment-success.html',
            controller:'bachelorConfirmController'
        })
        .when('/:cityName/foodPayment/:venueId', {
            templateUrl: 'food-service/food-payment.html',
            controller:'FoodConfirmController'
        })
        .when('/:cityName/drinkPayment/:venueId', {
            templateUrl: 'drink-service/drink-payment.html',
            controller:'DrinkConfirmController'
        })
        .when('/:cityName/foodSuccess/:venueId', {
            templateUrl: 'food-service/food-payment-success.html',
            controller:'FoodConfirmController'          
        })
        .when('/:cityName/drinkSuccess/:venueId', {
            templateUrl: 'drink-service/drink-payment-success.html',
            controller:'DrinkConfirmController'
            
        })
        .when('/:cityName/private-success/:venueId', {
            templateUrl: 'private-event/private-success.html',
            controller:'PrivateConfirmController'
        })
        .when('/:cityName/party-success/:venueId', {
            templateUrl: 'party-service/party-success.html',
            controller:'PartyConfirmController'
        })
        .when('/:cityName/bachelor-success/:venueId', {
            templateUrl: 'bachelor-party/bachelor-success.html',
            controller:'bachelorConfirmController'
        })
        .when('/:cityName/food-success/:venueId', {
            templateUrl: 'food-service/food-success.html',
            controller:'FoodConfirmController'
        })
        .when('/:cityName/table-success/:venueId', {
            templateUrl: 'table-service/table-success.html',
            controller:'TableServiceController'
        })
        .when('/:cityName/drink-success/:venueId', {
            templateUrl: 'drink-service/drink-success.html',
            controller:'DrinkConfirmController'
        })
        .when('/:cityName/guest-success/:venueId', {
            templateUrl: 'guest-list/guest-success.html',
            controller:'GuestConfirmController'
        })
        .when('/wifiLanding', {
            templateUrl: 'landing/landing.html',
            controller: 'WifiController'
        })
        .when('/landing/:venueId', {
            templateUrl: 'landing/landing_new.html',
            controller: 'LandingController'
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
    ngMetaProvider.setDefaultTag('image', 'assets/img/7.jpg');

    function initAuthProvisers() {
        

        $authProvider.facebook({
          redirectUri: 'http://54abf2cb.ngrok.io/wifiLanding',
          clientId: '1411355548976946'
        });


      
//decb11290746edd944f7e550bbee1431
        $authProvider.google({
          clientId: '118965238180-nqjtuurcepb6s664nrmje9jcvbbn5j6b.apps.googleusercontent.com'
        });

        $authProvider.instagram({
          clientId: 'Instagram Client ID'
        });

        $authProvider.twitter({
          name: 'twitter',
          url: '/auth/twitter',
          authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
          redirectUri: window.location.origin,
          oauthType: '10',
          popupOptions: { width: 495, height: 645 }

        });


    }

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
    var defaultPage = '/home';
    $rootScope.baseUrl = $location.protocol() + "://" + location.host;
    console.log("base url:" + $rootScope.baseUrl);
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
