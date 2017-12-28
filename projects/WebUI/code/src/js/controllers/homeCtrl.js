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
    
    $scope.carouselData = [
        {image: 'screen2.jpg', title: 'home.REAL_TIME_HOME', details: 'home.PERSONALIZED_SERVICES'},
        {image: '2.jpg', title: 'home.REAL_TIME', details: 'home.RESERVATION_FOOD_DRINK'},
        {image: '3.jpg', title: 'home.CREATE_NEW_SOURCES', details: 'home.WIFI_IN_VENUE_ORDERING'},
        {image: 'screen4.jpg', title: 'home.VIP_PERSONALLY', details: 'home.CONSISTENTLY_REWARD'},
        
        {image: '5-1.jpg', title: 'home.IMPROVE_PRODUCTIVITY', details: 'home.FOR_CASINOS_CLUBS'},
        {image: '6(1).jpg', title: 'home.REAL_TIME_MOBILE', details: 'home.IMMEDIATE_WIFI_ENABLED'},
        {image: '7.jpg', title: 'home.CUSTOMER_SERVICE', title: 'home.EXPERIENCE'}


    ];
    $scope.$on('$locationChangeStart', function(event) {
        var userSelectedTab = $location.absUrl().split('/').pop().split('?');
        $rootScope.canonicalURL = $location.absUrl();
    });

    self.featureClick = function(feature) {
        $location.url('/business/#'+feature.ref);
    };
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
            
            $('#venuelytics-presentation').carousel({
                interval: 3000
            });
            $('#venuelytics-presentation').carousel('cycle');

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
                nav:true
            });
            $( ".owl-prev").html('<img src="assets/img/arrow_left.png">');
            $( ".owl-next").html('<img src="assets/img/arrow_right.png">');
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
             "utmCampaign" :"30DaysFree",
             "utmMedium": "homepage-subscribe"
        };
        AjaxService.subscribe(subscribeEmail).then(function(response) {
            $rootScope.successEmail = subscribeEmail.email;
            $('#subscribeSuccessModal').modal('show');
            $('.modal-backdrop').remove();
            self.subscribeEmails = '';
            $rootScope.emailToSend = '';
        });
    };
    self.init();

}]);
