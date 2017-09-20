/**
 * @author Saravanakumar K
 * @date 25-MAY-2017
 */
"use strict";
app.controller('HomeController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare','$translate', 'APP_CLIENTS', 
    'APP_ARRAYS', '$rootScope', 'AjaxService', 'APP_LINK',
    function ($log, $scope, $http, $location, RestURL, DataShare, $translate, APP_CLIENTS, APP_ARRAYS, $rootScope, AjaxService, APP_LINK) {

	$log.log('Inside Home Controller.');

    var self = $scope;
    $rootScope.showSearchBox = false;
    $rootScope.homeTab = 'active';
    self.clientImages = APP_CLIENTS.clientImages;
    $rootScope.businessRoles = APP_ARRAYS.roles;
    /*var data = $location.search().sb;
    self.showBusinessTab = parseInt(data);
    var newConsumer = $location.search().nc;
    self.showNewConsumer = parseInt(newConsumer);*/
    $rootScope.videoUrl = APP_LINK.VIDEO_PLAY;
    self.navBar = function(tab) {
        if(tab === 'home') {
            $rootScope.homeTab = 'active';
            $rootScope.businessTab = '';
            $rootScope.consumerTab = '';
            $rootScope.newConsumerTab = '';
            $rootScope.aboutTab = '';
            $rootScope.contactTab = '';
            $rootScope.blogTab = '';
            $rootScope.venuelyticsApp = true;
            $rootScope.itzfunApp = false;
            $rootScope.panelShow = true;
        } else if(tab === 'searchBusiness') {
            $rootScope.homeTab = '';
            $rootScope.businessTab = 'active';
            $rootScope.consumerTab = '';
            $rootScope.newConsumerTab = '';
            $rootScope.aboutTab = '';
            $rootScope.contactTab = '';
            $rootScope.blogTab = '';
            $rootScope.venuelyticsApp = false;
            $rootScope.itzfunApp = false;
            $rootScope.panelShow = false;
        /* } else if(tab === 'cities') {
            $rootScope.homeTab = '';
            $rootScope.businessTab = '';
            $rootScope.consumerTab = 'active';
            $rootScope.newConsumerTab = '';
            $rootScope.aboutTab = '';
            $rootScope.contactTab = '';
            $rootScope.blogTab = '';
            $rootScope.itzfunApp = true;
            $rootScope.venuelyticsApp = false;
            $rootScope.panelShow = true; */
        } else if(tab === 'cities') {
            $rootScope.homeTab = '';
            $rootScope.businessTab = '';
            $rootScope.consumerTab = '';
            $rootScope.newConsumerTab = 'active';
            $rootScope.aboutTab = '';
            $rootScope.contactTab = '';
            $rootScope.blogTab = '';
            $rootScope.itzfunApp = true;
            $rootScope.venuelyticsApp = false;
            $rootScope.panelShow = true;
        } else if(tab === 'about') {
            $rootScope.homeTab = '';
            $rootScope.businessTab = '';
            $rootScope.consumerTab = '';
            $rootScope.newConsumerTab = '';
            $rootScope.aboutTab = 'active';
            $rootScope.contactTab = '';
            $rootScope.blogTab = '';
            $rootScope.venuelyticsApp = false;
            $rootScope.itzfunApp = false;
            $rootScope.panelShow = false;
        } else if(tab === 'contact') {
            $rootScope.homeTab = '';
            $rootScope.businessTab = '';
            $rootScope.consumerTab = '';
            $rootScope.newConsumerTab = '';
            $rootScope.aboutTab = '';
            $rootScope.contactTab = 'active';
            $rootScope.blogTab = '';
            $rootScope.venuelyticsApp = false;
            $rootScope.itzfunApp = false;
            $rootScope.panelShow = false;
        } else if(tab === 'blog') {
            $rootScope.homeTab = '';
            $rootScope.businessTab = '';
            $rootScope.consumerTab = '';
            $rootScope.newConsumerTab = '';
            $rootScope.aboutTab = '';
            $rootScope.contactTab = '';
            $rootScope.blogTab = 'active';
            $rootScope.venuelyticsApp = false;
            $rootScope.itzfunApp = false;
            $rootScope.panelShow = false;
        } else {
            $log.info("Else block");
        }
    };

    $scope.$on('$locationChangeStart', function(event) {
        var userSelectedTab = $location.absUrl().split('/').pop().split('?');
        $rootScope.canonicalURL = $location.absUrl();
        self.navBar(userSelectedTab[0]);
    });
    self.init = function() {
        self.venueLyticsFeatures = APP_ARRAYS.features;

        var urlPattern = $location.absUrl();
        var data = urlPattern.split(".");
        if(data[1] === "itzfun") {
            $rootScope.facebook = APP_LINK.FACEBOOK_ITZFUN;
            $rootScope.twitter = APP_LINK.TWITTER_ITZFUN;
            $rootScope.instagram = APP_LINK.INSTAGRAM_ITZFUN;
            $location.url('/cities');
        } else {
            $rootScope.facebook = APP_LINK.FACEBOOK_VENUELYTICS;
            $rootScope.twitter = APP_LINK.TWITTER_VENUELYTICS;
            $rootScope.instagram = APP_LINK.INSTAGRAM_VENUELYTICS;
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
    }
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
