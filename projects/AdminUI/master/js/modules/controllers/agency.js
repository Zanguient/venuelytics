/**=========================================================
 * Module: userInfo.js
 * smangipudi
 =========================================================*/

App.controller('AgencyController', ['$scope', '$state', '$stateParams', 'RestServiceFactory', 'toaster', 'FORMATS',
    function($scope, $state, $stateParams, RestServiceFactory, toaster, FORMATS) {
  'use strict';
    
    if($stateParams.id !== 'new') {
	    var promise = RestServiceFactory.AgencyService().get({id:$stateParams.id});
	    promise.$promise.then(function(data) {
	    	if (data.phone !== null) {
	    		data.phone = $.inputmask.format(data.phone,{ mask: FORMATS.phoneUS} );
	    	}
	    	if (data.mobile !== null) {
	    		data.mobile = $.inputmask.format(data.mobile,{ mask: FORMATS.phoneUS} );
	    	}
	    	$scope.data = data;
	    });
    } else {
    	var data = {};
    	data.enabled = "false";
    	$scope.data = data;
    }
	 
    
    $scope.update = function(isValid, data) {
    	if (!isValid) {
    		return;
    	}
    	var payload = RestServiceFactory.cleansePayload('AgencyService', data);
    	var target = {id: data.id};
    	if ($stateParams.id === 'new'){
    		target = {};
    	}
    	RestServiceFactory.AgencyService().save(target,payload, function(success){
    		$state.go('app.agencies');
    	},function(error){
    		if (typeof error.data !== 'undefined') { 
    			toaster.pop('error', "Server Error", error.data.developerMessage);
    		}
    	});
    };
}]);