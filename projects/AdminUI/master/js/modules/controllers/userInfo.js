/**=========================================================
 * Module: userInfo.js
 * smangipudi
 =========================================================*/

App.controller('UserController', ['$scope', '$state', '$stateParams', 'RestServiceFactory', 'toaster', 'FORMATS', function($scope, $state, $stateParams, RestServiceFactory, toaster, FORMATS) {
  'use strict';
    
    if($stateParams.id != 'new') {
	    var promise = RestServiceFactory.UserService().get({id:$stateParams.id});
	    promise.$promise.then(function(data) {
	    	if (data.phone != null) {
	    		data.phone = $.inputmask.format(data.phone,{ mask: FORMATS.phoneUS} );
	    	}
	    	data.enabled = data.enabled ? "true" : "false";
	    	$scope.data = data;
	    });
    } else {
    	var data = {}
    	data.enabled = "false";
    	data.role = 'marketing';
    	$scope.data = data;
    }
	 
    $scope.user_roles = {};
    $scope.user_roles['USER'] = 'Basic User';
    $scope.user_roles['BOUNCER'] = 'Bouncer';
    $scope.user_roles['BARTENDER'] = 'Bartender';
    $scope.user_roles['WAITRESS'] = 'Waitress';
    $scope.user_roles['DJ'] = 'DJ';
    $scope.user_roles['KAROKE_MGR'] = 'Karaoke Manager';
    $scope.user_roles['ARTIST'] = 'Artist';
    $scope.user_roles['MANAGER'] = 'Manager';
    $scope.user_roles['OWNER'] = 'Owner';
    $scope.user_roles['ADMIN'] = 'Administrator';
    $scope.user_roles['AGENT'] = 'Agent';
    $scope.user_roles['AGENT_MANAGER'] = 'Administrator';
    
    $scope.stores = [];
   // var storePromise = RestServiceFactory.StoreService().get();
    //storePromise.$promise.then(function(data) {
    //	$scope.stores = data.stores;
  //  });
    
    $scope.storeAddress = function(store) {
    	return store.address.concat(", ", store.city, ", " , store.state);
    }
    $scope.update = function(isValid, data) {
    	if (!isValid) {
    		return;
    	}
    	var payload = RestServiceFactory.cleansePayload('UserService', data);
    	var target = {id: data.id};
    	if ($stateParams.id == 'new'){
    		target = {};
    	}
    	RestServiceFactory.UserService().save(target,payload, function(success){
    		$state.go('app.users');
    	},function(error){
    		if (typeof error.data != 'undefined') { 
    			toaster.pop('error', "Server Error", error.data.developerMessage);
    		}
    	});
    }
}]);