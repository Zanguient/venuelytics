"use strict";
var app = angular.module('Mobinite', ['ngRoute', 'templates','pascalprecht.translate', 'ngCookies', 'ngclipboard',
 'daterangepicker','ngMeta', 'satellizer']);


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
            controller: 'BusinessController'
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
            controller: 'BusinessController'
        })
        .when('/completeBusinessClaim/:venueId', {
            templateUrl: 'business/business-verification.html',
            controller: 'BusinessClaimController'
        })
        .when('/pricing', {
            templateUrl: 'pricing.html',
            controller: 'PricingController'
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
            controller: 'BusinessController'
        })
        .when('/deployment/:venueid', {
            templateUrl: 'business/deployment-steps.html',
            controller: 'BusinessController'
        })
        .when('/emailVerification/:venueid', {
            templateUrl: 'business/email-verification.html',
            controller: 'BusinessController'
        })
        .when('/confirm/:cityName/:venueid', {
            templateUrl: 'bottle-service/bottle-reservation.html',
            controller: 'ConfirmReservationController'
        })
        .when('/confirmPartyPackage/:cityName/:venueid', {
            templateUrl: 'party-service/party-confirm.html',
            controller: 'PartyConfirmController'
        })
        .when('/confirmBachelorParty/:cityName/:venueid', {
            templateUrl: 'bachelor-party/bachelor-confirm.html',
            controller: 'bachelorConfirmController'
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
        .when('/:cityName/bachelorPayment/:venueid', {
            templateUrl: 'bachelor-party/bachelor-payment.html',
            controller:'bachelorConfirmController'
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
        .when('/:cityName/bachelorSuccess/:venueid', {
            templateUrl: 'bachelor-party/bachelor-payment-success.html',
            controller:'bachelorConfirmController'
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
        .when('/:cityName/bachelor-success/:venueid', {
            templateUrl: 'bachelor-party/bachelor-success.html',
            controller:'bachelorConfirmController'
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
        .when('/wifiLanding', {
            templateUrl: 'landing/landing.html',
            controller: 'WifiController'
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
