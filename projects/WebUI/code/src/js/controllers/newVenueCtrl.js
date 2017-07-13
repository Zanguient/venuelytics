/**
 * @author Saravanakumar K
 * @date 18-MAY-2017
 */
"use strict";
app.controller('NewVenueController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService', '$window','$routeParams', 'AjaxService', 'APP_ARRAYS', '$translate',
    function ($log, $scope, $http, $location, RestURL, VenueService, $window, $routeParams, AjaxService, APP_ARRAYS, $translate) {

    		$log.log('Inside Venue Controller.');

    		var self = $scope;

            self.init = function() {
                VenueService.bottleServiceData = {};
                VenueService.guestListData = {};
                VenueService.privateEventData = {};
                VenueService.totalNoOfGuest = 1;
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

                if(VenueService.latitude && VenueService.longitude &&
                    VenueService.latitude !== '' && VenueService.longitude !== ''){
                    self.setTab('CLUB');
                } else{

                    if (navigator && navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function(position){
                            VenueService.latitude = position.coords.latitude;
                            VenueService.longitude = position.coords.longitude;
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

            self.setTab = function(type){
                self.selectedVenueType = $translate.instant(type);
                //VenueService.selectedCity = self.selectedCityName;
                AjaxService.getVenues(null,self.selectedCityName, type, VenueService.latitude, VenueService.longitude).then(function(response) {
                    self.listOfVenuesByCity = response.venues;
                });
            };

            self.getVenueBySearch = function(venueSearch){
                AjaxService.getVenueBySearch(VenueService.latitude, VenueService.longitude, venueSearch).then(function(response) {
                    self.listOfVenuesByCity = response.venues;
                });
            };

            self.getVenuesKeyEnter = function(keyEvent,venueSearch) {
                if (keyEvent.which === 13){
                    self.getVenueBySearch(venueSearch);
                }
            };

    		self.selectVenue = function(venue) {
                //VenueService.selectedVenueDetails = venue;
                VenueService.selectedVenue = venue;
                VenueService.venueNumber = venue.id;
    			$location.url('/newCities/'+self.selectedCityName+'/'+venue.id);
    		};

            self.selectedServices = function(venue, serviceType) {
                $location.url('/newCities/'+self.selectedCityName+'/'+venue.id+'/'+serviceType);
            };
    		self.init();
    }])
.filter('titleCase', function() {
    return function(input) {
      input = input || '';
      return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };
  });
