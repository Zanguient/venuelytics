"use strict";
app.controller('DrinkConfirmController', ['$log', '$scope', '$location', 'DataShare', '$window', '$routeParams', 'AjaxService', '$rootScope', 'ngMeta', 'VenueService', 'TaxNFeesService',
    function ($log, $scope, $location, DataShare, $window, $routeParams, AjaxService, $rootScope, ngMeta, venueService, TaxNFeesService) {

        var self = $scope;
        self.availableAmount = 0;
        self.paymentData = {};
        self.init = function () {
            $window.localStorage.setItem($rootScope.blackTheme, 'blackTheme');


            self.venueDetails = venueService.getVenue($routeParams.venueId);
            self.venueId = self.venueDetails.id;
            $rootScope.blackTheme = venueService.getVenueInfo(self.venueId, 'ui.service.theme') || '';
            $rootScope.description = self.venueDetails.description;
            ngMeta.setTag('description', self.venueDetails.description + " Drink Confirmation");
            $rootScope.title = self.venueDetails.venueName +  " Venuelytics - Drink Services Confirmation & Payment";
            ngMeta.setTitle($rootScope.title);
            self.city = self.venueDetails.city;

            self.object = DataShare.payloadObject;

            self.payAmounts = $window.localStorage.getItem("drinkAmount");
            self.drinkServiceDetails = DataShare.drinkServiceData;
            self.selectedDrinkItems = DataShare.selectedDrinks;
            self.enabledPayment = DataShare.enablePayment;
            self.taxDate = moment().format('YYYYMMDD');
            self.venueName = self.venueDetails.venueName;
            
            var fullName = self.drinkServiceDetails.firstName + " " + self.drinkServiceDetails.lastName;
            self.authBase64Str = window.btoa(fullName + ':' + self.drinkServiceDetails.emailId + ':' + self.drinkServiceDetails.mobileNumber);

            angular.forEach(self.selectedDrinkItems, function (value1, key1) {
                var total = parseFloat(value1.total);
                self.availableAmount += total;
            });
            

            AjaxService.getTaxType(self.venueId, self.taxDate).then(function(response) {
                self.taxNFeeRates = response.data;
                self.paymentData = TaxNFeesService.calculateTotalAmount(self.taxNFeeRates, parseFloat(self.availableAmount), "Drinks", '');
            });
            self.redirectUrl = self.city +"/drinkSuccess/" + self.venueRefId(self.venueDetails);
            self.payAtVenueUrl = self.city +'/drink-success/'+ self.venueRefId(self.venueDetails);
        };

        

        self.editDrinkPage = function () {
            $location.url('/cities/' + self.city + '/' + self.venueRefId(self.venueDetails) + '/drink-services');
        };

        
        self.drinkServiceSave = function () {
            
            AjaxService.placeServiceOrder(self.venueId, self.object, self.authBase64Str).then(function (response) {
                self.orderId = response.data.id;
                $location.url(self.city + '/drink-success/' + self.venueRefId(self.venueDetails));
                
            });
            
        };
        self.paymentEnabled = function () {
            $location.url(self.city + "/drinkPayment/" + self.venueRefId(self.venueDetails));
        };

        self.backToDrink = function () {
            $rootScope.serviceName = 'DrinkService';
            DataShare.drinkServiceData = '';
            $location.url('/cities/' + self.city + '/' + self.venueRefId(self.venueDetails) + '/drink-services');
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
