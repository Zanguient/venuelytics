/**
 * @author Saravanakumar
 * @date 07-JULY-2017
 */
"use strict";
app.controller('PrivateReservationController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService', '$window', '$routeParams',
    function ($log, $scope, $http, $location, RestURL, VenueService, $window, $routeParams) {

    		$log.log('Inside Private Reservation Controller.');
    		
    		var self = $scope;

            self.init = function() {
                self.editCity = $routeParams.cityName;
                self.editVenueID = $routeParams.venueid;
                self.privateEventData = VenueService.privateEventData;
                self.guests = VenueService.totalNoOfGuest;
            };

            self.editPrivatePage = function() {
                $location.url("/venues/" + self.editCity + "/" + self.editVenueID);
            };

            self.init();
    		
    }]);