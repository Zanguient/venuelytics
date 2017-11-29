"use strict";
app.controller('GuestConfirmController', ['$log', '$scope', '$location', 'DataShare', '$window', '$routeParams', 'AjaxService', '$rootScope','ngMeta', 'VenueService',
    function ($log, $scope, $location,  DataShare, $window, $routeParams, AjaxService, $rootScope, ngMeta, venueService) {

    		$log.log('Inside Guest Confirm Controller.');

    		var self = $scope;
            self.init = function() {
                
                self.selectedVenueID = $routeParams.venueid;
                self.venueDetails = venueService.getVenue($routeParams.venueid);
                $rootScope.description = self.venueDetails.description;
                ngMeta.setTag('description', self.venueDetails.description + " Guest Confirmation");
                $rootScope.title = self.venueDetails.venueName+' '+self.venueDetails.city+' '+self.venueDetails.state + " Venuelytics - Guest List Confirmation";
                ngMeta.setTitle($rootScope.title);
                self.city = self.venueDetails.city;
                
                self.guestListData = DataShare.guestListData;
                self.authBase64Str = DataShare.authBase64Str;
                self.object = DataShare.payloadObject;
            };

            self.editGuestPage = function() {
                $location.url('/cities/' + self.city + '/' + self.selectedVenueID + '/guest-list');
            };

            self.guestListSave = function() {
                    AjaxService.createGuestList(self.selectedVenueID, self.object, self.authBase64Str).then(function(response) {
                        $location.url(self.city + '/guest-success/' + self.selectedVenueID);
                });
            };

            self.backToGuest = function() {
                $rootScope.serviceName = 'GuestList';
                DataShare.guestListData = '';
                $location.url('/cities/' + self.city + '/' + self.selectedVenueID + '/guest-list');
            };

            self.init();
    }]);
