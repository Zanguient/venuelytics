/**=========================================================
 * Module: private-event-controller.js
 *smangipudi
 =========================================================*/
App.controller('PrivateEventController', ['$scope', '$state', '$stateParams', '$compile', '$timeout', 'DataTableService',
							'RestServiceFactory', 'toaster', 'FORMATS',  function($scope, $state, $stateParams, $compile, $timeout, DataTableService, 
								RestServiceFactory, toaster, FORMATS) {
    'use strict';
    var promise = RestServiceFactory.ProductService().getPrivateEvent({id:0, productId: $stateParams.id});
    $scope.venueNumber = $stateParams.venueNumber;
    promise.$promise.then(function(data) {
 	    $scope.data = data;
        $scope.imageUrl = data.imageUrls;
    });
	$scope.update = function(isValid, data, num) {
		data.brand = "BanquetHall";
		data.productType = "BanquetHall";
       	data.category = "BanquetHall";
    	if (!isValid) {
    		return;
    	}
        data.imageUrls = $scope.imageUrl;
        $scope.imageUrl = [];
        angular.forEach(data.imageUrls, function(value, key){ 
            var venueImageId = {
                "id" : value.id
            }
            $scope.imageUrl.push(venueImageId);
        });
        data.imageUrls = $scope.imageUrl;
    	var payload = RestServiceFactory.cleansePayload('ProductService', data);
    	//var target = {id: data.id};
    	var target = {id:data.venueNumber, productId: $stateParams.id};
    	if ($stateParams.id == 'new'){
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
    $scope.uploadFile = function(PrivateImage) {
        var fd = new FormData();
        fd.append("file", PrivateImage[0]);
        var payload = RestServiceFactory.cleansePayload('PrivateImage', fd);
        RestServiceFactory.VenueImage().uploadPrivateImage(payload, function(success){
          if(success != {}){
            $scope.imageUrl.push(success);
            toaster.pop('success', "Image upload successfull");
            document.getElementById("clear").value = "";
          }
        },function(error){
            if (typeof error.data != 'undefined') {
                toaster.pop('error', "Server Error", error.data.developerMessage);
            }
        });
    };
 
}]);