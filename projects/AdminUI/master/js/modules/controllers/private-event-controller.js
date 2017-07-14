/**=========================================================
 * Module: private-event-controller.js
 *smangipudi
 =========================================================*/
App.controller('PrivateEventController', ['$scope', '$state', '$stateParams', '$compile', '$timeout', 'DataTableService',
							'RestServiceFactory', 'toaster', 'FORMATS',  function($scope, $state, $stateParams, $compile, $timeout, DataTableService, 
								RestServiceFactory, toaster, FORMATS) {
    'use strict';
    var promise = RestServiceFactory.ProductService().getPrivateEvent({id:$stateParams.venueNumber, productId: $stateParams.id});
    $scope.venueNumber = $stateParams.venueNumber;
    if($stateParams.id == ''){
        promise.$promise.then(function(data) {
     	    $scope.data = data;
        });
    }
	$scope.update = function(isValid, data, num) {
		data.brand = "BanquetHall";
		data.productType = "BanquetHall";
       	data.category = "BanquetHall";
    	if (!isValid) {
    		return;
    	}
    	var payload = RestServiceFactory.cleansePayload('ProductService', data);
    	//var target = {id: data.id};
    	var target = {id:data.venueNumber, productId: $stateParams.id};
    	if ($stateParams.id == ''){
    		target = {id: num}, {};
    	}
    	RestServiceFactory.ProductService().updatePrivateEvent(target,payload, function(success){
            $state.go('app.storeedit', {id : $scope.venueNumber});
    	},function(error){
    		if (typeof error.data != 'undefined') { 
    			toaster.pop('error', "Server Error", error.data.developerMessage);
    		}
    	});
    }
 
}]);