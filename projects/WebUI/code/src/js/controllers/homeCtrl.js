/**
 * @author Saravanakumar K
 * @date 18-MAY-2017
 */

app.controller('HomeController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService',
    function ($log, $scope, $http, $location, RestURL, VenueService) {

    		$log.log('Inside Home Controller.');
    		
    		var self = $scope;

            self.init = function() {
                $http({
                    method: 'GET',
                    url: RestURL.baseURL + '/venues/cities'
                }).then(function(success) {
                    self.listOfCities = success.data.cities;
                    $log.info("Success data-->");
                },function(error) {
                    $log.error("Error"+error);
                });
            };

            self.init();


    		self.selectCity = function(cityName) {
                $location.url('/venues/'+cityName);
    		};
    		
    }]);