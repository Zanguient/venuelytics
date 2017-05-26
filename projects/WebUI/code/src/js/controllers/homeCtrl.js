/**
 * @author Saravanakumar K
 * @date 25-MAY-2017
 */

app.controller('HomeController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService',
    function ($log, $scope, $http, $location, RestURL, VenueService) {

    		$log.log('Inside Home Controller.');
    		
    		var self = $scope;
    		self.statusForTab1 = 'active';

    		self.navBar = function(tab) {
    			if(tab == 1) {
	    			self.statusForTab1 = 'active';
	    			self.statusForTab2 = '';
	    			self.statusForTab3 = '';
    			} else if(tab == 2) {
    				self.statusForTab1 = '';
	    			self.statusForTab2 = 'active';
	    			self.statusForTab3 = '';
    			} else {
    				self.statusForTab1 = '';
	    			self.statusForTab2 = '';
	    			self.statusForTab3 = 'active';
    			}
    		};
    }]);