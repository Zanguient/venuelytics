"use strict";
app.controller('foodServiceController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', 'APP_COLORS', '$rootScope',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, APP_ARRAYS, APP_COLORS, $rootScope) {

            $log.log('Inside Food Service Controller.');

            var self = $scope;

            self.selectionTableItems = [];
            self.bottleCount = 1;
            $scope.selectedVenueMap = {};
            self.bottleMinimum = [];
            self.init = function() {
                $( "#partyDate" ).datepicker({autoclose:true, todayHighlight: true});
                self.venueID = $routeParams.venueid;
                //self.getBanquetHall(self.venueID);
                if($rootScope.serviceName == 'PartyPackages') {
                  DataShare.partyServiceData = '';
                }
                //self.party = DataShare.partyServiceData;
                //self.totalGuest = DataShare.totalNoOfGuest;
                //self.reservationTime = APP_ARRAYS.time;
                self.restoreTab = DataShare.tab;
                self.tabParam = $routeParams.tabParam;
                self.getBottleProducts();
                self.getMenus();
                //self.getEventType();

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
                    self.foodBreakFastUrl = response.data["Food.breakFastUrl"];
                    self.foodBranchUrl = response.data["Food.brunchUrl"];
                    self.foodStartersUrl = response.data["Food.startersUrl"];
                    self.foodMenuUrl = response.data["Food.menuUrl"];
                    self.foodHappyHourUrl = response.data["Food.happyHourUrl"];
                    self.foodDinnerUrl = response.data["Food.dinnerUrl"];
                    self.foodLunchUrl = response.data["Food.lunchUrl"];
                    self.foodDessertsUrl = response.data["Food.dessertsUrl"];
                    self.foodAppetizsersUrl = response.data["Food.appetizsersUrl"];
                    self.foodGlutenfree = response.data["Food.glutenfree"];
                });
            };

            self.minusValue = function() {
                if(self.foodCount > 0) {
                self.foodCount--;
                }
            };

            self.addValue = function() {
                self.foodCount++;
            };

            self.menuUrlSelection = function(menu) {
                var data = menu.split(".");
                var splitLength = data.length;
                if(data[0] === "www") {
                    menu = 'http://' + menu;
                    $window.open(menu, '_blank');
                } else if(data[splitLength-1] === "jpg" || data[splitLength-1] === "png") {
                    self.menuImageUrl = menu;
                    //$('#foodMenuModal').modal('show');
                    $window.open(menu, '_blank');
                } else {
                    $window.open(menu, '_blank');
                }
            };

            self.foodSave = function() {
                self.date = moment().format('YYYY-MM-DD');
                var fullName = self.food.firstName + " " + self.food.lastName;
                var authBase64Str = window.btoa(fullName + ':' + self.food.emailId + ':' + self.food.mobileNumber);
                DataShare.authBase64Str = authBase64Str;
                DataShare.foodServiceData = self.food;
                self.serviceJSON = {
                  "serviceType": 'Food',
                  "venueNumber": self.venueid,
                  "reason": "",
                  "contactNumber": self.food.mobileNumber,
                  "contactEmail": self.food.emailId,
                  "contactZipcode": "",
                  "noOfGuests": 0,
                  "noOfMaleGuests": 0,
                  "noOfFemaleGuests": 0,
                  "budget": 0,
                  "hostEmployeeId": -1,
                  "hasBid": "N",
                  "bidStatus": null,
                  "serviceInstructions": self.food.instructions,
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
                DataShare.payloadObject = self.serviceJSON;
                DataShare.venueName = self.venueName;
                DataShare.enablePayment = self.enabledPayment;
                $location.url("/confirmFoodService/" + self.selectedCity + "/" + self.venueid);
             };
            self.init();
    }]);
