/**
 * =======================================================
 * Module: venueevents.js
 * smangipudi 
 * =========================================================
 */

App.controller('VenueEventsController', ['$scope', '$state','$compile','$timeout', 'RestServiceFactory', '$stateParams','Session','ContextService', 'APP_EVENTS',
                                   function($scope, $state, $compile, $timeout, RestServiceFactory, $stateParams, Session, contextService, APP_EVENTS) {
  'use strict';
  
  $scope.events = [];
  var target = {};

  $scope.init = function() {
      $scope.getEvents(contextService.userVenues.selectedVenueNumber);
  };
  
  
  $scope.getEvents = function(id) {
    var target = {id: id};
    var promise = RestServiceFactory.VenueService().getEvents(target);  
      promise.$promise.then(function(data) {
      $scope.events = data['venue-events'];
    });
  };

  function formatDate(value) {
    return value.getMonth()+1 + "/" + value.getDate() + "/" + value.getYear();
  }
  
  $scope.enableCreateEvent = function() {
    return Session.roleId >= 50;
  };

	$scope.createNewEvent = function() {
		$state.go('app.editVenueEvent', {venueNumber: contextService.userVenues.selectedVenueNumber, id: 'new'});
	};

  $scope.$on(APP_EVENTS.venueSelectionChange, function(event, data) {
    $scope.getEvents(contextService.userVenues.selectedVenueNumber);
  });

  $scope.$on(APP_EVENTS.deleteEvent, function(event, data) {
    var index = -1;

    for (var idx = 0 ; idx < $scope.events.length;  idx++) {
      if ($scope.events[idx].id === data.event.id ) {
        index = idx;
      }
    }
    if (index > -1) {
      $scope.events.splice(index,1);
    }

  });

  $scope.init();
  
}]);