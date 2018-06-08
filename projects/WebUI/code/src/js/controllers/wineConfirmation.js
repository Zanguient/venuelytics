"use strict";
app.controller('WineConfirmController', ['$log', '$scope', '$location', 'DataShare', '$window', '$routeParams', 'AjaxService', '$rootScope', 'ngMeta', 'VenueService',
    function ($log, $scope, $location, DataShare, $window, $routeParams, AjaxService, $rootScope, ngMeta, venueService) {

        var self = $scope;
        self.paypal = false;
        self.cardPayment = false;
        self.orderPlaced = false;
        self.sumAmount = 0;
        self.chargedAmount = 0;
        self.totalChargedAmount = 0;
        self.init = function () {
            $window.localStorage.setItem($rootScope.blackTheme, 'blackTheme');
            self.venueDetails = venueService.getVenue($routeParams.venueId);
            self.venueId = self.venueDetails.id;
            $rootScope.blackTheme = venueService.getVenueInfo(self.venueId, 'ui.service.theme') || '';
            $rootScope.description = self.venueDetails.description;
            ngMeta.setTag('description', self.venueDetails.description + " Wine to Home Confirmation");
            $rootScope.title = self.venueDetails.venueName +  " Venuelytics - wine to home Services Confirmation & Payment";
            ngMeta.setTitle($rootScope.title);
            self.city = self.venueDetails.city;

            self.authBase64Str = DataShare.authBase64Str;
            self.object = DataShare.payloadObject;

            self.payAmounts = $window.localStorage.getItem("drinkAmount");
            self.wineServiceDetails = DataShare.wineServiceData;
            self.selectedDrinkItems = DataShare.selectedDrinks;
            self.enabledPayment = DataShare.enablePayment;
            self.venueName = self.venueDetails.venueName;
            self.taxDate = moment().format('YYYYMMDD');
            self.getTax();
            var amountValue = 0;
            angular.forEach(self.selectedDrinkItems, function (value1, key1) {
                var total = parseFloat(value1.total);
                amountValue = amountValue + total;
            });
            self.availableAmount = amountValue;
            if (DataShare.amount) {
                self.availableAmount = DataShare.amount;
                self.payAmounts = DataShare.amount;
            }
        };

        //Get Tax

        self.getTax = function () {
            AjaxService.getTaxType(self.venueId, self.taxDate).then(function (response) {
                self.tax = response.data;
                self.amount = parseFloat(self.availableAmount);
                self.chargedAmount = self.amount;
                if (self.tax.length !== 0) {
                    angular.forEach(self.tax, function (value, key) {
                        if (value.type === 'tax') {
                            var taxData = value.value;
                            self.taxAmount = (self.amount * taxData) / 100;
                            self.chargedAmount += self.taxAmount;
                        }
                        if (value.type === 'convenience-fee') {
                            var conFee = value.value;
                            self.chargedAmount += conFee;
                            self.processingFee = value.value;
                        }
                        if (value.type === 'discount') {
                            var discountFee = value.value;
                            self.chargedAmount += discountFee;
                            self.discount = value.value;
                        }
                        if (value.type === 'service-fee') {
                            var serviceFee = value.value;
                            self.gratuity = (self.amount * serviceFee) / 100;
                            self.chargedAmount += self.gratuity;
                        }
                        if (value.type === 'tips') {
                            var tipsFee = value.value;
                            self.chargedAmount += tipsFee;
                            self.tipsFee = value.value;
                        }
                        if (value.serviceType === 'DRINKS') {
                            var drinkFee = value.value;
                            self.drinksFee = (self.amount * drinkFee) / 100;
                            self.chargedAmount += self.drinksFee;
                        }
                        if (value.type === 'paypal-convenience-fee') {
                            var payPalConFee = value.value;
                            self.payPalFee = (self.amount * payPalConFee) / 100;
                        }
                        if (value.type === 'credit-convenience-fee') {
                            var cardFee = value.value;
                            self.creditCardFee = (self.amount * cardFee) / 100;
                        }
                    });
                } else {
                    self.chargedAmount = self.availableAmount;
                    self.taxAmount = 0;
                    self.gratuity = 0;
                    self.discount = 0;
                    self.processingFee = 0;
                }
            });
        };

        self.editWinePage = function () {
            $location.url('/cities/' + self.city + '/' + self.venueRefId(self.venueDetails) + '/wine-to-home');
        };

        self.backToDrink = function () {
            $rootScope.serviceName = 'WineToHome';
            DataShare.wineServiceData = '';
            $location.url('/cities/' + self.city + '/' + self.venueRefId(self.venueDetails) + '/wine-to-home');
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
