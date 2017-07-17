/**
 * @author Saravanakumar
 * @date 07-JULY-2017
 */
"use strict";
app.controller('PrivateReservationController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService', '$window', '$routeParams', 'AjaxService',
    function ($log, $scope, $http, $location, RestURL, VenueService, $window, $routeParams, AjaxService) {

            $log.log('Inside Private Reservation Controller.');
            
            var self = $scope;

            self.init = function() {
                self.editCity = $routeParams.cityName;
                self.editVenueID = $routeParams.venueid;
                self.privateEventData = VenueService.privateEventData;
                self.privateSelectedDate = moment(self.privateEventData.orderDate).format("MM-DD-YYYY");
                self.authBase64Str = VenueService.authBase64Str;
                self.object = VenueService.payloadObject;
            };

            self.editPrivatePage = function() {
                $location.url("/newCities/" + self.editCity + "/" + self.editVenueID);
            };

            self.privateEventSave = function() {
                
                  AjaxService.createBottleService(self.editVenueID, self.object, self.authBase64Str).then(function(response) {
                    $log.info("response: "+angular.toJson(response));
                    $('#privateEventModal').modal('show');
                });
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