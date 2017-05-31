/**
 * @author Saravanakumar K
 * @date 18-MAY-2017
 */
"use strict";
app.controller('VenueController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService', '$window','$routeParams', 'AjaxService',
    function ($log, $scope, $http, $location, RestURL, VenueService, $window, $routeParams, AjaxService) {

    		$log.log('Inside Venue Controller.');
    		
    		var self = $scope;

            self.init = function() {
                
                self.serviceTypes = ['CLUB', 'CASINO', 'BAR', 'KARAOKE', 'BOWLING', 'RESTAURANT'];

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
            };

            $scope.setTab = function(type){
                //VenueService.selectedVenueType = type;
                //VenueService.selectedCity = self.selectedCityName;
                AjaxService.getVenues(null,self.selectedCityName, type).then(function(response) {
                    self.listOfVenuesByCity = response.venues;
                });
            };

    		self.selectVenue = function(venue) {
                //VenueService.selectedVenueDetails = venue;
    			$location.url('/venues/'+self.selectedCityName+'/'+venue.id);
    		};

            self.selectedServices = function() {
                $log.info('Inside selected services');
            };
    		self.init();
    }]);