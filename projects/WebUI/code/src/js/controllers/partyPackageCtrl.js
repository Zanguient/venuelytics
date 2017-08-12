/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */
"use strict";
app.controller('PartyPackageController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', 'APP_COLORS', '$rootScope',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, APP_ARRAYS, APP_COLORS, $rootScope) {


            var self = $scope;
            self.init = function() {
                $( "#partyDate" ).datepicker({autoclose:true, todayHighlight: true});
                self.venueID = $routeParams.venueid;
                self.getPartyHall(self.venueID);
                if($rootScope.serviceName === 'PartyPackages') {
                  DataShare.partyServiceData = {};
                }
                self.party = DataShare.partyServiceData;
                self.party.authorize = false;
                self.party.agree = false;
                self.totalGuest = DataShare.totalNoOfGuest;
                self.reservationTime = APP_ARRAYS.time;
                self.restoreTab = DataShare.tab;
                self.tabParam = $routeParams.tabParam;
                self.getMenus();
                self.getEventType();
            };

            self.party.orderDate = moment().format('DD/MM/YYYY');
            self.getMenus = function() {
                AjaxService.getInfo(self.venueid).then(function(response) {
                    self.partyCateringMenu = response.data["BanquetHall.cateringMenuUrl"];
                    self.partyMenu = response.data["BanquetHall.Menu"];
                    self.partyInfoSheet = response.data["BanquetHall.Details"];
                    self.partyVideo = response.data["BanqueHall.Video"];
                    self.partyFloorPlan = response.data["BanquetHall.FloorMap"];
                    self.enabledPayment = response.data["Advance.enabledPayment"];
                });
            };

            if(DataShare.partyFocus !== '') {
              self.partyFocus = DataShare.partyFocus;
            }

            self.partyEventDescription = function(value) {
                // $log.info("Value:", value);
                $rootScope.partyDescription = value;
            };

            self.getEventType = function() {
                AjaxService.getTypeOfEvents(self.venueid).then(function(response) {
                    self.eventTypes = response.data;
                    if(DataShare.partyServiceData !== '') {
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
                AjaxService.getPrivateEvent(venueId).then(function(response) {
                    $scope.partyHall = response.data;
                });
            };

            self.confirmPartyPackage = function(selectedParty) {
                DataShare.selectedVenuePrice = selectedParty.price;
                DataShare.partyFocus = 'is-focused';
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
                  "fulfillmentDate": self.party.orderDate,
                  "durationInMinutes": 0,
                  "deliveryType": "Pickup",
                  "deliveryAddress": null,
                  "deliveryInstructions": null,
                  "rating": -1,
                  "ratingComment": null,
                  "ratingDateTime": null,
                  "order": {
                      "venueNumber": self.venueid,
                      "orderDate": self.party.orderDate,
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
