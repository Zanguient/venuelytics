/**=========================================================
 * Module: private-event-controller.js
 *smangipudi
 =========================================================*/
App.controller('PrivateEventController', ['dataShare','$scope', '$state', '$stateParams', '$compile', '$timeout', 'DataTableService',
							'RestServiceFactory', 'toaster', 'FORMATS',  function(dataShare, $scope, $state, $stateParams, $compile, $timeout, DataTableService, 
								RestServiceFactory, toaster, FORMATS) {
  'use strict';
   	$scope.venueNumbers = '';
 var promise = RestServiceFactory.ProductService().getPrivateEvent({id:0, productId: $stateParams.id});
  if($stateParams.id != ''){
 promise.$promise.then(function(data) {
 	$scope.data = data;
 });
}else {
	$scope.venueNumbers = dataShare.venueNumber;
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
    		$state.go('app.stores');
    	},function(error){
    		if (typeof error.data != 'undefined') { 
    			toaster.pop('error', "Server Error", error.data.developerMessage);
    		}
    	});
    }
 
}]);