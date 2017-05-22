app.controller('businessController', ['$log', '$scope', '$http', '$location', 'RestURL', 'VenueService', '$window','$routeParams',
    function ($log, $scope, $http, $location, RestURL, VenueService, $window, $routeParams) {

    		$log.log('Inside Business Controller.');
    		
    		var self = $scope;
            self.createBusiness = false;
            self.businessData = false;
            self.hideForm = false;
            self.init = function() {
            };

            self.init();

            self.search = function(){
            	$http({
                    method: 'GET',
                    url: RestURL.baseURL + '/venues?&search=' + self.searchBusiness + '&from=0&size=10'
                }).then(function(success) {
                    self.businessDetails = success.data.venues;
                    self.businessImage = self.businessDetails[0].imageUrls[0].originalUrl;
                    self.venueName = self.businessDetails[0].venueName;
                    self.venueAddress = self.businessDetails[0].address;

                },function(error) {
                    $log.error("Error: "+error);
                });
            };
            
            self.createBusinessMethod = function(){
            	self.createBusiness = true;
            };
            
            self.cancel = function() {
            	self.createBusiness = false;
            };
            
            self.businessSubmit = function() {
            	self.businessData = true;
            	self.hideForm = true;
            };
    		
    }]);
