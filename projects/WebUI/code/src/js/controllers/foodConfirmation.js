"use strict";
app.controller('FoodConfirmController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', '$rootScope',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, $rootScope) {

    		$log.log('Inside Guest List Controller.');

    		var self = $scope;

            self.init = function() {
                self.city = $routeParams.cityName;
                self.selectedVenueID = $routeParams.venueid;
                //self.guestSelectedDate = moment(self.guestListData.guestStartDate).format('MM-DD-YYYY');
                self.authBase64Str = DataShare.authBase64Str;
                self.object = DataShare.payloadObject;
                self.foodServiceDetails = DataShare.foodServiceData;
            };

            self.editFoodPage = function() {
                $location.url('/newCities/' + self.city + '/' + self.selectedVenueID + '/food-services');
            };

            self.foodServiceSave = function() {
                    AjaxService.createBottleService(self.selectedVenueID, self.object, self.authBase64Str).then(function(response) {
                    $('#foodServiceModal').modal('show');
                });
            };

            self.backToGuest = function() {
                $rootScope.serviceName = 'GuestList';
                $location.url('/newCities/' + self.city + '/' + self.selectedVenueID + '/food-services');
            };

            self.closeGuestListModal = function() {
              $('.modal-backdrop').remove();
              $location.url(self.city + '/food-service/' + self.selectedVenueID);
            };
            self.init();
    }]);
