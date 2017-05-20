/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */

app.controller('VenueDetailsController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService', '$window',
    function ($log, $scope, $http, $location, RestURL, VenueService, $window) {

    		$log.log('Inside Venue Details Controller.');
    		
    		var self = $scope;

            self.init = function() {

                self.detailsOfVenue = VenueService.selectedVenueDetails;
                self.resevationURL = RestURL.adminURL+'reservation/'+self.detailsOfVenue.id;
                $log.info("resevationURL:"+self.resevationURL);
                $log.info("Venue details-->");
            };

            self.init();
    		
    }]);