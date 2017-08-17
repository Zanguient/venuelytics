/**
 * @author Saravanakumar
 * @date 07-JULY-2017
 */
"use strict";
app.controller('PrivateConfirmController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', '$rootScope',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, $rootScope) {

            $log.log('Inside Private Confirm Controller.');

            var self = $scope;

            self.init = function() {
                self.editCity = $routeParams.cityName;
                self.editVenueID = $routeParams.venueid;
                self.privateEventData = DataShare.privateEventData;
                self.authBase64Str = DataShare.authBase64Str;
                self.object = DataShare.payloadObject;
            };

            self.editPrivatePage = function() {
                $location.url('/newCities/' + self.editCity + '/' + self.editVenueID + '/private-events');
            };

            self.privateEventSave = function() {
                  AjaxService.createBottleService(self.editVenueID, self.object, self.authBase64Str).then(function(response) {
                    $log.info("response: "+angular.toJson(response));
                    $location.url(self.editCity + '/private-success/' + self.editVenueID);
                });
            };

            self.backToPrivate = function() {
                $rootScope.serviceName = 'PrivateEvent';
                DataShare.privateEventFocused = '';
                $location.url('/newCities/' + self.editCity + '/' + self.editVenueID + '/private-events');
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
