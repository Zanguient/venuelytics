/**
 * @author Saravanakumar K
 * @date 18-MAY-2017
 */

app.controller('VenueController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService', '$window','$routeParams', 'AjaxService',
    function ($log, $scope, $http, $location, RestURL, VenueService, $window, $routeParams, AjaxService) {

    		$log.log('Inside Venue Controller.');
    		
    		var self = $scope;

            self.selectedCityDistance = VenueService.cityDistance;
            self.cityInfo = VenueService.selectedCityInfo
            self.barTab = self.cityInfo.counts.BAR;
            self.karaokeTab = self.cityInfo.counts.KARAOKE;
            self.bowlingTab = self.cityInfo.counts.BOWLING;
            self.clubTab = self.cityInfo.counts.CLUB;
            self.restaurantTab = self.cityInfo.counts.RESTAURANT;
            self.casinoTab = self.cityInfo.counts.CASINO;
            $scope.setTab = function(type){
                self.selectedCityName = $routeParams.cityName;
                VenueService.selectedVenueType = type;
                VenueService.selectedCity = self.selectedCityName;
                AjaxService.getVenuesByType(self.selectedCityName, type, VenueService.latitude, VenueService.longitude).then(function(response) {
                    self.listOfVenuesByCity = response;
                });
            };

    		self.selectVenue = function(venue) {
                VenueService.selectedVenueDetails = venue;
    			$location.url('/venueDetails');
    		};

            self.selectedServices = function() {
                $log.info('Inside selected services');
            };
    		
    }]);