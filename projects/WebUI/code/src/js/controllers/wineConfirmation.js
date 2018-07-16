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
        self.paymentData = {};
        self.init = function () {
            $window.localStorage.setItem($rootScope.blackTheme, 'blackTheme');
            self.venueDetails = venueService.getVenue($routeParams.venueId);
            self.venueId = self.venueDetails.id;
            $rootScope.blackTheme = venueService.getVenueInfo(self.venueId, 'ui.service.theme') || '';
            $rootScope.description = self.venueDetails.description;
            ngMeta.setTag('description', self.venueDetails.description + " Wine to Home Confirmation");
            $rootScope.title = self.venueDetails.venueName + " Venuelytics - wine to home Services Confirmation & Payment";
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
            var amountValue = 0;
            var totaltax = 0;
            var totalHandle = 0;
            var totalAmount = 0;
            angular.forEach(self.selectedDrinkItems, function (value1, key1) {
                var total = parseFloat(value1.total);
                totalAmount = totalAmount +total;
                totaltax = totaltax + parseFloat(value1.newtax);
                totalHandle = totalHandle + parseFloat(value1.shiphand);
                amountValue = amountValue + total + totaltax + totalHandle;
            });
            self.totaltax = totaltax;
            self.totalAmount = totalAmount;
            self.totalHandle = totalHandle;
            self.availableAmount = amountValue;
            self.paymentData.finalCost = amountValue;
            DataShare.paymetObjct = self.paymentData;
            if (DataShare.amount) {
                self.availableAmount = DataShare.amount;
                self.payAmounts = DataShare.amount;
            }
        };

        //Get Tax

        self.paymentEnabled = function () {
            $location.url(self.city + "/winePayment/" + self.venueRefId(self.venueDetails));
        };

        self.wineServiceSave = function () {
            AjaxService.placeServiceOrder(self.venueId, self.object, self.authBase64Str).then(function (response) {
                DataShare.paymetObjct.paied = false;
                self.orderId = response.data.id;
                $location.url(self.city + '/webui-success/' + self.venueRefId(self.venueDetails) + '/drink-services');
            });
        };
        self.editWinePage = function () {
            $location.url('/cities/' + self.city + '/' + self.venueRefId(self.venueDetails) + '/wine-to-home');
        };


        self.payusingCC = function () {
            $location.url(self.city + '/' + self.venueRefId(self.venueDetails) + '/wine-creditdebit');
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
