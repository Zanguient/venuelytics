/**
 * @author Saravanakumar K
 * @date 18-MAY-2017
 */
"use strict";
app.controller('CityController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService', 'AjaxService',
    function ($log, $scope, $http, $location, RestURL, VenueService, AjaxService) {

    		$log.log('Inside Home Controller.');
    		
    		var self = $scope;

            self.gettingLocation = function(lat, long) {

                AjaxService.gettingLocation(lat, long).then(function(response) {
                    self.listOfCities = response;
                    $log.info('Success getting cities.');

                    document.getElementById('loadingCities').style.display = 'none';
                });
            };

            self.init = function() {
                self.selectedCountry = 'North America';
                self.countries = ['North America', 'Canada', 'South America', 'India'];

                if(VenueService.latitude && VenueService.longitude && 
                    VenueService.latitude !== '' && VenueService.longitude !== ''){

                    self.gettingLocation(VenueService.latitude, VenueService.longitude);
                } else{

                    if (navigator && navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function(position){
                            VenueService.latitude = position.coords.latitude; 
                            VenueService.longitude = position.coords.longitude;
                            self.gettingLocation(VenueService.latitude, VenueService.longitude);
                            self.$apply(function(){
                                self.position = position;
                            });
                        },
                        function (error) { 
                            self.gettingLocation();
                        });
                    } else{

                        self.gettingLocation();
                    }    
                }				
            };

            self.init();

    		self.selectCity = function(city) {
                VenueService.cityDistance = city.distanceInMiles;
                $location.url('/venues/'+city.name);
    		};

            self.selectedCountry = function(country) {
                $log.info('selectedCountry: '+country);
            };
    		
            
    }]);