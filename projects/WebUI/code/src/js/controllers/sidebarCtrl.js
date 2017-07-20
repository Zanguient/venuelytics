/**
 * @author Thomas
 * @date 28-MAY-2017
 */
"use strict";
app.controller('sidebarController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService', '$window',
    function ($log, $scope, $http, $location, RestURL, VenueService, $window) {

    		$log.log('Inside Sidebar Controller.');
    		
    		var self = $scope;

            self.init = function() {
                var data = $location.search().sb;
                self.showBusinessTab = parseInt(data);
                var newConsumer = $location.search().nc;
                self.showNewConsumer = parseInt(newConsumer);
            };

            self.navigateMenu = function(menu){

                $log.debug('inside navigateMenu');
                $('#ms-slidebar').toggle();
                $location.url('/'+menu);
            };

            self.init();
    		
    }]);