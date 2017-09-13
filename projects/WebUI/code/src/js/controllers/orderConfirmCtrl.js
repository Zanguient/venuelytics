/**
 * @author K.Saravanakumar
 * @date 28-JULY-2017
 */
"use strict";
app.controller('OrderConfirmController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare','$translate', 'APP_ARRAYS', '$rootScope', 'AjaxService', '$routeParams',
    function ($log, $scope, $http, $location, RestURL, DataShare, $translate, APP_ARRAYS, $rootScope, AjaxService, $routeParams) {

    		$log.log('Inside Order confirm Controller.');

    		var self = $scope;
    		self.selectedCityName = $routeParams.cityName;
            self.venueID = $routeParams.venueid;
        	self.backToReservation = function() {
				$rootScope.serviceName = 'BottleService';
				DataShare.editBottle = 'false';
            	$location.url('/newCities/' + self.selectedCityName + '/' + self.venueID + '/bottle-service');
        	};
    }]);
