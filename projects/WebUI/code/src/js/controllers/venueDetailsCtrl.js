/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */
"use strict";
app.controller('VenueDetailsController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS',
    function ($log, $scope, $http, $location, RestURL, VenueService, $window, $routeParams, AjaxService, APP_ARRAYS) {

    		$log.log('Inside Venue Details Controller.');
    		
    		var self = $scope;
            self.test = {};
            self.private = {};
            self.init = function() {
                self.venueid = $routeParams.venueid;
                self.reservationTime = APP_ARRAYS.time;
                self.eventTypes = APP_ARRAYS.eventyType;
                self.getBanquetHall(self.venueid);
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

            self.getBanquetHall = function(venueId) {
                AjaxService.getPrivateEvent(venueId).then(function(response) {
                    $scope.privateEventValueArray = response.data;
                });
            }

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

             self.glistSave = function(test) {
                var name = test.guestFirstName + " " + test.guestLastName;
                var authBase64Str = window.btoa(name + ':' + test.guestEmailId + ':' + test.guestMobileNumber);
                var object = {
                     "venueNumber" : VenueService.venueNumber,
                     "email" : test.guestEmailId,
                     "phone" : test.guestMobileNumber,
                     "zip" : test.guestZip,
                     "eventDay" : test.guestStartDate,
                     "totalCount" : self.totalGuest,
                     "maleCount" : test.guestMen,
                     "femaleCount" : test.guestWomen,
                     "visitorName" : name
                }
                AjaxService.createGuestList(VenueService.venueNumber, object, authBase64Str).then(function(response) {
                    //$log.info("GuestList response: "+angular.toJson(response));
                    self.test={};
                    self.totalGuest = 1;
                    $('#guestListModal').modal('show');
                });
             }

             self.privateSave = function(value) {
           /*     var name = self.privateFirstName + " " + self.privateLastName;
                var authBase64Str = window.btoa(name + ':' + self.privateEmail + ':' + self.privateMobileNumber);
                var object = {
                    "serviceType": 'BanquetHall',
                    "venueNumber": VenueService.venueNumber,
                    "reason": self.privateEvent,
                    "contactNumber": self.privateMobileNumber,
                    "contactEmail": self.privateEmail,
                "contactZipcode": "",
            "noOfGuests": self.totalGuest,
            //"noOfMaleGuests": $scope.privateNoOfMen,
            //"noOfFemaleGuests": $scope.privateNoOfWomen,
            "budget": self.privateBudget,
            "hostEmployeeId": -1,
            "hasBid": "N",
            "bidStatus": "",
            "serviceInstructions": self.privateComment,
            "status": "REQUEST",
            "serviceDetail": null,
            "fulfillmentDate": self.privateStartDate,
            "durationInMinutes": null,
            "deliveryType": "Pickup",
            "deliveryAddress": null,
            "deliveryInstructions": null,
            "rating": -1,
            "ratingComment": null,
            "ratingDateTime": null,
            "order": {
                "venueNumber": VenueService.venueNumber,
                "orderDate": self.privateStartDate,
                "orderItems": []
            },
            "prebooking": false,
            "employeeName": "",
            "visitorName": name
        }
        if(value.size == '-') {
          value.size = 0;
        }
        if(value != '') {
          var items = {
                    "venueNumber": VenueService.venueNumber,
                    "productId": value.productId,
                    "productType": value.productType,
                    "quantity": value.size,
                    "name": "private room"
                }

         object.order.orderItems.push(items);
        }

                AjaxService.createPrivateEvent(VenueService.venueNumber, object, authBase64Str).then(function(response) {                    $('#privateEventModal').modal('show');
                });*/
             }

             self.confirmBottleService = function() {

                var fullName = self.userFirstName + " " + self.userLastName;
                var authBase64Str = window.btoa(fullName + ':' + self.email + ':' + self.mobile);
                $log.info("Full name->", fullName);

                self.serviceJSON = {
                    "serviceType": 'Bottle',
                    "venueNumber": self.venueid,
                    "reason": self.occasion,
                    "contactNumber": self.mobile,
                    "contactEmail": self.email,
                    "contactZipcode": self.zipcode,
                    "noOfGuests": self.totalGuest,
                    "noOfMaleGuests": 0,
                    "noOfFemaleGuests": 0,
                    "budget": 0,
                    "hostEmployeeId": -1,
                    "hasBid": "N",
                    "bidStatus": null,
                    "serviceInstructions": self.instructions,
                    "status": "REQUEST",
                    "serviceDetail": null,
                    "fulfillmentDate": self.date,
                    "durationInMinutes": 0,
                    "deliveryType": "Pickup",
                    "deliveryAddress": null,
                    "deliveryInstructions": null,
                    "rating": -1,
                    "ratingComment": null,
                    "ratingDateTime": null,
                    "order": {
                        "venueNumber": self.venueid,
                        "orderDate": self.date,
                        "orderItems": []
                    },
                    "prebooking": false,
                    "employeeName": "",
                    "visitorName": fullName
                };
                $log.info("Service JSON->", angular.toJson(self.serviceJSON));

                AjaxService.createBottleService(self.venueid, self.serviceJSON, authBase64Str).then(function(response) {
                    $log.info("Bottle response: "+angular.toJson(response));
                    $('#bottleServiceModal').modal('show');
                });

             };

             self.createPrivateEvent = function() {

                var fullName = self.private.privateFirstName + " " + self.private.privateLastName;
                var authBase64Str = window.btoa(fullName + ':' + self.email + ':' + self.mobile);
                $log.info("Full name->", fullName);

                self.serviceJSON = {
                    "serviceType": 'BanquetHall',
                    "venueNumber": self.venueid,
                    "reason": self.occasion,
                    "contactNumber": self.private.privateMobileNumber,
                    "contactEmail": self.private.privateEmail,
                    "contactZipcode": self.zipcode,
                    "noOfGuests": self.totalGuest,
                    "noOfMaleGuests": 0,
                    "noOfFemaleGuests": 0,
                    "budget": 0,
                    "hostEmployeeId": -1,
                    "hasBid": "N",
                    "bidStatus": null,
                    "serviceInstructions": self.instructions,
                    "status": "REQUEST",
                    "serviceDetail": null,
                    "fulfillmentDate": self.date,
                    "durationInMinutes": 0,
                    "deliveryType": "Pickup",
                    "deliveryAddress": null,
                    "deliveryInstructions": null,
                    "rating": -1,
                    "ratingComment": null,
                    "ratingDateTime": null,
                    "order": {
                        "venueNumber": self.venueid,
                        "orderDate": self.date,
                        "orderItems": []
                    },
                    "prebooking": false,
                    "employeeName": "",
                    "visitorName": fullName
                };

                AjaxService.createBottleService(self.venueid, self.serviceJSON, authBase64Str).then(function(response) {
                    $log.info("Bottle response: "+angular.toJson(response));
                    $('#privateEventModal').modal('show');
                });

             };

            self.init();
    		
    }]);