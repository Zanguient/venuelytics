/**
 * @author Saravanakumar K
 * @date 18-MAY-2017
 */

app.controller('VenueController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService', '$window','$routeParams',
    function ($log, $scope, $http, $location, RestURL, VenueService, $window, $routeParams) {

    		$log.log('Inside Venue Controller.');
    		
    		var self = $scope;

            self.init = function() {
                var cityName = $routeParams.cityName;
                $http({
                    method: 'GET',
                    url: RestURL.baseURL + '/venues?&city=' + cityName + '&from=0&size=10'
                }).then(function(success) {
                    $log.info("Success data-->");
                    self.listOfVenuesByCity = success.data.venues;
                },function(error) {
                    $log.error("Error"+error);
                });

                $log.info("Init Venues By Cities Completed");
            };

            self.init();

    		self.selectVenue = function(venue) {
    			$log.info("Selected Venue-->");
                VenueService.selectedVenueDetails = venue;
    			$location.url('/venueDetails');
    		};
    		
    }]);