"use strict";
app.controller('foodServiceController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', 'APP_COLORS', '$rootScope','ngMeta',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, APP_ARRAYS, APP_COLORS, $rootScope, ngMeta) {

            $log.log('Inside Food Service Controller.');

            var self = $scope;
            self.selectedFoodItems = [];
            self.selectedFoodList = [];
            self.foodType = 'Delivery';
            self.init = function() {
                self.venudetails = DataShare.venueFullDetails;
                ngMeta.setTag('description', self.venudetails.description + " Food Services");
                $rootScope.title = self.venudetails.venueName+' '+$routeParams.cityName+' '+self.venudetails.state+' '+ "Venuelytics - Food Services";
                ngMeta.setTitle(self.venudetails.venueName+' '+$routeParams.cityName+' '+self.venudetails.state+' '+ "Venuelytics - Food Services");
                self.venueid = $routeParams.venueid;
                self.selectedCity = $routeParams.cityName;
                $rootScope.serviceTabClear = false;
                if(($rootScope.serviceName === 'FoodService') || (DataShare.amount !== '')) {
                    self.tabClear();
                }
                if((Object.keys(DataShare.foodServiceData).length) !== 0) {
                    self.food = DataShare.foodServiceData;
                    self.foodType = DataShare.serviceTypes;
                    self.selectedFoodList = DataShare.foodService;
                } else {
                    self.tabClear();
                }
                self.getMenus();
                self.getFood();
                self.getVenueType();
                setTimeout(function() {
                    self.getSelectedTab();
                }, 600);
            };

            self.tabClear = function() {
                DataShare.foodServiceData = {};
                self.isFoodFocused = '';
                self.food = {};
                DataShare.serviceTypes = '';
                DataShare.foodService = '';
                self.foodType = 'Delivery';
                DataShare.selectedFoods = '';
            };

            self.getSelectedTab = function() {
                $("em").hide();
                $("#foodServices").show();
            };

            self.removeFoodItems = function(index,obj) {
                self.selectedFoodList.splice(index,1);
                angular.forEach(self.foodDetails, function(value,key) {
                  if(obj.id === value.id) {
                      value.count = '';
                  }
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
                    self.enabledPayment = response.data["Advance.enabledPayment"];
                    self.foodPickup = response.data["Food.FoodPickup.enable"];
                    self.specificFood = response.data["Food.SpecificServiceFood.enable"];
                    self.preOrder = response.data["Food.PreOrdering.enable"];
                    if((self.preOrder === 'N') || (self.preOrder === 'n' )){
                        self.orderDisable = true;
                    }
                });
            };

            if(DataShare.foodFocused !== '') {
              self.isFoodFocused = DataShare.foodFocused;
            }

            self.menuUrlSelection = function(menu) {
                var data = menu.split(".");
                var splitLength = data.length;
                if(data[0] === "www") {
                    menu = 'http://' + menu;
                    $window.open(menu, '_blank');
                     console.log("menu"+menu);
                } else if(data[splitLength-1] === "jpg" || data[splitLength-1] === "png") {
                    $rootScope.menuImageUrl = menu;
                    $('#foodMenuModal').modal('show');
                } else {
                    $window.open(menu, '_blank');
                }
            };

            self.userSelectedFood = function(item) {
                if(item.count !== undefined && item.count !== '') {
                    if (self.selectedFoodList.indexOf(item) === -1) {
                        item.total = item.price * item.count;
                        item.total = item.total.toFixed(2);
                        self.selectedFoodList.push(item);
                    } else {
                        item.total = item.price * item.count;
                        item.total = item.total.toFixed(2);
                        self.selectedFoodList.total = item.total;
                    }
                }
                if (item.count === 0) {
                    var index = self.selectedFoodList.indexOf(item);
                    self.selectedFoodList.splice(index, 1);
                }

                DataShare.foodService = self.selectedFoodList;
            };

            self.showPopUp = function(value) {
                $rootScope.description = value;
            };

            self.getFood = function() {
                AjaxService.getPrivateHalls(self.venueid, 'Food').then(function(response) {
                    self.foodDetails = response.data;
                    if((Object.keys(DataShare.selectedFoods).length) !== 0) {
                        self.editFoodItems = DataShare.selectedFoods;
                        angular.forEach(self.editFoodItems, function(value,key) {
                          angular.forEach(self.foodDetails, function(value1,key1) {
                              if(value.id === value1.id) {
                                self.foodDetails.splice(key1, 1);
                              }
                          });
                        });
                        angular.forEach(self.foodDetails, function(value2) {
                              self.editFoodItems.push(value2);
                        });
                        self.foodDetails = self.editFoodItems;
                    }
                });
            };

            self.getVenueType = function() {
                AjaxService.getVenues(self.venueid,null,null).then(function(response) {
                    self.venueType = response.venueType;
                    var venueTypeSplit = self.venueType.split(',');
                    angular.forEach(venueTypeSplit, function(value1) {
                          var value = value1.trim();
                          if (value === 'CLUB') {
                              self.venueTypesClub = value;
                          } else if (value === 'BAR') {
                              self.venueTypesBar = value;
                          } else if (value === 'LOUNGE') {
                              self.venueTypesLounge = value;
                          } else if (value === 'BOWLING') {
                              self.venueTypeBowling = value;
                          } else if (value === 'CASINO') {
                              self.venueTypeCasino = value;
                          } else if (value === 'RESTAURANT') {
                              self.venueTypeRestaurant = value;
                          }
                    });
                });
            };

            self.foodSave = function() {
                DataShare.foodFocused = 'is-focused';
                $rootScope.serviceTabClear = true;
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
                DataShare.serviceTypes = self.foodType;
                DataShare.payloadObject = self.serviceJSON;
                DataShare.venueName = self.venueName;
                DataShare.enablePayment = self.enabledPayment;
                DataShare.selectedFoods = self.selectedFoodItems;
                $location.url("/confirmFoodService/" + self.selectedCity + "/" + self.venueid);
             };
            self.init();
    }]);
