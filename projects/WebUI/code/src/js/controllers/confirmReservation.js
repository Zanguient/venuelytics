/**
 * @author Saravanakumar
 * @date 07-JULY-2017
 */
"use strict";
app.controller('ConfirmReservationController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService', '$window', '$routeParams',
    function ($log, $scope, $http, $location, RestURL, VenueService, $window, $routeParams) {

    		$log.log('Inside Confirm Reservation Controller.');
    		
    		var self = $scope;

            self.init = function() {
                self.editCity = $routeParams.cityName;
                self.editVenueID = $routeParams.venueid;
                self.userData = VenueService.bottleServiceData;
                self.guests = VenueService.totalNoOfGuest;
            };

            self.editConfirmPage = function() {
                $location.url("/venues/" + self.editCity + "/" + self.editVenueID);
            };

            self.init();
    		
    }]);