/**
 * @author Saravanakumar K
 * @date 25-MAY-2017
 */

app.controller('HomeController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService','$translate',
    function ($log, $scope, $http, $location, RestURL, VenueService, $translate) {

    		$log.log('Inside Home Controller.');
    		
    		var self = $scope;

    		self.changeLanguage = function(lang){
   				$translate.use(lang); 
   			}
    }])	;