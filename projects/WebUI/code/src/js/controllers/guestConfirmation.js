"use strict";
app.controller('GuestConfirmController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', '$rootScope',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, $rootScope) {

    		$log.log('Inside Guest Confirm Controller.');

    		var self = $scope;
            if($routeParams.new === 'new'){
                $rootScope.hideNavBar = true;
            }
            self.init = function() {
                self.city = $routeParams.cityName;
                self.selectedVenueID = $routeParams.venueid;
                self.guestListData = DataShare.guestListData;
                self.authBase64Str = DataShare.authBase64Str;
                self.object = DataShare.payloadObject;
            };

            self.editGuestPage = function() {
                if($routeParams.new === 'new'){
                    $location.url('/newCities/' + self.city + '/' + self.selectedVenueID + '/guest-list' + "/" + $routeParams.new);
                } else {
                    $location.url('/newCities/' + self.city + '/' + self.selectedVenueID + '/guest-list');
                }
            };

            self.guestListSave = function() {
                    AjaxService.createGuestList(self.selectedVenueID, self.object, self.authBase64Str).then(function(response) {
                        if($routeParams.new === 'new'){
                            $location.url(self.city + '/guest-success/' + self.selectedVenueID + "/" + $routeParams.new);
                        } else {
                            $location.url(self.city + '/guest-success/' + self.selectedVenueID);
                        }
                });
            };

            self.backToGuest = function() {
                $rootScope.serviceName = 'GuestList';
                if($routeParams.new === 'new'){
                    $location.url('/newCities/' + self.city + '/' + self.selectedVenueID + '/guest-list' + "/" + $routeParams.new);
                } else {
                    $location.url('/newCities/' + self.city + '/' + self.selectedVenueID + '/guest-list');
                }
            };

            self.init();
    }]);
