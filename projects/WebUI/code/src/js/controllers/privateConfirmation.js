/**
 * @author Saravanakumar
 * @date 07-JULY-2017
 */
"use strict";
app.controller('PrivateConfirmController', ['$log', '$scope', '$location', 'DataShare', '$window', '$routeParams', 'AjaxService', '$rootScope', 'ngMeta', 'VenueService',
    function ($log, $scope, $location, DataShare, $window, $routeParams, AjaxService, $rootScope, ngMeta, venueService) {

            $log.log('Inside Private Confirm Controller.');

            var self = $scope;
            self.init = function() {
                self.editVenueID = $routeParams.venueId;
                self.venueDetails = venueService.getVenue($routeParams.venueId);
                $rootScope.description = self.venueDetails.description;
                $rootScope.blackTheme = venueService.getVenueInfo($routeParams.venueId, 'ui.service.theme') || '';
                ngMeta.setTag('description', self.venueDetails.description + " Private Confirmation");
                $rootScope.title = self.venueDetails.venueName+' '+self.venueDetails.city+' '+self.venueDetails.state + " Venuelytics - Private Event Confirmation";
                ngMeta.setTitle($rootScope.title);
                self.selectedCity = self.venueDetails.city;
                
                self.privateEventData = DataShare.privateEventData;
                self.authBase64Str = DataShare.authBase64Str;
                self.object = DataShare.payloadObject;
                self.privateOrderItem = DataShare.privateOrderItem;
            };

            self.editPrivatePage = function() {
                $location.url('/cities/' + self.selectedCity + '/' + self.editVenueID + '/private-events');
            };

            self.privateEventSave = function() {
                  AjaxService.createBottleService(self.editVenueID, self.object, self.authBase64Str).then(function(response) {
                    $log.info("response: "+angular.toJson(response));
                    $location.url(self.selectedCity + '/private-success/' + self.editVenueID);
                });
            };

            self.backToPrivate = function() {
                $rootScope.serviceName = 'PrivateEvent';
                DataShare.privateEventData = '';
                DataShare.privateEventFocused = '';
                $location.url('/cities/' + self.selectedCity + '/' + self.editVenueID + '/private-events');
            };

             self.time24to12 = function(timeString) {
                var H = +timeString.substr(0, 2);
                var h = (H % 12) || 12;
                var ampm = H < 12 ? " AM" : " PM";
                timeString = h + timeString.substr(2, 3) + ampm;
                return timeString;
            };

            self.init();

    }]);
