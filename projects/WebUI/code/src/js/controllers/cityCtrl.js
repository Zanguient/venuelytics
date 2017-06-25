/**
 * @author Saravanakumar K
 * @date 18-MAY-2017
 */
"use strict";
app.controller('CityController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService', 'AjaxService', 'APP_ARRAYS',
    function ($log, $scope, $http, $location, RestURL, VenueService, AjaxService, APP_ARRAYS) {

    		$log.log('Inside City Controller.');
    		
    		var self = $scope;
            var nextPageSize = 0;
            var previousPageSize = 0;
            self.next = false;
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
                self.loadingBar = true;
                AjaxService.getVenuesByCity(VenueService.latitude, VenueService.longitude, citySearch).then(function(response) {
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
                            // self.gettingLocation();
                        });
                    } else{
                        $log.info("Do nothing");
                        // self.gettingLocation();
                    }    
                }				
            };

            self.init();

    		self.selectCity = function(city) {
                $location.url('/venues/'+city.name);
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

            self.getCityKeyEnter = function(keyEvent,citySearch) {
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