/**
 * =======================================================
 * Module: venueevents.js
 * smangipudi 
 * =========================================================
 */

App.controller('VenueEventsController', ['$scope', '$state','$compile','$timeout', 'RestServiceFactory','DataTableService', 'toaster', '$stateParams','ngDialog',
                                   function($scope, $state, $compile, $timeout, RestServiceFactory, DataTableService, toaster, $stateParams, ngDialog) {
  'use strict';
  
  $scope.events = [];
  var promise = RestServiceFactory.VenueService().getEvents({id: $stateParams.id});
 
  promise.$promise.then(function(data) {
	 $scope.events = data['venue-events'];
  });

  function formatDate(value) {
    return value.getMonth()+1 + "/" + value.getDate() + "/" + value.getYear();
  }
  
  
	$scope.createNewEvent = function() {
		$state.go('app.editVenueEvent', {venueNumber: $stateParams.id, id: 'new'});
	};
  
}]);