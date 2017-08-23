/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */
"use strict";
app.controller('PartyPackageController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', 'APP_COLORS', '$rootScope',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, APP_ARRAYS, APP_COLORS, $rootScope) {


            var self = $scope;
            self.partyDateIsFocused = 'is-focused';
            self.init = function() {
                $rootScope.serviceTabClear = false;
                var date = new Date();
                var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                $( "#partyDate" ).datepicker({autoclose:true, todayHighlight: true, startDate: today, minDate: 0});
                self.venueID = $routeParams.venueid;
                if((Object.keys(DataShare.partyServiceData).length) !== 0) {
                    self.party = DataShare.partyServiceData;
                } else {
                    self.tabClear();
                }
                if($rootScope.serviceName === 'PartyPackages') {
                    self.tabClear();
                } 
                self.party.authorize = false;
                self.party.agree = false;
                self.totalGuest = DataShare.totalNoOfGuest;
                self.reservationTime = APP_ARRAYS.time;
                self.restoreTab = DataShare.tab;
                self.tabParam = $routeParams.tabParam;
                self.getMenus();
                self.getEventType();
            };

            self.$watch('party.orderDate', function() {
                if (self.party.orderDate !== "") {
                    self.getPartyHall(self.venueID);
                }
            });
            self.getMenus = function() {
                AjaxService.getInfo(self.venueid).then(function(response) {
                    self.partyCateringMenu = response.data["PartyHall.cateringMenuUrl"];
                    self.partyMenu = response.data["PartyHall.Menu"];
                    self.partyInfoSheet = response.data["PartyHall.Details"];
                    self.partyVideo = response.data["PartyHall.Video"];
                    self.partyFloorPlan = response.data["PartyHall.FloorMap"];
                    self.enabledPayment = response.data["Advance.enabledPayment"];
                });
            };

            if(DataShare.partyFocus !== '') {
              self.partyFocus = DataShare.partyFocus;
            }

            self.partyHallDescription = function(value) {
                $rootScope.partyDescription = value;
            };

            self.tabClear = function() {
                DataShare.partyServiceData = {};
                DataShare.partyFocus = '';
                self.party = {};
                self.partyFocus = '';
                $rootScope.serviceName = '';
                self.party.orderDate = moment().format('MM/DD/YYYY');
            };

            self.getEventType = function() {
                AjaxService.getTypeOfEvents(self.venueid, 'PartyHall').then(function(response) {
                    self.eventTypes = response.data;
                    if(DataShare.partyFocus !== '') {
                      var selectedType;
                      angular.forEach(self.eventTypes, function(tmpType) {
                        if(tmpType.id === DataShare.partyServiceData.partyEventType.id) {
                          selectedType = tmpType;
                        }
                      });
                      if(selectedType) {
                        self.party.partyEventType = selectedType;
                      }
                    }
                });
            };

            self.menuUrlSelection = function(menu) {
                var data = menu.split(".");
                var splitLength = data.length;
                if(data[0] === "www") {
                    menu = 'http://' + menu;
                    $window.open(menu, '_blank');
                } else if(data[splitLength-1] === "jpg" || data[splitLength-1] === "png") {
                    self.menuImageUrl = menu;
                    $('#menuModal').modal('show');
                } else {
                    $window.open(menu, '_blank');
                }
            };

            self.getPartyHall = function(venueId) {
                AjaxService.getPrivateHalls(venueId, 'PartyHall').then(function(response) {
                    self.partyHall = response.data;
                    self.partyDescription = response.data[0].description;
                    self.reservationData = [];
                    var partyDate = moment(self.party.orderDate).format('YYYYMMDD');
                    AjaxService.getVenueMapForADate(self.venueid,partyDate).then(function(response) {
                        self.reservations = response.data;
                        angular.forEach(self.partyHall, function(value, key) {
                            value.reserve = false;
                        });
                        angular.forEach(self.partyHall, function(value1, key1) {
                            angular.forEach(self.reservations, function(value2, key2) {
                                if(value1.id === value2.productId) {
                                    value1.reserve = true;
                                } 
                            });
                        });
                    });
                });
            };

            self.confirmPartyPackage = function(selectedParty) {
                $rootScope.serviceTabClear = true;
                DataShare.selectedVenuePrice = selectedParty.price;
                DataShare.partyFocus = 'is-focused';
                var date = new Date(self.party.orderDate);
                var newDate = date.toISOString();
                var parsedend = moment(newDate).format("MM-DD-YYYY");
                date = new Date(moment(parsedend,'MM-DD-YYYY').format());
                var dateValue = moment(date).format("YYYY-MM-DDTHH:mm:ss");
                $log.info("Party price:", DataShare.selectedVenuePrice);
                var fullName = self.party.userFirstName + " " + self.party.userLastName;
                var authBase64Str = window.btoa(fullName + ':' + self.party.email + ':' + self.party.mobile);
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
                  
                  "serviceInstructions": self.party.instructions,
                  "status": "REQUEST",
                  "serviceDetail": null,
                  "fulfillmentDate": dateValue,
                  "durationInMinutes": 0,
                  "deliveryType": "Pickup",
                  "order": {
                      "venueNumber": self.venueid,
                      "orderDate": dateValue,
                      "orderItems": []
                  }
                };

                var items = {
                            "venueNumber": self.venueid,
                            "productId": selectedParty.id,
                            "productType": selectedParty.productType,
                            "quantity": selectedParty.size,
                            "comments": selectedParty.comments,
                            "name": selectedParty.name
                        };
                self.serviceJSON.order.orderItems.push(items);
                DataShare.payloadObject = self.serviceJSON;
                DataShare.venueName = self.venueName;
                DataShare.enablePayment = self.enabledPayment;
                DataShare.privateOrderItem = selectedParty;
                $location.url("/confirmPartyPackage/" + self.selectedCity + "/" + self.venueid);
             };
            self.init();
    }]);
