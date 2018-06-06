"use strict";
app.controller('WineToHomeCtrl', ['$log', '$scope', '$location', 'DataShare', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', '$rootScope', 'ngMeta', 'VenueService',
    function ($log, $scope, $location, DataShare, $window, $routeParams, AjaxService, APP_ARRAYS, $rootScope, ngMeta, venueService) {

        var self = $scope;
        self.selectedDrinkItems = [];
        self.init = function () {

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
                self.drink = DataShare.wineServiceData;
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
                    item.total = item.price * item.count;
                    item.total = item.total.toFixed(2);
                    self.userSelectedDrinks.push(item);
                } else {
                    item.total = item.price * item.count;
                    item.total = item.total.toFixed(2);
                    self.userSelectedDrinks.total = item.total;
                }
            }

            if ((item.count === 0) || (item.count === '')) {
                var index = self.userSelectedDrinks.indexOf(item);
                self.userSelectedDrinks.splice(index, 1);
            }
            DataShare.drinks = self.userSelectedDrinks;
        };

        self.getDrink = function () {
            AjaxService.getPrivateHalls(self.venueId, 'Drinks').then(function (response) {
                self.drinkDetails = response.data;
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
            });
        };

        self.showPopUp = function (value) {
            $rootScope.description = value;
        };

        self.wineSave = function () {
            $rootScope.serviceTabClear = true;
            var parsedend = moment().format("MM-DD-YYYY");
            var date = new Date(moment(parsedend, 'MM-DD-YYYY').format());
            var dateValue = moment(date).format("YYYY-MM-DDTHH:mm:ss");
            var fullName = self.wine.firstName + " " + self.wine.lastName;
            var authBase64Str = window.btoa(fullName + ':' + self.wine.emailId + ':' + self.wine.mobileNumber + ':' + self.wine.billingAddress + ':' + self.wine.shippingAddress);
            DataShare.authBase64Str = authBase64Str;
            DataShare.wineServiceData = self.wine;
            self.serviceJSON = {
                "serviceType": 'Drinks',
                "venueNumber": self.venueId,
                "reason": "",
                "contactNumber": self.wine.mobileNumber,
                "contactEmail": self.wine.emailId,
                "contactZipcode": "",
                "noOfGuests": 0,
                "noOfMaleGuests": 0,
                "noOfFemaleGuests": 0,
                "budget": 0,
                "serviceInstructions": self.drink.instructions,
                "status": "REQUEST",
                "serviceDetail": null,
                "fulfillmentDate": dateValue,
                "durationInMinutes": 0,
                "deliveryType": self.drinkType,
                //"deliveryAddress": tableNumber,
                "deliveryInstructions": null,
                "order": {
                    "venueNumber": self.venueId,
                    "orderDate": dateValue,
                    "orderItems": []
                },
                "prebooking": false,
                "employeeName": "",
                "visitorName": fullName
            };
            angular.forEach(self.drinkDetails, function (value, key) {
                if (value.count) {
                    var items = {
                        "venueNumber": self.venueId,
                        "productId": value.id,
                        "productType": value.productType,
                        "quantity": value.count,
                        "name": value.name
                    };
                    self.selectedDrinkItems.push(value);
                    self.serviceJSON.order.orderItems.push(items);
                }
            });
            DataShare.serviceTypes = self.drinkType;
            DataShare.payloadObject = self.serviceJSON;
            DataShare.venueName = self.venueName;
            DataShare.enablePayment = self.enabledPayment;
            DataShare.selectedDrinks = self.selectedDrinkItems;
            $location.url(self.selectedCity + "/" + self.venueRefId(self.venueDetails) + "/confirmWineService");
        };

        self.venueRefId = function (venue) {
            if (!venue.uniqueName) {
                return venue.id;
            } else {
                return venue.uniqueName;
            }
        };
        self.init();
}]);
