/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */
"use strict";
app.controller('PartyPackageController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', 'APP_COLORS', '$rootScope',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, APP_ARRAYS, APP_COLORS, $rootScope) {

            $log.log('Inside Bottle Service Controller.');

            var self = $scope;

            self.selectionTableItems = [];
            self.bottleCount = 1;
            $scope.selectedVenueMap = {};
            self.bottleMinimum = [];
            self.init = function() {
                $( "#partyDate" ).datepicker({autoclose:true, todayHighlight: true});
                self.venueID = $routeParams.venueid;
                self.getBanquetHall(self.venueID);
                if($rootScope.serviceName == 'PartyPackages') {
                  DataShare.partyServiceData = '';
                }
                self.party = DataShare.partyServiceData;
                self.totalGuest = DataShare.totalNoOfGuest;
                self.reservationTime = APP_ARRAYS.time;
                self.restoreTab = DataShare.tab;
                self.tabParam = $routeParams.tabParam;
                self.getBottleProducts();
                self.getMenus();
                self.getEventType();

                AjaxService.getVenues($routeParams.venueid,null,null).then(function(response) {
                    self.detailsOfVenue = response;
                    self.selectedCity = $routeParams.cityName;
                    self.venueName =    self.detailsOfVenue.venueName;
                });
                self.imageParam = $location.search().i;
                if(self.imageParam === 'Y') {
                    self.venueImage = self.detailsOfVenue.imageUrls[0].largeUrl;
                }
            };


                self.startDate = moment().format('YYYY-MM-DD');
                self.$watch('bottle.requestedDate', function() {
                    if((self.bottle.requestedDate !== "") || (self.bottle.requestedDate !== undefined)) {
                            if(self.bottle.requestedDate) {
                                self.startDate = moment(self.bottle.requestedDate).format('YYYY-MM-DD');
                            }
                        }
                    });

            self.getBottleProducts = function() {
                AjaxService.getProductOfBottle(self.venueid).then(function(response) {
                    self.allBottle = response.data;
                });
            };

            self.getMenus = function() {
                AjaxService.getInfo(self.venueid).then(function(response) {
                    self.bottleMenuUrl = response.data["Bottle.menuUrl"];
                    self.bottleVIPPolicy = response.data["Bottle.BottleVIPPolicy"];
                    self.dressCode =  response.data["Advance.dressCode"];
                    self.enabledPayment =  response.data["Advance.enabledPayment"];
                    self.reservationFee =  response.data["Bottle.BottleReservationFee"];
                });
            };

            self.partyEventDesc = function(value) {
                $rootScope.description1 = value;
            };

            self.getEventType = function() {
                AjaxService.getTypeOfEvents(self.venueid).then(function(response) {
                    self.eventTypes = response.data;
                    if((Object.keys(self.party).length) !== 0) {
                      self.eventTypes.push(self.party.partyEventType);
                    }
                });
            };

            self.menuUrlSelection = function(bottleMenu) {
                var data = bottleMenu.split(".");
                var splitLength = data.length;
                if(data[0] === "www") {
                    bottleMenu = 'http://' + bottleMenu;
                    $window.open(bottleMenu, '_blank');
                } else if(data[splitLength-1] === "jpg" || data[splitLength-1] === "png") {
                    self.menuImageUrl = bottleMenu;
                    $('#menuModal').modal('show');
                } else {
                    $window.open(bottleMenu, '_blank');
                }
            };

            self.getBanquetHall = function(venueId) {
                AjaxService.getPrivateEvent(venueId).then(function(response) {
                    $scope.privateEventValueArray = response.data;
                });
            };

            self.confirmPartyPackage = function(selectedParty) {
                DataShare.selectedVenuePrice = selectedParty.price;

                $log.info("Party price:", DataShare.selectedVenuePrice);
                var fullName = self.party.userFirstName + " " + self.party.userLastName;
                var authBase64Str = window.btoa(fullName + ':' + self.email + ':' + self.mobile);
                DataShare.partyServiceData = self.party;
                DataShare.authBase64Str = authBase64Str;
                self.serviceJSON = {
                  "serviceType": 'PartyPackageService',
                  "venueNumber": self.venueid,
                  "reason": self.party.partyEventType.name,
                  "contactNumber": self.party.mobile,
                  "contactEmail": self.party.email,
                  "contactZipcode": "",
                  "noOfGuests": self.party.totalGuest,
                  "noOfMaleGuests": 0,
                  "noOfFemaleGuests": 0,
                  "budget": 0,
                  "hostEmployeeId": -1,
                  "hasBid": "N",
                  "bidStatus": null,
                  "serviceInstructions": self.party.instructions,
                  "status": "REQUEST",
                  "serviceDetail": null,
                  "fulfillmentDate": self.party.date,
                  "durationInMinutes": 0,
                  "deliveryType": "Pickup",
                  "deliveryAddress": null,
                  "deliveryInstructions": null,
                  "rating": -1,
                  "ratingComment": null,
                  "ratingDateTime": null,
                  "order": {
                      "venueNumber": self.venueid,
                      "orderDate": self.party.date,
                      "orderItems": []
                  },
                  "prebooking": false,
                  "employeeName": "",
                  "visitorName": fullName
                };
                DataShare.payloadObject = self.serviceJSON;
                DataShare.venueName = self.venueName;
                DataShare.enablePayment = self.enabledPayment;
                $location.url("/confirmPartyPackage/" + self.selectedCity + "/" + self.venueid);
             };
            self.init();
    }]);
