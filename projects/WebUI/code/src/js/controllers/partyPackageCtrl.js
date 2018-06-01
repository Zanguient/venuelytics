/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */
"use strict";
app.controller('PartyPackageController', ['$log', '$scope', '$location', 'DataShare', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', '$rootScope','ngMeta', 'VenueService',
    function ($log, $scope, $location,DataShare, $window, $routeParams, AjaxService, APP_ARRAYS, $rootScope,ngMeta, venueService) {


            var self = $scope;
            self.init = function() {
                
                self.venueDetails = venueService.getVenue($routeParams.venueId);
                self.venueId = self.venueDetails.id;
                $rootScope.blackTheme = venueService.getVenueInfo(self.venueId , 'ui.service.theme') || '';
                ngMeta.setTag('description', self.venueDetails.description + " Party Package");
                $rootScope.title = self.venueDetails.venueName + "Venuelytics - Party Package Services";
                ngMeta.setTitle($rootScope.title);
                $rootScope.serviceTabClear = false;
                var date = new Date();
                var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                $( "#partyDate" ).datepicker({autoclose:true, todayHighlight: true, startDate: today, minDate: 0, format: 'yyyy-mm-dd'});
                
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
                setTimeout(function() {
                    self.getSelectedTab();
                }, 600);
            };

            self.$watch('party.orderDate', function() {
                if (self.party.orderDate !== "") {
                    self.getPartyHall(self.venueID);
                }
            });
            self.getMenus = function() {
                AjaxService.getInfo(self.venueId).then(function(response) {
                    self.partyCateringMenu = response.data["PartyHall.cateringMenuUrl"];
                    self.partyMenu = response.data["PartyHall.Menu"];
                    self.partyInfoSheet = response.data["PartyHall.Details"];
                    self.partyVideo = response.data["PartyHall.Video"];
                    self.partyFloorPlan = response.data["PartyHall.FloorMap"];
                    self.enabledPayment = response.data["Advance.enabledPayment"];
                });
            };

            self.partyHallDescription = function(value) {
                $rootScope.partyDescription = value;
            };

            self.tabClear = function() {
                DataShare.partyServiceData = {};
                self.party = {};
                $rootScope.serviceName = '';
                self.party.orderDate = moment().format('YYYY-MM-DD');
            };

            self.getSelectedTab = function() {
                $(".service-btn .card").removeClass("tabSelected");
                $("#partyPackage > .partyBtn").addClass("tabSelected");
            };

            self.getEventType = function() {
                AjaxService.getTypeOfEvents(self.venueId, 'PartyHall').then(function(response) {
                    self.eventTypes = response.data;
                    
                  var selectedType;
                  angular.forEach(self.eventTypes, function(tmpType) {
                    if(tmpType.id === DataShare.partyServiceData.partyEventType.id) {
                      selectedType = tmpType;
                    }
                  });
                  if(selectedType) {
                    self.party.partyEventType = selectedType;
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
                AjaxService.getProductsByType(venueId, 'PartyHall').then(function(response) {
                    self.partyHall = response.data;
                    self.reservationData = [];
                    var partyDate = moment(self.party.orderDate).format('YYYYMMDD');
                    AjaxService.getVenueMapForADate(self.venueId,partyDate).then(function(response) {
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
               
                
                var dateValue = moment(self.party.orderDate, 'YYYY-MM-DD').format("YYYY-MM-DDTHH:mm:ss");
                var fullName = self.party.userFirstName + " " + self.party.userLastName;
                var authBase64Str = window.btoa(fullName + ':' + self.party.email + ':' + self.party.mobile);
                DataShare.partyServiceData = self.party;
                DataShare.authBase64Str = authBase64Str;
                self.serviceJSON = {
                  "serviceType": 'PartyPackageService',
                  "venueNumber": self.venueId,
                  "reason": self.party.partyEventType.name,
                  "contactNumber": self.party.mobile,
                  "contactEmail": self.party.email,
                  "contactZipcode": "",
                  "noOfGuests": self.party.totalGuest,
                  "noOfMaleGuests": 0,
                  "noOfFemaleGuests": 0,
                  "budget": 0,
                  
                  "serviceInstructions": self.party.instructions,
                  "status": "REQUEST",
                  "fulfillmentDate": dateValue,
                  "durationInMinutes": 0,
                  "deliveryType": "Pickup",
                  "order": {
                      "venueNumber": self.venueId,
                      "orderDate": dateValue,
                      "orderItems": []
                  }
                };

                var items = {
                            "venueNumber": self.venueId,
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
                $location.url("/confirmPartyPackage/" + self.selectedCity + "/" + self.venueId);
             };
            self.init();
    }]);
