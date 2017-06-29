/**=========================================================
 * Module: login_auth.js
 * smangipudi
 * https://medium.com/opinionated-angularjs/techniques-for-authentication-in-angularjs-applications-7bbf0346acec
 =========================================================*/
 
App.service('ContextService',['$location', function($location) {
			/*var urlPath = $location.absUrl();
			var parts = urlPath.split("/");
			var index = 0;
			for (var i = 0; i < parts.length; i++) {
			   if (parts[i] == "WebUI") {
				   index = i-1;
			   }
			}*/
	//dev.api.venuelytics.com
			'use strict';
			this.serverName = 'dev.api.venuelytics.com';
			this.contextName = '//dev.api.venuelytics.com/WebServices/rsapi';

			this.userVenues = {
	            selectedVenueNumber: 521,
	            selectedVenueName :"Monte Carlo",
	            listIsOpen : false,
	            available: {
	                    'Monte Carlo' : 521,
	                    'Myth': 832,
	                    'Test Venue' : 170568
	            }
        	};
        	this.setVenue = function (venueName, venueNumber) {
                this.userVenues.listIsOpen = ! $scope.userVenues.listIsOpen;
                this.userVenues.selectedVenueNumber = venueNumber;
                this.userVenues.selectedVenueName = venueName;
            };
			return this;
		}]);