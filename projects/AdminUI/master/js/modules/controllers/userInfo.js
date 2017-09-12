/**=========================================================
 * Module: userInfo.js
 * smangipudi
 =========================================================*/

App.controller('UserController', ['$scope', '$state', '$stateParams', 'RestServiceFactory', 'toaster', 'FORMATS', 
    function($scope, $state, $stateParams, RestServiceFactory, toaster, FORMATS) {
   
   'use strict';
    
    if($stateParams.id !== 'new') {
	    var promise = RestServiceFactory.UserService().get({id:$stateParams.id});
	    promise.$promise.then(function(data) {
	    	if (data.phone !== null) {
	    		data.phone = $.inputmask.format(data.phone,{ mask: FORMATS.phoneUS} );
	    	}
	    	data.enabled = data.enabled ? "true" : "false";
	    	$scope.data = data;
	    });
    } else {
    	var data = {};
    	data.enabled = "false";
    	data.role = 'marketing';
    	$scope.data = data;
    }
	 
    $scope.userRoles = {};
    $scope.userRoles[1] = 'Basic User';
    $scope.userRoles[2] = 'Bouncer';
    $scope.userRoles[3] = 'Bartender';
    $scope.userRoles[4] = 'Waitress';
    $scope.userRoles[5] = 'DJ';
    $scope.userRoles[6] = 'Karaoke Manager';
    $scope.userRoles[7] = 'Artist';
    $scope.userRoles[8] = 'Host';
    $scope.userRoles[50] = 'Promotor';
    $scope.userRoles[51] = 'Service Manager';
    $scope.userRoles[100] = 'Venue Manager';
    $scope.userRoles[500] = 'Owner';
    $scope.userRoles[1000] = 'Administrator';
    $scope.userRoles[10] = 'Agent';
    $scope.userRoles[11] = 'Agent Manager';
    $scope.userRoles[12] = 'Store Manager';
    
    $scope.stores = [];
   // var storePromise = RestServiceFactory.VenueService().get();
    //storePromise.$promise.then(function(data) {
    //	$scope.stores = data.stores;
  //  });
    
    $scope.storeAddress = function(store) {
    	return store.address.concat(", ", store.city, ", " , store.state);
    };
    $scope.update = function(isValid, data) {
    	if (!isValid) {
    		return;
    	}
    	var payload = RestServiceFactory.cleansePayload('UserService', data);
    	var target = {id: data.id};
    	if ($stateParams.id === 'new'){
    		target = {};
    	}
    	RestServiceFactory.UserService().save(target,payload, function(success){
    		$state.go('app.users');
    	},function(error){
    		if (typeof error.data !== 'undefined') { 
    			toaster.pop('error', "Server Error", error.data.developerMessage);
    		}
    	});
    };
}]);