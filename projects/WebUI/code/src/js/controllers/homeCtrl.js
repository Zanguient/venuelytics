/**
 * @author Saravanakumar K
 * @date 25-MAY-2017
 */
"use strict";
app.controller('HomeController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService','$translate',
    function ($log, $scope, $http, $location, RestURL, VenueService, $translate) {

    		$log.log('Inside Home Controller.');
    		
    		var self = $scope;

    		self.homeTab = 'active';

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


    		self.changeLanguage = function(lang){
   				$translate.use(lang); 
   			};
    }])	;