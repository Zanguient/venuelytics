/**
 * @author Saravanakumar K
 * @date 18-MAY-2017
 */
"use strict";
app.controller('VenueController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService', '$window','$routeParams', 'AjaxService', 'APP_ARRAYS',
    function ($log, $scope, $http, $location, RestURL, VenueService, $window, $routeParams, AjaxService, APP_ARRAYS) {

    		$log.log('Inside Venue Controller.');
    		
    		var self = $scope;

            self.init = function() {
                
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
                //VenueService.selectedVenueType = type;
                //VenueService.selectedCity = self.selectedCityName;
                AjaxService.getVenues(null,self.selectedCityName, type, VenueService.latitude, VenueService.longitude).then(function(response) {
                    self.listOfVenuesByCity = response.venues;
                });
            };

    		self.selectVenue = function(venue) {
                //VenueService.selectedVenueDetails = venue;
    			$location.url('/venues/'+self.selectedCityName+'/'+venue.id);
    		};

            self.selectedServices = function(venue, serviceType) {
                $location.url('/venues/'+self.selectedCityName+'/'+venue.id+'/'+serviceType);
                $log.info('Inside selected services');
            };
    		self.init();
    }]);