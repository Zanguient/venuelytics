/**
 * @author Saravanakumar K
 * @date 18-MAY-2017
 */

app.controller('HomeController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService',
    function ($log, $scope, $http, $location, RestURL, VenueService) {

    		$log.log('Inside Home Controller.');
    		
    		var self = $scope;

            self.selectedCountry = 'Northen America';

            self.countries = ['Northen America', 'Canada', 'South America', 'India'];

            self.init = function() {
                $http({
                    method: 'GET',
                    url: RestURL.baseURL + '/venues/cities'
                }).then(function(success) {
                    self.listOfCities = success.data.cities;
                    $log.info("Success getting cities.");
                },function(error) {
                    $log.error("Error: "+error);
                });
            };

            self.init();


    		self.selectCity = function(cityName) {
                $location.url('/venues/'+cityName);
    		};

            self.selectedCountry = function(country) {
                $log.info("selectedCountry :"+country);
            };
    		
    }]);