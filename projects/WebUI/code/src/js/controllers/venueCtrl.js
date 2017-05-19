/**
 * @author Saravanakumar K
 * @date 18-MAY-2017
 */

app.controller('VenueController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService', '$window',
    function ($log, $scope, $http, $location, RestURL, VenueService, $window) {

    		$log.log('Inside Venue Controller.');
    		
    		var self = $scope;

            self.init = function() {
                $window.scrollTo(0, 0);
                self.listOfVenuesByCity = VenueService.venueByCityName;
                $log.info("Service value-->");
            };

            self.init();

    		self.selectVenue = function(venue) {
    			$log.info("Selected Venue-->");
                VenueService.selectedVenueDetails = venue;
    			$location.url('/venueDetails');
    		};
    		
    }]);