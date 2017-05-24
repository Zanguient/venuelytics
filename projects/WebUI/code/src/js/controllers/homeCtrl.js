/**
 * @author Saravanakumar K
 * @date 18-MAY-2017
 */

app.controller('HomeController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService',
    function ($log, $scope, $http, $location, RestURL, VenueService) {

    		$log.log('Inside Home Controller.');
    		
    		var self = $scope;

            self.init = function() {
                self.selectedCountry = 'North America';
                self.countries = ['North America', 'Canada', 'South America', 'India'];
				if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position){
                    currentLat = position.coords.latitude; 
                    currentLong = position.coords.longitude;
                    self.$apply(function(){
                        self.position = position;
                        });
                    });
                }
                $http({
                    method: 'GET',
                    url: RestURL.baseURL + '/venues/cities'
                }).then(function(success) {
                    self.listOfCities = success.data.cities;
                    $log.info('Success getting cities.');
                },function(error) {
                    $log.error('Error: '+error);
                });
            };

            self.init();


    		self.selectCity = function(cityName) {
                $location.url('/venues/'+cityName);
    		};

            self.selectedCountry = function(country) {
                $log.info('selectedCountry: '+country);
            };
    		
    }]);