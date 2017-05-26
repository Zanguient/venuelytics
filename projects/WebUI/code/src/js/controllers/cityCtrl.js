/**
 * @author Saravanakumar K
 * @date 18-MAY-2017
 */

app.controller('CityController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService',
    function ($log, $scope, $http, $location, RestURL, VenueService) {

    		$log.log('Inside Home Controller.');
    		
    		var self = $scope;

            self.init = function() {
                self.selectedCountry = 'North America';
                self.countries = ['North America', 'Canada', 'South America', 'India'];
				if (navigator && navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position){
                        self.currentLat = position.coords.latitude; 
                        self.currentLong = position.coords.longitude;
                        VenueService.latitude = self.currentLat;
                        VenueService.longitude = self.currentLong;
                        self.afterGettingLocation(self.currentLat, self.currentLong);
                        self.$apply(function(){
                            self.position = position;
                            });
                    });
                } else{

                    $http({
                        method: 'GET',
                        url: RestURL.baseURL + '/venues/cities'
                    }).then(function(success) {
                        self.listOfCities = success.data.cities;
                        $log.info('Success getting cities.');
                    },function(error) {
                        $log.error('Error: '+error);
                    });
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
    		
            self.afterGettingLocation = function(lat, long) {
                $http({
                    method: 'GET',
                    url: RestURL.baseURL + '/venues/cities?lat=' + lat + '&lng=' + long
                }).then(function(success) {
                    self.listOfCities = success.data.cities;
                    $log.info('Success getting cities.');
                },function(error) {
                    $log.error('Error: '+error);
                });
            };
    }]);