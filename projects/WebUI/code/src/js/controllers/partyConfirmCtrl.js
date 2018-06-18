"use strict";
app.controller('PartyConfirmController', ['$log', '$scope', '$location', 'DataShare', '$window', '$routeParams', 'AjaxService', '$rootScope','ngMeta', 'VenueService','TaxNFeesService',
    function ($log, $scope, $location, DataShare, $window, $routeParams, AjaxService, $rootScope, ngMeta, venueService, TaxNFeesService ) {

	$log.log('Inside Party Confirm Controller.');

	var self = $scope;
    self.availableAmount = 0;
    self.paymentData = {};
    self.init = function() {
       
        self.venueDetails = venueService.getVenue($routeParams.venueId);
        self.venueId = self.venueDetails.id;
        $rootScope.blackTheme = venueService.getVenueInfo(self.venueId, 'ui.service.theme') || '';
        $rootScope.description = self.venueDetails.description;
        ngMeta.setTag('description', self.venueDetails.description + " Party Confirmation");
        $rootScope.title = self.venueDetails.venueName + " Venuelytics - Party Services Confirmation & Payment";
        ngMeta.setTitle($rootScope.title);
        self.city = self.venueDetails.city;
        
        self.partyPackageData = DataShare.partyServiceData;
        self.venueName = self.venueDetails.venueName;
        $rootScope.blackTheme = venueService.getVenueInfo(self.venueId, 'ui.service.theme') || '';
       
        var fullName = self.partyPackageData.userFirstName + " " + self.partyPackageData.userLastName;
        self.authBase64Str = window.btoa(fullName + ':' + self.partyPackageData.email + ':' + self.partyPackageData.mobile);
        if(!!DataShare.partyOrderItem){
            self.availableAmount = DataShare.partyOrderItem.price;
        }                    
        self.partyOrderItem = DataShare.partyOrderItem;
        self.taxDate = moment(self.partyPackageData.orderDate).format('YYYYMMDD');
        self.object = DataShare.payloadObject;
        self.enabledPayment = DataShare.enablePayment;
       
        AjaxService.getTaxType(self.venueId, self.taxDate).then(function(response) {
            self.taxNFeeRates = response.data;
            self.paymentData = TaxNFeesService.calculateTotalAmount(self.taxNFeeRates, parseFloat(self.availableAmount), "Party", '');
        });
        self.redirectUrl = self.city +"/partySuccess/" + self.venueRefId(self.venueDetails);
        self.payAtVenueUrl = self.city +'/party-success/'+ self.venueRefId(self.venueDetails);
    };

            

    self.editPartyPackage = function() {
        $location.url("/cities/" + self.city + "/" + self.venueRefId(self.venueDetails) + '/party-packages');
    };

     self.savePartyPackage = function() {
        
        AjaxService.placeServiceOrder(self.venueId, self.object, self.authBase64Str).then(function(response) {
            if (response.status == 200 || response.srtatus == 201) {
                self.orderId = response.data.id;
                $location.url(self.city +'/party-success/'+ self.venueRefId(self.venueDetails));
            } else {
                if (response.data && response.data.message) {
                    alert("Saving order failed with message: " + response.data.message );
                }
            }
        });
    };

    self.paymentEnable = function() {
        $location.url('/' + self.city + '/partyPackagePayment/' + self.venueRefId(self.venueDetails));
    };

    
    self.backToParty = function() {
      $rootScope.serviceName = 'PartyPackages';
      DataShare.partyServiceData = '';
      $location.url('/cities/' + self.city + '/' + self.venueRefId(self.venueDetails) + '/party-packages');
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
