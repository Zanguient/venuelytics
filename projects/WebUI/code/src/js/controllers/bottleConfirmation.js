/**
 * @author Saravanakumar
 * @date 07-JULY-2017
 */
"use strict";
app.controller('ConfirmReservationController', ['$log', '$scope', '$location', 'DataShare', '$window', '$routeParams', 'AjaxService', '$rootScope', 'ngMeta', 'VenueService', 'TaxNFeesService',
    function ($log, $scope, $location, DataShare, $window, $routeParams, AjaxService, $rootScope,  ngMeta, venueService, TaxNFeesService) {

	$log.log('Inside Confirm Reservation Controller.');

	var self = $scope;
    self.selectTables = [];
    self.selectBottleOrders = [];
    self.availableAmount = 0;
    self.paymentData = {};
    self.init = function() {
        $rootScope.embeddedFlag = venueService.getProperty($routeParams.venueId, 'embed');
        self.venueDetails =  venueService.getVenue($routeParams.venueId); 
        $rootScope.blackTheme = venueService.getVenueInfo(self.venueDetails.id, 'ui.service.theme') || '';
        $rootScope.description = self.venueDetails.description; 
        DataShare.venueDetails = self.venueDetails;  
        self.selectedCity = DataShare.venueDetails.city;
        ngMeta.setTag('description', self.venueDetails.description + " Bottle Confirmation");
        $rootScope.title = self.venueDetails.venueName +  " Venuelytics - Bottle Services Confirmation & Payment";
        ngMeta.setTitle($rootScope.title);
        self.orderId = -1;
        self.venueId = self.venueDetails.id;
        self.userData = DataShare.bottleServiceData;
        var fullName = self.userData.userFirstName + " " + self.userData.userLastName;
        self.authBase64Str = window.btoa(fullName + ':' + self.userData.email + ':' + self.userData.mobile);

        self.object = DataShare.payloadObject;
        self.redirectUrl = self.selectedCity +"/paymentSuccess/" + self.venueRefId(self.venueDetails);
        self.payAtVenueUrl = self.selectedCity +'/'+ self.venueRefId(self.venueDetails) +'/orderConfirm';

        self.availableAmount = $window.localStorage.getItem("bottleAmount");
        if (!isNaN(self.availableAmount)  ) {
            self.availableAmount = 0;
        }
        self.taxDate = moment(self.userData.requestedDate).format('YYYYMMDD');
        self.selectBottleOrders = DataShare.selectBottle;
        self.enablePayment = DataShare.enablePayment;
        self.venueName =  DataShare.venueDetails.venueName;
        angular.forEach(self.selectBottleOrders, function(value1, key1) {
            self.availableAmount +=  value1.price;
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
                    if (!isNaN(value.totalPrice)) {
                        self.availableAmount += value.totalPrice;
                    }
                    self.selectTables.push(items);
                }
            });
        }
        if(DataShare.amount) {
            self.availableAmount = DataShare.amount;
        }
        AjaxService.getTaxType(self.venueId, self.taxDate).then(function(response) {
            self.taxNFeeRates = response.data;
            self.paymentData = TaxNFeesService.calculateTotalAmount(self.taxNFeeRates, parseFloat(self.availableAmount), "Bottle", '');
        
        });
    };

    //Get Tax

    
    self.editConfirmPage = function() {
        $location.url("/cities/" + self.selectedCity + "/" + self.venueRefId(self.venueDetails) + '/bottle-service');
    };

    self.paymentEnable = function() {
        $location.url(self.selectedCity +"/bottlePayment/" + self.venueRefId(self.venueDetails));
    };

    self.backToReservation = function() {
        $rootScope.serviceName = 'BottleService';
        DataShare.editBottle = 'false';
        DataShare.bottleServiceData = '';
        $location.url('/cities/' + self.selectedCity + '/' + self.venueRefId(self.venueDetails) + '/bottle-service');
    };
    
    self.venueRefId = function(venue) {
        if (!venue.uniqueName ) {
            return venue.id;
        } else {
            return venue.uniqueName;
        }
    };     
    self.init();
}]);