/**
 * @author Saravanakumar K
 * @date 18-MAY-2017
 */
"use strict";
app.controller('CityController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService', 'AjaxService', 'APP_ARRAYS',
    function ($log, $scope, $http, $location, RestURL, VenueService, AjaxService, APP_ARRAYS) {

    		$log.log('Inside City Controller.');
    		
    		var self = $scope;

            self.gettingLocation = function(lat, long) {
                self.loadingBar = true;
                AjaxService.gettingLocation(lat, long).then(function(response) {
                    self.listOfCities = response;
                    self.loadingBar = false;
                    $log.info('Success getting cities.');

                    // document.getElementById('loadingCities').style.display = 'none';
                });
            };

            $scope.getCountry = function (item) {
                self.loadingBar = true;
                self.listOfCities = '';
                $scope.selectedCountry = item;
                if(item === 'North America') {
                    AjaxService.getVenuesByCountry('USA').then(function(response) {
                        self.listOfCities = response;
                        self.loadingBar = false;
                    });
                } else if(item === 'South America') {
                    AjaxService.getVenuesByCountry('SAM').then(function(response) {
                        self.listOfCities = response;
                        self.loadingBar = false;
                    });
                } else if(item === 'Canada') {
                    AjaxService.getVenuesByCountry('CANADA').then(function(response) {
                        self.listOfCities = response;
                        self.loadingBar = false;
                    });
                } else {
                    AjaxService.getVenuesByCountry('IND').then(function(response) {
                        self.listOfCities = response;
                        self.loadingBar = false;
                    });
                }
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
                            self.gettingLocation();
                        });
                    } else{

                        self.gettingLocation();
                    }    
                }				
            };

            self.init();

    		self.selectCity = function(city) {
                $location.url('/venues/'+city.name);
    		};
    }]);