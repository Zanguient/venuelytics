/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */
"use strict";
app.controller('PrivateEventController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', 'APP_COLORS', '$rootScope',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, APP_ARRAYS, APP_COLORS, $rootScope) {

    		$log.log('Inside PrivateEvent Controller.');

            var self = $scope;

            self.init = function() {
                self.venueID = self.venueid = $routeParams.venueid;
                self.getBanquetHall(self.venueID);
                self.getMenus();
                self.getEventType();
                $( "#privateDate" ).datepicker({autoclose:true, todayHighlight: true});
                self.private = DataShare.privateEventData;
                self.private.authorize = false;
                self.private.agree = false;
            };

            self.createPrivateEvent = function(value) {
                DataShare.tab = 'P';
                var fullName = self.private.privateFirstName + " " + self.private.privateLastName;
                var authBase64Str = window.btoa(fullName + ':' + self.private.privateEmail + ':' + self.private.privateMobileNumber);
                DataShare.privateEventData = self.private;
                DataShare.authBase64Str = authBase64Str;

                self.serviceJSON = {
                    "serviceType": 'BanquetHall',
                    "venueNumber": self.venueid,
                    "reason": self.occasion,
                    "contactNumber": self.private.privateMobileNumber,
                    "contactEmail": self.private.privateEmail,
                    "contactZipcode": null,
                    "noOfGuests": self.private.totalGuest,
                    "noOfMaleGuests": 0,
                    "noOfFemaleGuests": 0,
                    "budget": 0,
                    "hostEmployeeId": -1,
                    "hasBid": "N",
                    "bidStatus": null,
                    "serviceInstructions": self.private.privateComment,
                    "status": "REQUEST",
                    "serviceDetail": null,
                    "fulfillmentDate": self.private.date,
                    "durationInMinutes": 0,
                    "deliveryType": "Pickup",
                    "deliveryAddress": null,
                    "deliveryInstructions": null,
                    "rating": -1,
                    "ratingComment": null,
                    "ratingDateTime": null,
                    "order": {
                        "venueNumber": self.venueid,
                        "orderDate": self.private.date,
                        "orderItems": []
                    },
                    "prebooking": false,
                    "employeeName": "",
                    "visitorName": fullName
                };

                var items = {
                            "venueNumber": self.venueid,
                            "productId": value.id,
                            "productType": value.productType,
                            "quantity": value.size,
                            "comments": value.comments,
                            "name": value.name
                        };

                self.serviceJSON.order.orderItems.push(items);
                DataShare.payloadObject = self.serviceJSON;
                $location.url("/confirmEvent/" + self.selectedCity + "/" + self.venueid);
             };

             self.privateDescription = function() {
                self.desc = "Description";
             };

             self.privateEventDesc = function(value) {
                $rootScope.privateEventDescription = value;
             };

            self.getBanquetHall = function(venueId) {
                AjaxService.getPrivateEvent(venueId).then(function(response) {
                    $scope.privateEventValueArray = response.data;
                });
            };

            self.getMenus = function() {
                AjaxService.getInfo(self.venueid).then(function(response) {
                    self.privateMenu = response.data["BanquetHall.Menu"];
                    self.privateInfoSheet = response.data["BanquetHall.Details"];
                    self.privateVideo = response.data["BanqueHall.Video"];
                    self.privateFloorPlan = response.data["BanquetHall.FloorMap"];
                    self.bottleMenuUrl = response.data["Bottle.menuUrl"];
                    self.bottleVIPPolicy = response.data["Bottle.BottleVIPPolicy"];
                    self.dressCode =  response.data["Advance.dressCode"];
                    self.enabledPayment =  response.data["Advance.enabledPayment"];
                });
            };

            self.getEventType = function() {
                AjaxService.getTypeOfEvents(self.venueid).then(function(response) {
                    self.eventTypes = response.data;
                    if(DataShare.privateEventData !== '') {
                        $log.info("Inside datashare");
                        var selectedType;
                        angular.forEach(self.eventTypes, function(tmpType) {
                            if(tmpType.id === DataShare.privateEventData.privateEvent.id) {
                            selectedType = tmpType;
                            }
                        });
                        if(selectedType) {
                            self.private.privateEvent = selectedType;
                        }
                    }
                });
            };

            self.init();

    }]);
