/**=========================================================
 * Module: profile.js
 * smangipudi
 =========================================================*/

App.controller('ProfileController', ['$scope', '$state', 'RestServiceFactory', 'toaster', 'FORMATS', 'Session', 
                                     function($scope, $state, RestServiceFactory, toaster, FORMATS, Session) {
  'use strict';
    

    var promise = RestServiceFactory.ProfileService().get({id: "L"+Session.userId});
    promise.$promise.then(function(data) {
    	if (data.phone != null) {
    		data.phone = $.inputmask.format(data.phone,{ mask: FORMATS.phoneUS} );
    	}
    	$scope.data = data;
    });
  
    $scope.update = function(isValid, data) {
    	if (!isValid || !$('#profileInfo').parsley().isValid())  {
    		return;
    	}
    	var payload = RestServiceFactory.cleansePayload('ProfileService', data);
    	var target = {id: data.id};
    	
    	RestServiceFactory.ProfileService().save(target,payload, function(success){
    		toaster.pop('sucess', "Profile saved successfully.");
    	},function(error){
    		if (typeof error.data != 'undefined') { 
    			toaster.pop('error', "Server Error", error.data.developerMessage);
    		}
    	});
    }
}]);