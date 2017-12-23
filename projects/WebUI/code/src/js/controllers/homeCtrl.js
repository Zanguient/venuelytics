/**
 * @author Saravanakumar K
 * @date 25-MAY-2017
 */
"use strict";
app.controller('HomeController', ['$log', '$scope', '$location', 'DataShare','$translate', 'APP_CLIENTS', 'APP_ARRAYS', '$rootScope', 'AjaxService', 'APP_LINK','ngMeta',
    function ($log, $scope, $location, DataShare, $translate, APP_CLIENTS, APP_ARRAYS, $rootScope, AjaxService, APP_LINK, ngMeta) {

	$log.log('Inside Home Controller.');
    ngMeta.setTitle("Home - Venuelytics");
    var self = $scope;
    $rootScope.showSearchBox = true;
    $rootScope.businessSearch = false;
    $rootScope.searchVenue = false;
    $rootScope.showItzfun = false;
    self.clientImages = APP_CLIENTS.clientImages;
    $rootScope.businessRoles = APP_ARRAYS.roles;
    $rootScope.selectedTab = 'home';
    $rootScope.videoUrl = APP_LINK.VIDEO_PLAY;
    
    $scope.$on('$locationChangeStart', function(event) {
        var userSelectedTab = $location.absUrl().split('/').pop().split('?');
        $rootScope.canonicalURL = $location.absUrl();
        self.navBar(userSelectedTab[0]);
    });
    self.init = function() {

        self.venueLyticsFeatures = APP_ARRAYS.features;
        ngMeta.setTag('image', 'assets/img/screen2.jpg');
        ngMeta.setTag('description', 'The VenueLytics Business App is a Venue Management & Entertainment Platform which provides venues like Casinos, Resorts, Stadiums, Top Golf, Clubs, Bars, Lounges, Karaoke & Bowling Alleys with features that generate incremental revenue through service requests, mobile pay, analytics, rewards and more. Venues can also reach and enhance customer’s experience real-time via the “ItzFun!” consumer app.');
        var urlPattern = $location.absUrl();
        var data = urlPattern.split(".");
        if(urlPattern.toLowerCase().indexOf("itzfun.com")>= 0) {
            $rootScope.facebook = APP_LINK.FACEBOOK_ITZFUN;
            $rootScope.twitter = APP_LINK.TWITTER_ITZFUN;
            $rootScope.instagram = APP_LINK.INSTAGRAM_ITZFUN;
            $scope.showBusinessLink = false;
            if((urlPattern === "http://www.itzfun.com/") || (urlPattern === "https://www.itzfun.com/")){
                $location.url('/cities');
            }
        } else {
            $rootScope.facebook = APP_LINK.FACEBOOK_VENUELYTICS;
            $rootScope.twitter = APP_LINK.TWITTER_VENUELYTICS;
            $rootScope.instagram = APP_LINK.INSTAGRAM_VENUELYTICS;
            $scope.showBusinessLink = true;
        }
        $rootScope.venuelyticsAppUrl = APP_LINK.APPLE_STORE_VENUELYTICS;
        $rootScope.itzfunAppUrl = APP_LINK.APPLE_STORE_ITZFUN;
        
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;

        if (/android/i.test(userAgent)) {
            $rootScope.venuelyticsAppUrl = APP_LINK.GOOGLE_PLAY_VENUELYTICS;
            $rootScope.itzfunAppUrl = APP_LINK.GOOGLE_PLAY_ITZFUN;
        }

        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            $rootScope.venuelyticsAppUrl = APP_LINK.APPLE_STORE_VENUELYTICS;
            $rootScope.itzfunAppUrl = APP_LINK.APPLE_STORE_ITZFUN;
        }
        $(document).ready(function () {
            
            $('#carousel-example-generic').carousel({
                interval: 3000
            });
            $('#carousel-example-generic').carousel('cycle');

            var owl = $('.owl-carousel');
            owl.owlCarousel({
                loop:true,
                autoplay:true,
                autoplayTimeout:1000,
                dots:false,
                mouseDrag:true,
                touchDrag:true,
                responsive: {
                    0:{ items: 2},
                    480:{ items: 3},
                    768:{ items: 4},
                    992:{ items: 5},
                    1200:{ items: 6},
                },
                margin:60,
                nav:false
            });
        });
    };

    $rootScope.getSearchBySearch = function(searchVenue){
        $location.url('/cities');
        setTimeout(function(){
            $rootScope.getSearchBySearch(searchVenue);
        },3000);        
    };

    $rootScope.getserchKeyEnter = function(keyEvent,searchVenue) {
        if (keyEvent.which === 13){
            $rootScope.getSearchBySearch(searchVenue);
        }
    };
    
	self.changeLanguage = function(lang){
			$translate.use(lang);
    };
    $rootScope.closeStore = function() {
        $rootScope.venuelyticsApp = false;
        $rootScope.itzfunApp = false;
        $rootScope.panelShow = false;
    };
    self.sendEmail = function(email) {
        $rootScope.businessIsFocused = 'is-focused';
        if((email !== undefined) && (email !== '')){
            $('#subscribeModal').modal('show');
            $('.modal-backdrop').remove();
            $rootScope.successEmail = email;
        }
    };
    
    self.saveBusiness = function() {
        var business = $scope.business;
        var role = (typeof business.businessRole  === 'undefined') ? '' :  business.businessRole.role;
        var subscribeEmail = {
            "email": $rootScope.successEmail,
            "mobile": business.phoneNumber,
            "name": business.NameOfPerson,
            "businessName": business.businessName,
            "role": role ,
             "utmSource" : "venuelytics.com",
             "utmCampaign" :"homepage",
             "utmMedium": "subscribe"
        };
        AjaxService.sendSubscriptionMail(subscribeEmail).then(function(response) {
            $rootScope.successEmail = subscribeEmail.email;
            $('#subscribeSuccessModal').modal('show');
            $('.modal-backdrop').remove();
            self.subscribeEmails = '';
            $rootScope.businessIsFocused = '';
            $rootScope.emailToSend = '';
        });
    };
    self.init();

}]);
