/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */
"use strict";
app.controller('VenueDetailsController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', 'APP_COLORS',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, APP_ARRAYS, APP_COLORS) {

    		$log.log('Inside Venue Details Controller.');
    		
            var self = $scope;
            self.init = function() {

                AjaxService.getVenues($routeParams.venueid,null,null).then(function(response) {
                    /*jshint maxcomplexity:10 */
                    self.detailsOfVenue = response;
                    self.selectedCity = $routeParams.cityName;
                    self.venueName =    self.detailsOfVenue.venueName;
                    self.venueImage = response.imageUrls[0].largeUrl;
                    var imageParam = $location.search().i;
                    if(imageParam === 'Y') {
                        self.resevationURL = RestURL.adminURL+'reservation/'+self.detailsOfVenue.id + '?i=' + imageParam;
                    } else {
                        if($routeParams.serviceType === 'p' || $routeParams.serviceType === 'b' || $routeParams.serviceType === 'g') {
                            self.row = 1;
                        } else if($routeParams.serviceType === 't' || $routeParams.serviceType === 'f' || $routeParams.serviceType === 'd') {
                            self.row = 2;    
                        } else if($routeParams.serviceType === 'o' || $routeParams.serviceType === 'e'){
                            self.row = 4;
                        } else {
                            self.row = 1;
                        }
                        self.resevationURL = RestURL.adminURL+'reservation/'+self.detailsOfVenue.id + '?r=' + self.row + '&t=' + $routeParams.serviceType;
                    }
                   
                    iFrameResize({
                            log                     : false,                  // Enable console logging
                            inPageLinks             : false,
                            heightCalculationMethod: 'max',
                            widthCalculationMethod: 'min',
                            sizeWidth: false,
                            checkOrigin: false
                        });

                    $(function(){
                        $('#venueReservationFrame').on('load', function(){
                            $('#loadingVenueDetails').hide();
                            $(this).show();
                        });
                            
                    });
                });
            };

            self.init();
    		
    }]);