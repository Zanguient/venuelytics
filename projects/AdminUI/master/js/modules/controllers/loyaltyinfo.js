/**=========================================================
 * Module: beaconInfo.js
 * smangipudi
 =========================================================*/

App.controller('LoyaltyLevelController', ['$scope', '$state', '$stateParams', 'RestServiceFactory', 'toaster', 'FORMATS', function($scope, $state, $stateParams, RestServiceFactory, toaster, FORMATS) {
  'use strict';
    
    if($stateParams.id != 'new') {
	    var promise = RestServiceFactory.LoyaltyService().get({id:$stateParams.id});
	    promise.$promise.then(function(data) {
	    	$scope.data = data;
	    },function(error){
    		if (typeof error.data != 'undefined') { 
    			toaster.pop('error', "Server Error", error.data.developerMessage);
    		}
    	} );
    }
    $scope.data ={};
    $scope.update = function(isValid, data) {
    	console.log(data);
    	if (!isValid) {
    		return;
    	}
    	var displayAttributes = data.displayAttributes;
    	data.displayAttributes = JSON.stringify(displayAttributes);
    	data.conditionType = "V";
    	var payload = RestServiceFactory.cleansePayload('LoyaltyService', data);
    	var target = {id: data.id};
    	if ($stateParams.id == 'new'){
    		target = {};
    	}
    	RestServiceFactory.LoyaltyService().save(target,payload, function(success){
    		$state.go('app.loyalty');
    	},function(error){
    		if (typeof error.data != 'undefined') { 
    			toaster.pop('error', "Server Error", error.data.developerMessage);
    		}
    	});
    }
}]);