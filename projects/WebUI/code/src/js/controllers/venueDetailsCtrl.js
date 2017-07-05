/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */
"use strict";
app.controller('VenueDetailsController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS',
    function ($log, $scope, $http, $location, RestURL, VenueService, $window, $routeParams, AjaxService, APP_ARRAYS) {

    		$log.log('Inside Venue Details Controller.');
    		
    		var self = $scope;

            self.init = function() {
                self.venueid = $routeParams.venueid;
                self.reservationTime = APP_ARRAYS.time;
                self.eventTypes = APP_ARRAYS.eventyType;
                AjaxService.getVenues(self.venueid,null,null).then(function(response) {
                    self.detailsOfVenue = response;
                    self.selectedCity = $routeParams.cityName;
                    //self.selectedType = VenueService.selectedVenueType;
                    self.venueName =    self.detailsOfVenue.venueName;
                    if($routeParams.serviceType === 'p' || $routeParams.serviceType === 'b' || $routeParams.serviceType === 'g') {
                        self.row = 1;
                    } else if($routeParams.serviceType === 't' || $routeParams.serviceType === 'f' || $routeParams.serviceType === 'd') {
                        self.row = 2;    
                    } else if($routeParams.serviceType === 'o' || $routeParams.serviceType === 'e'){
                        self.row = 4;
                    } else {
                        self.row = 1;
                    }
                    self.resevationURL = RestURL.adminURL+'reservation/'+self.detailsOfVenue.id + '?r=' + self.row + '&t=' + $routeParams.serviceType +'&i=y';
                    $log.info("Reservation URL: "+self.resevationURL);
                    iFrameResize({
                            log                     : false,                  // Enable console logging
                            inPageLinks             : false,
                            heightCalculationMethod: 'max',
                            widthCalculationMethod: 'min',
                            sizeWidth: false,
                            checkOrigin: false
                        });

                    $(function(){
                        $('#venueReservationFrame').on('load', function(){
                            $('#loadingVenueDetails').hide();
                            $(this).show();
                        });
                            
                    });

                });
            };

            self.totalGuest = 1;

            self.minus = function() {
                if(self.totalGuest > 1) {
                    self.totalGuest = self.totalGuest - 1;
                }
             };
            
            self.plus = function() {
                self.totalGuest = self.totalGuest + 1;
             };

             self.bottle = function(service) {
                $("#privateEventTab").css('background-color','white');
                $('#private').css('color', '#4caf50');
                $("#guestlistTab").css('background-color','white');
                $('#glist').css('color', '#4caf50');
                $("#bottleTab").css('background-color','#4caf50');
                $('#bottle').css('color', 'white');
                self.bottleServiceTab = true;
                self.eventServiceTab = false;
                self.guestServiceTab = false;
             };

             self.event = function(service) {
                $("#privateEventTab").css('background-color','#4caf50');
                $('#private').css('color', 'white');
                $("#guestlistTab").css('background-color','white');
                $('#glist').css('color', '#4caf50');
                $("#bottleTab").css('background-color','white');
                $('#bottle').css('color', '#4caf50');
                self.bottleServiceTab = false;
                self.eventServiceTab = true;
                self.guestServiceTab = false;
             };

             self.glist = function(service) {
                $("#privateEventTab").css('background-color','white');
                $('#private').css('color', '#4caf50');
                $("#guestlistTab").css('background-color','#4caf50');
                $('#glist').css('color', 'white');
                $("#bottleTab").css('background-color','white');
                $('#bottle').css('color', '#4caf50');
                self.bottleServiceTab = false;
                self.eventServiceTab = false;
                self.guestServiceTab = true;
             };

             self.confirmBottleService = function() {
                $scope.serviceJSON = {
                    "serviceType": 'Bottle',
                    "venueNumber": self.venueid,
                    "reason": self.occasion,
                    "contactNumber": self.mobile,
                    "contactEmail": self.email,
                    "contactZipcode": self.zipcode,
                    "noOfGuests": self.totalGuest,
                    "noOfMaleGuests": null,
                    "noOfFemaleGuests": null,
                    "budget": null,
                    "hostEmployeeId": null,
                    "hasBid": "N",
                    "bidStatus": null,
                    "serviceInstructions": $scope.specialInstruction,
                    "status": "REQUEST",
                    "serviceDetail": null,
                    "fulfillmentDate": $scope.startDate,
                    "durationInMinutes": 0,
                    "deliveryType": "Pickup",
                    "deliveryAddress": null,
                    "deliveryInstructions": null,
                    "rating": -1,
                    "ratingComment": null,
                    "ratingDateTime": null,
                    "order": {
                        "venueNumber": $scope.venueNumber,
                        "orderDate": $scope.startDate,
                        "orderItems": []
                    },
                    "prebooking": false,
                    "employeeName": "",
                    "visitorName": name
                };
             };

            self.init();
    		
    }]);