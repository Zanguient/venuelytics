"use strict";
app.controller('drinkServiceController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', 'APP_COLORS', '$rootScope',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, APP_ARRAYS, APP_COLORS, $rootScope) {

           var self = $scope;
            self.selectedDrinkItems = [];
            self.drinkType = 'Delivery';
            self.init = function() {
                self.venueid = $routeParams.venueid;
                self.selectedCity = $routeParams.cityName;
                if((Object.keys(DataShare.drinkServiceData).length) !== 0) {
                    self.drink = DataShare.drinkServiceData;
                    self.drinkType = $rootScope.serviceName;
                    self.userSelectedDrinks = DataShare.drinks;
                } 
                if(($rootScope.serviceName === 'DrinkService') || (DataShare.amount != '')) {
                    DataShare.drinkServiceData = {};
                    self.isDrinkFocused = '';
                    self.drink = {};
                    $rootScope.serviceName = '';
                    DataShare.foodService = [];
                    DataShare.drinks = '';
                    self.drinkType = 'Delivery';
                }
                self.getMenus();
                self.getDrink();
                self.getVenueType();
            };

            self.getMenus = function() {
                AjaxService.getInfo(self.venueid).then(function(response) {
                    self.drinksWineListuUrl = response.data["Drinks.wineListuUrl"];
            		    self.drinksHappyHourDrinkUrl = response.data["Drinks.happyHourDrinkUrl"];
            		    self.drinksBeerMenuUrl = response.data["Drinks.beerMenuUrl"];
            		    self.drinksMenuUrl = response.data["Drinks.menuUrl"];
            		    self.drinksCocktailsUrl = response.data["Drinks.cocktailsUrl"];
                    self.enabledPayment = response.data["Advance.enabledPayment"];
                });
            };

            if(DataShare.drinkFocused !== '') {
              $log.info("insdie focused");
              self.isDrinkFocused = DataShare.drinkFocused;
            }

            self.menuUrlSelection = function(menu) {
                var data = menu.split(".");
                var splitLength = data.length;
                if(data[0] === "www") {
                    menu = 'http://' + menu;
                    $window.open(menu, '_blank');
                } else if(data[splitLength-1] === "jpg" || data[splitLength-1] === "png") {
                    self.menuImageUrl = menu;
                    $('#drinkMenuModal').modal('show');
                } else {
                    $window.open(menu, '_blank');
                }
            };

            self.userSelectedDrinks = [];


            self.drinkService = function(item) {
                if(item.count !== undefined) {
                    if (self.userSelectedDrinks.indexOf(item) === -1) {
                        self.userSelectedDrinks.push(item);
                    }
                } 
                
                if (item.count === 0) {
                    var index = self.userSelectedDrinks.indexOf(item);
                    self.userSelectedDrinks.splice(index, 1);
                }
                DataShare.drinks = self.userSelectedDrinks;
            };

            self.getDrink = function() {
                AjaxService.getPrivateHalls(self.venueid, 'Drinks').then(function(response) {
                    self.drinkDetails = response.data;
                    if((Object.keys(DataShare.selectedDrinks).length) !== 0) {
                        self.editDrinkItems = DataShare.selectedDrinks;
                        angular.forEach(self.editDrinkItems, function(value,key) {
                          angular.forEach(self.drinkDetails, function(value1,key1) {
                              if(value.id == value1.id) {
                                self.drinkDetails.splice(key1, 1);
                              }
                          });
                        });
                        angular.forEach(self.drinkDetails, function(value2) {
                              self.editDrinkItems.push(value2);
                        });
                        self.drinkDetails = self.editDrinkItems;
                    }
                });
            };

            self.delivery = function(value) {
                self.drink = {};
            };

            self.pickUp = function(value) {
                self.drink = {};
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

            self.drinkSave = function() {
                DataShare.drinkFocused = 'is-focused';
                var parsedend = moment().format("MM-DD-YYYY");
                var date = new Date(moment(parsedend,'MM-DD-YYYY').format());
                var dateValue = moment(date).format("YYYY-MM-DDTHH:mm:ss");
                var fullName = self.drink.firstName + " " + self.drink.lastName;
                var authBase64Str = window.btoa(fullName + ':' + self.drink.emailId + ':' + self.drink.mobileNumber);
                DataShare.authBase64Str = authBase64Str;
                DataShare.drinkServiceData = self.drink;
                var tableNumber;
                if((self.drink.tableNumber) && (self.drink.seatNumber)) {
                    tableNumber = self.drink.tableNumber+ "-" + self.drink.seatNumber;
                } else if(self.drink.tableNumber) {
                    tableNumber = self.drink.tableNumber;
                } else {
                    tableNumber = self.drink.laneNumber;
                }
                self.serviceJSON = {
                  "serviceType": 'Drinks',
                  "venueNumber": self.venueid,
                  "reason": "",
                  "contactNumber": self.drink.mobileNumber,
                  "contactEmail": self.drink.emailId,
                  "contactZipcode": "",
                  "noOfGuests": 0,
                  "noOfMaleGuests": 0,
                  "noOfFemaleGuests": 0,
                  "budget": 0,
                  "hostEmployeeId": -1,
                  "hasBid": "N",
                  "bidStatus": null,
                  "serviceInstructions": self.drink.instructions,
                  "status": "REQUEST",
                  "serviceDetail": null,
                  "fulfillmentDate": dateValue,
                  "durationInMinutes": 0,
                  "deliveryType": self.drinkType,
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
                angular.forEach(self.drinkDetails, function(value, key) {
                    if(value.count) {
                        var items = {
                        "venueNumber": self.venueid,
                        "productId": value.id,
                        "productType": value.productType,
                        "quantity": value.count,
                        "name": value.name
                    };
                    value.price = value.price * value.count;
                    self.selectedDrinkItems.push(value);
                    self.serviceJSON.order.orderItems.push(items);
                  } 
                });
                $rootScope.serviceName = self.drinkType;
                DataShare.payloadObject = self.serviceJSON;
                DataShare.venueName = self.venueName;
                DataShare.enablePayment = self.enabledPayment;
                DataShare.selectedDrinks = self.selectedDrinkItems;
                $location.url("/confirmDrinkService/" + self.selectedCity + "/" + self.venueid);
             };
            self.init();
    }]);
