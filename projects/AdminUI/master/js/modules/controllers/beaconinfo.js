/**=========================================================
 * Module: beaconInfo.js
 * smangipudi
 =========================================================*/

App.controller('BeaconController', ['$scope', '$state', '$stateParams', 'RestServiceFactory', 'toaster', 'FORMATS', function($scope, $state, $stateParams, RestServiceFactory, toaster, FORMATS) {
  'use strict';
    
    if($stateParams.id != 'new') {
	    var promise = RestServiceFactory.BeaconService().get({id:$stateParams.id});
	    promise.$promise.then(function(data) {
	    	$scope.data = data;
	    });
    } else {
    	var data = {};
    	data.enabled = 'N';
    	$scope.data = data;
    	
    }
    var storePromise = RestServiceFactory.StoreService().get();
    storePromise.$promise.then(function(data) {
    	$scope.stores = data.stores;
    });
    
    $scope.storeAddress = function(store) {
    	return store.address.concat(", ", store.city, ", " , store.state);
    }
    $scope.update = function(isValid, data) {
    	if (!isValid) {
    		return;
    	}
    	var payload = RestServiceFactory.cleansePayload('BeaconService', data);
    	var target = {id: data.id};
    	if ($stateParams.id == 'new'){
    		target = {};
    	}
    	RestServiceFactory.BeaconService().save(target,payload, function(success){
    		$state.go('app.beacons');
    	},function(error){
    		if (typeof error.data != 'undefined') { 
    			toaster.pop('error', "Server Error", error.data.developerMessage);
    		}
    	});
    }
}]);