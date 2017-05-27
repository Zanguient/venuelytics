/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */

app.controller('VenueDetailsController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService', '$window',
    function ($log, $scope, $http, $location, RestURL, VenueService, $window) {

    		$log.log('Inside Venue Details Controller.');
    		
    		var self = $scope;

            self.init = function() {

                self.selectedCity = VenueService.selectedCity;
                self.selectedType = VenueService.selectedVenueType;
                self.detailsOfVenue = VenueService.selectedVenueDetails;
                self.venueName =    self.detailsOfVenue.venueName;
                self.resevationURL = RestURL.adminURL+'reservation/'+self.detailsOfVenue.id;

                iFrameResize({
                        log                     : false,                  // Enable console logging
                        inPageLinks             : false,
                        heightCalculationMethod: 'max',
                        widthCalculationMethod: 'min',
                        sizeWidth: false,
                        checkOrigin: false
                    });
            };

            self.init();
    		
    }]);