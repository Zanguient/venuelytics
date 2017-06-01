/**
 * @author Saravanakumar K
 * @date 25-MAY-2017
 */
"use strict";
app.controller('HomeController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService','$translate', 'APP_CLIENTS',
    function ($log, $scope, $http, $location, RestURL, VenueService, $translate, APP_CLIENTS) {

    		$log.log('Inside Home Controller.');
    		
    		var self = $scope;

    		self.homeTab = 'active';

            self.clientImages = APP_CLIENTS.clientImages;

            self.navBar = function(tab) {
                if(tab === 1) {
                    self.homeTab = 'active';
                    self.businessTab = '';
                    self.consumerTab = '';
                } else if(tab === 2) {
                    self.homeTab = '';
                    self.businessTab = 'active';
                    self.consumerTab = '';
                } else {
                    self.homeTab = '';
                    self.businessTab = '';
                    self.consumerTab = 'active';
                }
            };

            self.init = function() {
                
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
    }])	;