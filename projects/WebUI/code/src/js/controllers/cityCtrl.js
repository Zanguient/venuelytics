/**
 * @author Saravanakumar K
 * @date 18-MAY-2017
 */
"use strict";
app.controller('CityController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', 'AjaxService', 'APP_ARRAYS', '$rootScope',
    function ($log, $scope, $http, $location, RestURL, DataShare, AjaxService, APP_ARRAYS, $rootScope) {

    		$log.log('Inside City Controller.');
    		
    		var self = $scope;
            var nextPageSize = 0;
            var previousPageSize = 0;
            self.next = false;
            $rootScope.videoUrl = "https://www.youtube.com/watch?v=0tP_B61gTM8";
            self.gettingLocation = function(lat, long, country) {
                self.loadingBar = true;
                AjaxService.gettingLocation(lat, long, country).then(function(response) {
                    self.listOfCities = response;
                    self.loadingBar = false;
                    $log.info('Success getting cities.');

                    // document.getElementById('loadingCities').style.display = 'none';
                });
            };

            $scope.getCountry = function (countryObject) {
                self.loadingBar = true;
                self.listOfCities = '';
                self.selectedCountry = countryObject;
                AjaxService.getVenuesByCountry(countryObject.shortName, 0).then(function(response) {
                    self.listOfCities = response;
                    self.loadingBar = false;
                });
            };

            $scope.getCity = function (citySearch) {
                self.listOfVenuesByCity = [];
                self.loadingBar = true;
                AjaxService.getVenuesByCity(DataShare.latitude, DataShare.longitude, citySearch).then(function(response) {
                    self.listOfCities = response;
                    self.loadingBar = false;
                });
            };

            self.init = function() {

                $('.selectpicker').selectpicker({
                    style: 'btn-info',
                    size: 4
                });

                self.selectedCountry = APP_ARRAYS.country[0];
                self.countries = APP_ARRAYS.country;

                if(DataShare.latitude && DataShare.longitude && 
                    DataShare.latitude !== '' && DataShare.longitude !== ''){

                    self.gettingLocation(DataShare.latitude, DataShare.longitude);
                } else{

                    if (navigator && navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function(position){
                            DataShare.latitude = position.coords.latitude; 
                            DataShare.longitude = position.coords.longitude;
                            self.gettingLocation(DataShare.latitude, DataShare.longitude);
                            self.$apply(function(){
                                self.position = position;
                            });
                        },
                        function (error) { 
                            // self.gettingLocation();
                        });
                    } else{
                        $log.info("Do nothing");
                        // self.gettingLocation();
                    }    
                }				
            };

            self.init();

            self.venueInCityDescriptionModal = function(value) {
                $rootScope.privateDescription = value;
                $('.modal-backdrop').remove();
             };

    		self.selectCity = function(city) {
                $rootScope.title = 'Venuelytics-City-'+city.name;
                $location.url('/cities/'+city.name);
    		};

            self.previousPage = function() {
                $log.info('Inside previousPage');
                $log.info("Previous page size: "+previousPageSize);
                self.next = false;
                if(nextPageSize > 0) {
                    nextPageSize = nextPageSize - 50;
                    AjaxService.getVenuesByCountry(self.selectedCountry.shortName, nextPageSize).then(function(response) {
                    self.listOfCities = response;
                    self.loadingBar = false;
                });
                }
            };

            self.getVenueBySearch = function(venueSearch){
                self.listOfCities = [];
                AjaxService.getVenueBySearch(DataShare.latitude, DataShare.longitude, venueSearch).then(function(response) {
                    self.listOfVenuesByCity = response.venues;
                });
            };

            self.getVenuesKeyEnter = function(keyEvent,venueSearch) {
                self.listOfCities = [];
                if (keyEvent.which === 13){
                    self.getVenueBySearch(venueSearch);
                }
            };

            self.selectVenue = function(venue) {
                self.selectedCityName = venue.city;
                DataShare.selectedVenue = venue;
                DataShare.venueNumber = venue.id;
                $location.url('/cities/' + self.selectedCityName + '/' + venue.id);
            };

            self.getCityKeyEnter = function(keyEvent,citySearch) {
                self.listOfVenuesByCity = [];
                if (keyEvent.which === 13){
                    self.getCity(citySearch);
                }
            };

            self.nextPage = function() {
                self.next = true;
                nextPageSize = nextPageSize + 50;
                $log.info("Next page size: "+nextPageSize);
                AjaxService.getVenuesByCountry(self.selectedCountry.shortName, nextPageSize).then(function(response) {
                    self.listOfCities = response;
                    self.loadingBar = false;
                });
                $log.info('Inside nextPage');
            };
    }]);