/**
 * @author Saravanakumar K
 * @date 18-MAY-2017
 */
"use strict";
app.controller('NewVenueController', ['$rootScope','$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window','$routeParams', 'AjaxService', 'APP_ARRAYS', '$translate',
    function ($rootScope, $log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, APP_ARRAYS, $translate) {

    		$log.log('Inside New Venue Controller.');

    		var self = $scope;

            self.init = function() {
                DataShare.bottleServiceData = {};
                DataShare.guestListData = {};
                DataShare.privateEventData = {};
                DataShare.selectBottle = [];
                DataShare.tableSelection = '';
                DataShare.totalNoOfGuest = 1;
                self.serviceTypes = APP_ARRAYS.serviceTabs;
                self.serviceIcons = APP_ARRAYS.serviceSmallIcons;

                self.selectedCityName = $routeParams.cityName;
                AjaxService.getCity(self.selectedCityName).then(function(response) {
                    self.cityInfo = response[0];
                    self.selectedCityDistance = self.cityInfo.distanceInMiles;
                    self.barTab = self.cityInfo.counts.BAR;
                    self.karaokeTab = self.cityInfo.counts.KARAOKE;
                    self.bowlingTab = self.cityInfo.counts.BOWLING;
                    self.clubTab = self.cityInfo.counts.CLUB;
                    self.restaurantTab = self.cityInfo.counts.RESTAURANT;
                    self.casinoTab = self.cityInfo.counts.CASINO;
                });

                if(DataShare.latitude && DataShare.longitude &&
                    DataShare.latitude !== '' && DataShare.longitude !== ''){
                    self.setTab('CLUB');
                } else{

                    if (navigator && navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function(position){
                            DataShare.latitude = position.coords.latitude;
                            DataShare.longitude = position.coords.longitude;
                            self.setTab('CLUB');
                            self.$apply(function(){
                                self.position = position;
                            });
                        },
                        function (error) {
                            self.setTab('CLUB');
                        });
                    }
                }
            };
            self.newVenueDescription = function(value) {
                $rootScope.privateDescription = value;
                $('.modal-backdrop').remove();
            };

            self.setTab = function(type){
                $(window).trigger('resize');
                self.selectedVenueType = $translate.instant(type);
                //DataShare.selectedCity = self.selectedCityName;
                AjaxService.getVenues(null,self.selectedCityName, type, DataShare.latitude, DataShare.longitude).then(function(response) {
                    self.listOfVenuesByCity = response.venues;
                    angular.forEach(self.listOfVenuesByCity, function(value, key) {
                            value.feature = value.info["Advance.featured"];
                    });                
                });
            };
            self.getVenueBySearch = function(venueSearch){
                AjaxService.getVenueBySearch(DataShare.latitude, DataShare.longitude, venueSearch).then(function(response) {
                    self.listOfVenuesByCity = response.venues;
                    angular.forEach(self.listOfVenuesByCity, function(value, key) {
                        value.feature = value.info["Advance.featured"];
                    });
                });
            };
            self.getVenuesKeyEnter = function(keyEvent,venueSearch) {
                if (keyEvent.which === 13){
                    self.getVenueBySearch(venueSearch);
                }
            };

        		self.selectVenue = function(venue) {
                //DataShare.selectedVenueDetails = venue;
                DataShare.selectedVenue = venue;
                DataShare.venueNumber = venue.id;
                self.selectedCityName = venue.city;
        			  $location.url('/cities/' + self.selectedCityName + '/' + venue.id);
        		};

            self.selectedServices = function(venue, serviceType) {
                self.selectedCityName = venue.city;
                $location.url('/cities/' + self.selectedCityName +'/'+ venue.id +"/VIP"+ '/' + serviceType);
            };
    		self.init();
    }])
.filter('titleCase', function() {
    return function(input) {
      input = input || '';
      return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };
  });
