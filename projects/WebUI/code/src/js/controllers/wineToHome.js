"use strict";
app.controller('WineToHomeCtrl', ['$log', '$scope', '$location', 'DataShare', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', '$rootScope', 'ngMeta', 'VenueService',
    function ($log, $scope, $location, DataShare, $window, $routeParams, AjaxService, APP_ARRAYS, $rootScope, ngMeta, venueService) {

        var self = $scope;
        self.selectedDrinkItems = [];
        self.drinkCategories = {};
        self.init = function () {
            self.wine = {
                billingAddress: {
                    "apiKey": "QWERTYUIOP123456",
                },
                shippingAddress: {
                    "apiKey": "QWERTYUIOP123456",
                }
            }

            self.venueDetails = venueService.getVenue($routeParams.venueId);
            self.venueId = self.venueDetails.id;
            ngMeta.setTag('description', self.venueDetails.description + " Wine To Home Services");
            $rootScope.title = self.venueDetails.venueName + " Venuelytics - Wine To Home Services";
            ngMeta.setTitle($rootScope.title);

            self.selectedCity = self.venueDetails.city;
            $rootScope.serviceTabClear = false;

            if (($rootScope.serviceName === 'WineToHome') || (DataShare.amount !== '')) {
                self.tabClear();
            }

            if ((Object.keys(DataShare.wineServiceData).length) !== 0) {
                self.wine = DataShare.wineServiceData;
                self.drinkType = DataShare.serviceTypes;
                self.userSelectedDrinks = DataShare.drinks;
            } else {
                self.tabClear();
            }
            self.getMenus();
            self.getDrink();
            setTimeout(function () {
                self.getSelectedTab();
            }, 600);
        };

        self.getMenus = function () {
            AjaxService.getInfo(self.venueId).then(function (response) {
                self.drinksWineListuUrl = response.data["Drinks.wineListuUrl"];
                self.drinksHappyHourDrinkUrl = response.data["Drinks.happyHourDrinkUrl"];
                self.drinksBeerMenuUrl = response.data["Drinks.beerMenuUrl"];
                self.drinksMenuUrl = response.data["Drinks.menuUrl"];
                self.drinksCocktailsUrl = response.data["Drinks.cocktailsUrl"];
                self.enabledPayment = response.data["Advance.enabledPayment"];
                self.drinkPickup = response.data["Drinks.DrinksPickup.enable"];
                self.specificDrink = response.data["Drinks.SpecificServiceDrink.enable"];
                self.preOrder = response.data["Drinks.PreOrdering.enable"];
                if ((self.preOrder === 'N') || (self.preOrder === 'n')) {
                    self.orderDisable = true;
                }
            });
        };

        self.getSelectedTab = function () {
            $(".service-btn .card").removeClass("tabSelected");
            $("#wineToHome > .winetohomeBtn").addClass("tabSelected");
        };

        self.removeDrinkItems = function (index, obj) {
            self.userSelectedDrinks.splice(index, 1);
            angular.forEach(self.drinkDetails, function (value, key) {
                if (obj.id === value.id) {
                    value.count = '';
                }
            });
        };

        self.tabClear = function () {
            DataShare.wineServiceData = {};
            self.isDrinkFocused = '';
            self.drink = {};
            DataShare.serviceTypes = '';
            DataShare.foodService = [];
            DataShare.drinks = '';
            self.drinkType = 'Delivery';
            DataShare.selectedDrinks = '';
        };

        self.menuUrlSelection = function (menu) {
            var data = menu.split(".");
            var splitLength = data.length;
            if (data[0] === "www") {
                menu = 'http://' + menu;
                $window.open(menu, '_blank');
            } else if (data[splitLength - 1] === "jpg" || data[splitLength - 1] === "png") {
                self.menuImageUrl = menu;
                $('#drinkMenuModal').modal('show');
            } else {
                $window.open(menu, '_blank');
            }
        };

        self.userSelectedDrinks = [];

        self.drinkService = function (item) {
            if (item.count !== undefined && item.count !== '') {
                if (self.userSelectedDrinks.indexOf(item) === -1) {
                    for (let a = 0; a < item.quantity.length; a++) {
                        if (parseInt(item.count) === item.quantity[a]) {
                            angular.forEach(item.price, function (value, key) {
                                if (item.quantity.indexOf(item.quantity[a]) === key) {
                                    item.total = value.toFixed(2);
                                    self.userSelectedDrinks.push(item);
                                }
                            });
                        }
                    }
                } else {
                    for (let a = 0; a < item.quantity.length; a++) {
                        if (parseInt(item.count) === item.quantity[a]) {
                            angular.forEach(item.price, function (value, key) {
                                if (item.quantity.indexOf(item.quantity[a]) === key) {
                                    item.total = value.toFixed(2);
                                    self.userSelectedDrinks.total = item.total;
                                }
                            });
                        }
                    }
                }
            }

            if ((item.count === 0) || (item.count === '')) {
                var index = self.userSelectedDrinks.indexOf(item);
                self.userSelectedDrinks.splice(index, 1);
            }
            DataShare.drinks = self.userSelectedDrinks;
        };
        self.isMenuSelected = function (name) {
            return name == self.menuTab
        };

        self.selectMenu = function (name) {
            self.menuTab = name;
        };

        self.getDrink = function () {
            // AjaxService.getWine2Home(self.apikey).then(function (response) {
            //     self.drinkDetails = response.data;
            //     for(var j=0; j < response.data.length; j++) {
            //         self.drinkCategories[response.data[j].category] = response.data[j].category;                     
            //     }
            self.drinkDetails = [
                {
                    "id": "WHITE_OAK_CAB_2012",
                    "name": " Oaks Cabernet 2012",
                    "type": "Wine",
                    "category": "Red Wine",
                    "brand": "White Oaks",
                    "description": "Description of the product",
                    "size": "750",
                    "unit": "ml",
                    "originalUrl": "/demo/images/white_oak_cab_2012_orig.jpg",
                    "originalHeight": 1000,
                    "originalWidth": 500,
                    "smallUrl": "/demo/images/white_oak_cab_2012_small.jpg",
                    "smallHeight": 300,
                    "smallWidth": 150,
                    "mediumUrl": "/demo/images/white_oak_cab_2012_med.jpg",
                    "mediumHeight": 600,
                    "mediumWidth": 300,
                    "largeUrl": "/demo/images/white_oak_cab_2012_large.jpg",
                    "largeHeight": 750,
                    "largeWidth": 375,
                    "quantity": [3, 6, 12],
                    "price": [99.99, 175.00, 300.00],
                    "tax": [0, 0, 0],
                    "shippingHandling": [10.00, 20.00, 30.00],
                    "qtyOnHand": 125
                },
                {
                    "id": "Vodka_2012",
                    "name": " vodka 2012",
                    "type": "brandy",
                    "category": "Vodka",
                    "brand": "Vodka",
                    "description": "Vodka",
                    "size": "750",
                    "unit": "ml",
                    "originalUrl": "/demo/images/white_oak_cab_2012_orig.jpg",
                    "originalHeight": 1000,
                    "originalWidth": 500,
                    "smallUrl": "/demo/images/white_oak_cab_2012_small.jpg",
                    "smallHeight": 300,
                    "smallWidth": 150,
                    "mediumUrl": "/demo/images/white_oak_cab_2012_med.jpg",
                    "mediumHeight": 600,
                    "mediumWidth": 300,
                    "largeUrl": "/demo/images/white_oak_cab_2012_large.jpg",
                    "largeHeight": 750,
                    "largeWidth": 375,
                    "quantity": [4, 7, 13],
                    "price": [109.99, 185.00, 310.00],
                    "tax": [0, 0, 0],
                    "shippingHandling": [10.00, 20.00, 30.00],
                    "qtyOnHand": 125
                },
            ]

            for (var j = 0; j < self.drinkDetails.length; j++) {
                self.drinkCategories[self.drinkDetails[j].category] = self.drinkDetails[j].category;
            }

            self.menuTab = self.drinkDetails[0].category;
            if ((Object.keys(DataShare.selectedDrinks).length) !== 0) {
                self.editDrinkItems = DataShare.selectedDrinks;
                angular.forEach(self.editDrinkItems, function (value, key) {
                    angular.forEach(self.drinkDetails, function (value1, key1) {
                        if (value.id === value1.id) {
                            self.drinkDetails.splice(key1, 1);
                        }
                    });
                });
                angular.forEach(self.drinkDetails, function (value2) {
                    self.editDrinkItems.push(value2);
                });
                self.drinkDetails = self.editDrinkItems;
            }
            // });
        };

        self.showPopUp = function (value) {
            $rootScope.description = value;
        };

        self.wineSave = function () {
            $rootScope.serviceTabClear = true;
            var fullName = self.wine.firstName + " " + self.wine.lastName;
            var authBase64Str = window.btoa(fullName + ':' + self.wine.emailId + ':' + self.wine.mobileNumber + ':' + self.wine.billingAddress + ':' + self.wine.shippingAddress);
            DataShare.authBase64Str = authBase64Str;
            DataShare.wineServiceData = self.wine;
            // AjaxService.addressValidation(self.wine.billingAddress, 'BillingAddress').then(function (response) {
            //     if (response.result === 'validated') {
            //         AjaxService.addressValidation(self.wine.shippingAddress, 'ShippingAddress').then(function (response2) {
            //             if (response2.result === 'validated') {
            self.serviceJSON = {
                "apiKey": "QWERTYUIOP123456",
                "orderDetail": [],
                "subTotal": 649.99,
                "shippingHandling": 10.00,
                "tax": 0.00,
                "total": 659.99,
                "shippingAddress": self.wine.shippingAddress,
                "billingAddress": self.wine.billingAddress,
                "paymentInfo": {
                    "creditCard": "XXX YYY ZZZZ",
                    "expMonth": "02",
                    "expYear": "20",
                    "cvv": "122"
                },
            };
            angular.forEach(self.drinkDetails, function (value, key) {
                if (value.count) {
                    var items = {
                        "id": value.id,
                        "bottles": value.size,
                        "quantity": value.count,
                        "name": value.name
                    };
                    self.selectedDrinkItems.push(value);
                    self.serviceJSON.orderDetail.push(items);
                }
            });
            DataShare.serviceTypes = self.drinkType;
            DataShare.payloadObject = self.serviceJSON;
            DataShare.enablePayment = self.enabledPayment;
            DataShare.selectedDrinks = self.selectedDrinkItems;
            $location.url(self.selectedCity + "/" + self.venueRefId(self.venueDetails) + "/confirmWineService");
        }
        //             })
        //         }
        //     })
        // };

        self.venueRefId = function (venue) {
            if (!venue.uniqueName) {
                return venue.id;
            } else {
                return venue.uniqueName;
            }
        };
        self.init();
    }]);
