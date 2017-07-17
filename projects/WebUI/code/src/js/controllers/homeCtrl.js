/**
 * @author Saravanakumar K
 * @date 25-MAY-2017
 */
"use strict";
app.controller('HomeController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService','$translate', 'APP_CLIENTS', 'APP_ARRAYS', '$rootScope', 'AjaxService',
    function ($log, $scope, $http, $location, RestURL, VenueService, $translate, APP_CLIENTS, APP_ARRAYS, $rootScope, AjaxService) {

    		$log.log('Inside Home Controller.');
    		
    		var self = $scope;

    		$rootScope.homeTab = 'active';

            self.clientImages = APP_CLIENTS.clientImages;
            var data = $location.search().sb;
            self.showBusinessTab = parseInt(data);
            var newConsumer = $location.search().nc;
            self.showNewConsumer = parseInt(newConsumer);
            self.navBar = function(tab) {
                if(tab === 1) {
                    $rootScope.homeTab = 'active';
                    $rootScope.businessTab = '';
                    $rootScope.consumerTab = '';
                    $rootScope.newConsumerTab = '';
                } else if(tab === 2) {
                    $rootScope.homeTab = '';
                    $rootScope.businessTab = 'active';
                    $rootScope.consumerTab = '';
                    $rootScope.newConsumerTab = '';
                } else if(tab === 3) {
                    $rootScope.homeTab = '';
                    $rootScope.businessTab = '';
                    $rootScope.consumerTab = 'active';
                    $rootScope.newConsumerTab = '';
                } else {
                    $rootScope.homeTab = '';
                    $rootScope.businessTab = '';
                    $rootScope.consumerTab = '';
                    $rootScope.newConsumerTab = 'active';
                }
            };

            self.init = function() {

                self.venueLyticsFeatures = APP_ARRAYS.features;
                
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

            self.init();

    		self.changeLanguage = function(lang){
   				$translate.use(lang); 
   			};

            self.sendEmail = function(email) {
                var subscribeEmail = {
                    "email": email,
                     "utmSource" : "dev.webui.venuelytics.com",
                     "utmCampaign" :"homepage",
                     "utmMedium": "subscribe"
                }

                AjaxService.sendSubscriptionMail(subscribeEmail).then(function(response) {
                    alert('Successfully subscribed!');
                });
            };
    }])	;