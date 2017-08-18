"use strict";
app.controller('foodServiceController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', 'APP_COLORS', '$rootScope',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, APP_ARRAYS, APP_COLORS, $rootScope) {

            $log.log('Inside Food Service Controller.');

            var self = $scope;
            self.selectedFoodItems = [];
            self.foodType = 'Delivery';
            self.init = function() {
                self.venueid = $routeParams.venueid;
                if((Object.keys(DataShare.foodServiceData).length) !== 0) {
                    self.food = DataShare.foodServiceData;
                    self.foodType = $rootScope.serviceName;
                }
                self.getMenus();
                self.getFood();
                self.getVenueType();
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
                    self.enabledPayment =  response.data["Advance.enabledPayment"];
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
                    //$('#foodMenuModal').modal('show');
                    $window.open(menu, '_blank');
                } else {
                    $window.open(menu, '_blank');
                }
            };

            self.getFood = function() {
                AjaxService.getPrivateHalls(self.venueid, 'Food').then(function(response) {
                    self.foodDetails = response.data;
                });
            };

            self.delivery = function(value) {
                self.food = {};
            };

            self.pickUp = function(value) {
                self.food = {};
            };

            self.getVenueType = function() {
                AjaxService.getVenues(self.venueid,null,null).then(function(response) {
                    self.venueType = response.venueType;
                    var venueTypeSplit = self.venueType.split(',');
                    angular.forEach(venueTypeSplit, function(value1) {
                          var value = value1.trim();
                          if (value == 'CLUB') {
                              self.venueTypesClub = value;
                          } else if (value == 'BAR') {
                              self.venueTypesBar = value;
                          } else if (value == 'LOUNGE') {
                              self.venueTypesLounge = value;
                          } else if (value == 'BOWLING') {
                              self.venueTypeBowling = value;
                          } else if (value == 'CASINO') {
                              self.venueTypeCasino = value;
                          } else if (value == 'RESTAURANT') {
                              self.venueTypeRestaurant = value;
                          } else {}
                    });
                });
            };

            self.foodSave = function() {
                var parsedend = moment().format("MM-DD-YYYY");
                var date = new Date(moment(parsedend,'MM-DD-YYYY').format());
                var dateValue = moment(date).format("YYYY-MM-DDTHH:mm:ss");
                var fullName = self.food.firstName + " " + self.food.lastName;
                var authBase64Str = window.btoa(fullName + ':' + self.food.emailId + ':' + self.food.mobileNumber);
                DataShare.authBase64Str = authBase64Str;
                DataShare.foodServiceData = self.food;
                var tableNumber;
                if((self.food.tableNumber) && (self.food.seatNumber)) {
                    tableNumber = self.food.tableNumber+ "-" + self.food.seatNumber;
                } else if(self.food.tableNumber) {
                    tableNumber = self.food.tableNumber;
                } else {
                    tableNumber = self.food.laneNumber;
                }
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
                  "fulfillmentDate": dateValue,
                  "durationInMinutes": 0,
                  "deliveryType": self.foodType,
                  "deliveryAddress": tableNumber,
                  "deliveryInstructions": null,
                  "rating": -1,
                  "ratingComment": null,
                  "ratingDateTime": null,
                  "order": {
                      "venueNumber": self.venueid,
                      "orderDate": dateValue,
                      "orderItems": []
                  },
                  "prebooking": false,
                  "employeeName": "",
                  "visitorName": fullName
                };
                angular.forEach(self.foodDetails, function(value, key) {
                    if(value.count) {
                        var items = {
                        "venueNumber": self.venueid,
                        "productId": value.id,
                        "productType": value.productType,
                        "quantity": value.count,
                        "name": value.name
                    };
                    self.selectedFoodItems.push(value);
                    self.serviceJSON.order.orderItems.push(items);
                  } 
                });
                $rootScope.serviceName = self.foodType;
                DataShare.payloadObject = self.serviceJSON;
                DataShare.venueName = self.venueName;
                DataShare.enablePayment = self.enabledPayment;
                DataShare.selectedFoods = self.selectedFoodItems;
                $location.url("/confirmFoodService/" + self.selectedCity + "/" + self.venueid);
             };
            self.init();
    }]);
