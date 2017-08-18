"use strict";
app.controller('FoodConfirmController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', '$rootScope',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, $rootScope) {


    		var self = $scope;

            self.init = function() {
                self.city = $routeParams.cityName;
                self.selectedVenueID = $routeParams.venueid;
                self.authBase64Str = DataShare.authBase64Str;
                self.object = DataShare.payloadObject;
                self.foodServiceDetails = DataShare.foodServiceData;
                self.selectedFoodItems = DataShare.selectedFoods;
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
                $rootScope.serviceName = 'FoodService';
                $location.url('/newCities/' + self.city + '/' + self.selectedVenueID + '/food-services');
            };

            self.init();
    }]);
