/**
 * @author K.Saravanakumar
 * @date 28-JULY-2017
 */
"use strict";
app.controller('OrderConfirmController', ['$log', '$scope', '$location', 'DataShare','$translate', 'APP_ARRAYS', '$rootScope', 'AjaxService', '$routeParams', 'ngMeta', 'VenueService',
    function ($log, $scope, $location, DataShare, $translate, APP_ARRAYS, $rootScope, AjaxService, $routeParams, ngMeta, venueService) {

    		$log.log('Inside Order confirm Controller.');

    		var self = $scope;
    		
			self.venueID = $routeParams.venueId;
			self.venueDetails = venueService.getVenue($routeParams.venueId);
			$rootScope.description = self.venueDetails.description;
			self.selectedCityName = self.venueDetails.city;
			ngMeta.setTag('description', self.venueDetails.description + " Bottle Order Confirmation");
			$rootScope.title = self.venueDetails.venueName+' '+self.selectedCityName+' '+self.venueDetails.state + " Venuelytics - Bottle Services Confirmation";
			ngMeta.setTitle($rootScope.title);
        	self.backToReservation = function() {
				$rootScope.serviceName = 'BottleService';
				DataShare.editBottle = 'false';
            	$location.url('/cities/' + self.selectedCityName + '/' + self.venueID + '/bottle-service');
        	};
    }]);
