/**
 * @author Saravanakumar K
 * @date 18-MAY-2017
 */

app.controller('VenueController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService', '$window','$routeParams',
    function ($log, $scope, $http, $location, RestURL, VenueService, $window, $routeParams) {

    		$log.log('Inside Venue Controller.');
    		
    		var self = $scope;

            self.tab = 1;

            self.init = function() {
                self.city = $routeParams.cityName;
                $http({
                    method: 'GET',
                    url: RestURL.baseURL + '/venues?&city=' + self.city + '&from=0&size=10'
                }).then(function(success) {
                    self.listOfVenuesByCity = success.data.venues;
                },function(error) {
                    $log.error('Error: ' + error);
                });

                $log.info('Init Venues By Cities Completed.');
            };

            self.init();

            $scope.setTab = function(newTab){
              self.tab = newTab;
            };

            $scope.isSet = function(tabNum){
              return self.tab === tabNum;
            };

    		self.selectVenue = function(venue) {
                VenueService.selectedVenueDetails = venue;
    			$location.url('/venueDetails');
    		};
    		
    }]);