
"use strict";
app.controller('ReservationPartyController', ['$log', '$scope', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', '$rootScope', 'ngMeta', 'VenueService',
    function ($log, $scope, $location, RestURL, DataShare, $window, $routeParams, AjaxService, $rootScope,  ngMeta, venueService) {

	$log.log('Inside Confirm Party Reservation Controller.');

	var self = $scope;
    self.selectReserveTables = [];
    self.selectPartyOrders = [];
    self.availableAmount = 0;
    self.paymentData = {};
    self.init = function() {
        $rootScope.embeddedFlag = venueService.getProperty($routeParams.venueId, 'embed');
        self.venueDetails =  venueService.getVenue($routeParams.venueId); 
        self.venueId = self.venueDetails.id;
        $rootScope.blackTheme = venueService.getVenueInfo(self.venueId, 'ui.service.theme') || '';
        $rootScope.description = self.venueDetails.description;
        DataShare.venueDetails = self.venueDetails;
        self.selectedCity = DataShare.venueDetails.city;
        ngMeta.setTag('description', self.venueDetails.description + " Party Confirmation");
        $rootScope.title = self.venueDetails.venueName+  " Venuelytics - Party Services Confirmation & Payment";
        ngMeta.setTitle($rootScope.title);
       
        
        self.userPartyData = DataShare.partyServiceData;
        
        self.object = DataShare.payloadObject;
       
        self.availableAmount = $window.localStorage.getItem("partyAmount");
        self.taxDate = moment(self.userPartyData.requestedDate).format('YYYYMMDD');
        self.selectPartyOrders = DataShare.selectParty;
        self.enablePayment = DataShare.enablePayment;
        self.venueName =  self.venueDetails.venueName;
        
        angular.forEach(self.selectPartyOrders, function(value1, key1) {
            self.availableAmount += value1.price;
        });

        
        
        if(self.object !== '') {
            angular.forEach(self.object.order.orderItems, function(value, key) {
                if(value.productType === 'VenueMap') {
                    var items = {
                        "venueNumber": value.venueNumber,
                        "productId": value.productId,
                        "productType": value.productType,
                        "quantity": value.quantity,
                        "name": value.name,
                        "totalPrice" : value.totalPrice
                    };
                    self.selectReserveTables.push(items);
                }
            });
        }
        var fullName = self.userPartyData.userFirstName + " " + self.userPartyData.userLastName;
        self.authBase64Str = window.btoa(fullName + ':' + self.userPartyData.email + ':' + self.userPartyData.mobile);
        
        self.redirectUrl = self.selectedCity +"/paymentSuccess/" + self.venueRefId(self.venueDetails);
        self.payAtVenueUrl = self.selectedCity +'/'+ self.venueRefId(self.venueDetails) +'/orderConfirm';

        AjaxService.getTaxType(self.venueId, self.taxDate).then(function(response) {
            self.taxNFeeRates = response.data;
            self.paymentData = TaxNFeesService.calculateTotalAmount(self.taxNFeeRates, parseFloat(self.availableAmount), "Bottle", '');
        
        });
    };

    self.editConfirmPage = function() {
        $location.url("/cities/" + self.selectedCity + "/" + self.venueRefId(self.venueDetails) + '/reservation-service');
    };

    self.paymentEnable = function() {
        $location.url(self.selectedCity +"/partyPayment/" + self.venueRefId(self.venueDetails));
    };

    self.backToReservation = function() {
        $rootScope.serviceName = 'BottleService';
        DataShare.editParty = 'false';
        DataShare.partyServiceData = '';
        $location.url('/cities/' + self.selectedCity + '/' + self.venueRefId(self.venueDetails) + '/reservation-service');
    };

    self.venueRefId = function(venue) {
        if (!venue.uniqueName) {
            return venue.id;
        } else {
            return venue.uniqueName;
        }
    };

    self.init();
}]);