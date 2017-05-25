/**
 * @author Saravanakumar K
 * @date 18-MAY-2017
 */

app.controller('VenueController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService', '$window','$routeParams', 'AjaxService',
    function ($log, $scope, $http, $location, RestURL, VenueService, $window, $routeParams, AjaxService) {

    		$log.log('Inside Venue Controller.');
    		
    		var self = $scope;

            self.selectedCityDistance = VenueService.cityDistance;

            self.tab = 1;

            $scope.setTab = function(newTab, type){
                $log.info('Venue type:'+type);
                self.selectedCityName = $routeParams.cityName;
                VenueService.selectedVenueType = type;
                VenueService.selectedCity = self.selectedCityName;
                AjaxService.getVenuesByType(self.selectedCityName, type, VenueService.latitude, VenueService.longitude).then(function(response) {
                    self.listOfVenuesByCity = response;
                });
                self.tab = newTab;
            };

            $scope.isSet = function(tabNum){
              return self.tab === tabNum;
            };

    		self.selectVenue = function(venue) {
                VenueService.selectedVenueDetails = venue;
    			$location.url('/venueDetails');
    		};

            self.selectedServices = function() {
                $log.info('Inside selected services');
            };
    		
    }]);