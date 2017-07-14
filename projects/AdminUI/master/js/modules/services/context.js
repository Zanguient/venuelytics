/**=========================================================
 * Module: login_auth.js
 * smangipudi
 * https://medium.com/opinionated-angularjs/techniques-for-authentication-in-angularjs-applications-7bbf0346acec
 =========================================================*/
 
App.service('ContextService',['$location','RestServiceFactory', '$rootScope',function($location, RestServiceFactory, $rootScope) {
			
	//dev.api.venuelytics.com
	'use strict';
	
	this.serverName = RestServiceFactory.serverName; 
	this.contextName = RestServiceFactory.contextName; 

	this.userVenues = {
        selectedVenueNumber: 0,
        selectedVenueName : "",
        available: {}
	};
	var self = this;
	var promise = RestServiceFactory.VenueService().get();
	promise.$promise.then(function(data) {
		self.userVenues.available = [];
		var selectedVenueFound = false;
		for (var index in data.venues) {
			var venue = data.venues[index];
			self.userVenues.available.push({name: venue.venueName, id: venue.id});
			if ($rootScope.$storage.selectedVenueNumber == venue.id){
				$rootScope.$storage.selectedVenueName = venue.venueName;
				selectedVenueFound = true;
			}
		}

		if (selectedVenueFound) {
			self.userVenues.selectedVenueNumber = $rootScope.$storage.selectedVenueNumber;
			self.userVenues.selectedVenueName = $rootScope.$storage.selectedVenueName;
		} else {
			var venue = data.venues[0];
			self.userVenues.selectedVenueNumber = venue.id;
			self.userVenues.selectedVenueName = venue.venueName;
			$rootScope.$storage.selectedVenueNumber = venue.id;
      		$rootScope.$storage.selectedVenueName = venue.venueName;
		}
	});
	this.setVenue = function (venueName, venueNumber) {
        this.userVenues.selectedVenueNumber = venueNumber;
        this.userVenues.selectedVenueName = venueName;
        $rootScope.$storage.selectedVenueNumber = venueNumber;
      	$rootScope.$storage.selectedVenueName = venueName;
          
    };
	return this;
}]);