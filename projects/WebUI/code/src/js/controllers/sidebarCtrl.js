/**
 * @author Thomas
 * @date 28-MAY-2017
 */

app.controller('sidebarController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService', '$window',
    function ($log, $scope, $http, $location, RestURL, VenueService, $window) {

    		$log.log('Inside Venue Details Controller.');
    		
    		var self = $scope;

            self.init = function() {

                
            };

            self.navigateMenu = function(menu){

                $log.debug('inside navigateMenu')
                $('#ms-slidebar').toggle();
                $location.url('/'+menu);
            }

            self.init();
    		
    }]);