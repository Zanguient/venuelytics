/**
 * @author Saravanakumar
 * @date 07-JULY-2017
 */
"use strict";
app.controller('PrivateConfirmController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', '$rootScope', '$cookieStore','ngMeta',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, $rootScope, $cookieStore, ngMeta) {

            $log.log('Inside Private Confirm Controller.');

            var self = $scope;
            self.init = function() {
                $rootScope.description = DataShare.eachVenueDescription;
                self.venudetails = DataShare.venueFullDetails;
                ngMeta.setTag('description', self.venudetails.description + " Private Confirmation");
                $rootScope.title = self.venudetails.venueName+' '+$routeParams.cityName+' '+self.venudetails.state+' '+ "Venuelytics - Private Event Confirmation";
                ngMeta.setTitle(self.venudetails.venueName+' '+$routeParams.cityName+' '+self.venudetails.state+' '+ "Venuelytics - Private Event Confirmation");
                self.editCity = $routeParams.cityName;
                self.editVenueID = $routeParams.venueid;
                self.privateEventData = DataShare.privateEventData;
                self.authBase64Str = DataShare.authBase64Str;
                self.object = DataShare.payloadObject;
                self.privateOrderItem = DataShare.privateOrderItem;
            };

            self.editPrivatePage = function() {
                $location.url('/cities/' + self.editCity + '/' + self.editVenueID + '/private-events');
            };

            self.privateEventSave = function() {
                  AjaxService.createBottleService(self.editVenueID, self.object, self.authBase64Str).then(function(response) {
                    $log.info("response: "+angular.toJson(response));
                    $location.url(self.editCity + '/private-success/' + self.editVenueID);
                });
            };

            self.backToPrivate = function() {
                $rootScope.serviceName = 'PrivateEvent';
                DataShare.privateEventData = '';
                DataShare.privateEventFocused = '';
                $location.url('/cities/' + self.editCity + '/' + self.editVenueID + '/private-events');
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
