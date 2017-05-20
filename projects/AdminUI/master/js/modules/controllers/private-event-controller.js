/**=========================================================
 * Module: private-event-controller.js
 *smangipudi
 =========================================================*/
App.controller('PrivateEventController', ['$scope', '$state', '$stateParams', '$compile', '$timeout', 'DataTableService','RestServiceFactory', 'toaster', 'FORMATS', 
                                  function($scope, $state, $stateParams, $compile, $timeout, DataTableService, RestServiceFactory, toaster, FORMATS) {
  'use strict';
  
 
     
 var promise = RestServiceFactory.ProductService().getPrivateEvent({id:0, productId: $stateParams.id});
 promise.$promise.then(function(data) {
	 $scope.data = data;
 });

 
}]);