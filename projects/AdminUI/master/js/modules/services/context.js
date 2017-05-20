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
			this.serverName = 'dev.api.venuelytics.com';
			this.contextName = '//dev.api.venuelytics.com/WebServices/rsapi';
			return this;
		}]);