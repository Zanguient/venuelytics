"use strict";
app.controller('GuestConfirmController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', '$rootScope', '$cookieStore','ngMeta',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, $rootScope, $cookieStore, ngMeta) {

    		$log.log('Inside Guest Confirm Controller.');

    		var self = $scope;
            self.init = function() {
                $rootScope.description = DataShare.eachVenueDescription;
                self.venudetails = DataShare.venueFullDetails;
                ngMeta.setTag('description', self.venudetails.description + " Guest Confirmation");
                $rootScope.title = self.venudetails.venueName+' '+$routeParams.cityName+' '+self.venudetails.state+' '+ "Venuelytics - Guest List Confirmation";
                ngMeta.setTitle(self.venudetails.venueName+' '+$routeParams.cityName+' '+self.venudetails.state+' '+ "Venuelytics - Guest List Confirmation");
                self.city = $routeParams.cityName;
                self.selectedVenueID = $routeParams.venueid;
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
