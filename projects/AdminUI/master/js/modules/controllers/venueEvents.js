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

  function formatDate(value)
  {
    return value.getMonth()+1 + "/" + value.getDate() + "/" + value.getYear();
  }
  $scope.editEvent = function(rowId, colId) {
  	var table = $('#events_table').DataTable();
    var d = table.row(rowId).data();
    $scope.deal = $scope.dealMap[d[8]];
    
    ngDialog.openConfirm({
        template: 'app/templates/content/form-deal-info.html',
        // plain: true,
        className: 'ngdialog-theme-default',
        scope : $scope 
      }).then(function (value) {
        $('#tables_table').dataTable().fnDeleteRow(rowId);
        var t = $scope.deal;
        table.row.add([t.name, t.price, t.servingSize, t.description, t.enabled,  t.id]);
        table.draw();
        },function(error){
          
      });
  };
  $scope.TIME = function(d) {
    var t = d.split(":");
    var h = parseInt(t[0]);
    var m = parseInt(t[1]);
    var pm = false;
    if (h > 11) {
      pm = true;
    }

    return ((h % 12) + ':' + h) + (pm ? ' PM' : ' AM');
  }
	$scope.deleteEvent = function(index, eventId) {
			$scope.events.splice(index,1);
	};
	$scope.createNewEvent = function() {
		$state.go('app.editVenueEvent', {venueNumber: $stateParams.id, id: 'new'});
	};

  $scope.editEvent = function(eventId) {
    $state.go('app.editVenueEvent', {venueNumber: $stateParams.id, id: eventId});
  };

  $scope.enableDisableColor = function(enabled) {
    return enabled === 'Y' ? 'circle-green' : 'circle-gray';
  };
}]);