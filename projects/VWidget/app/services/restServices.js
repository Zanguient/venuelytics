app.factory('RestAPI',['$http', function($http) {
 		'use strict';
 
 		var BASE_URL = "//localhost:8080/WebServices/rsapi/v1";
 		this.contextName = BASE_URL;
 
 		return {
 			getPortalInfo : function(portalName) {
 				return $http({
					method: 'GET',
					url: BASE_URL + '/venues/portal/' + portalName
				});
 			}
 		};
 	
}]);