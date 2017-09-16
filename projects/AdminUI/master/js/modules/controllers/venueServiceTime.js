/**=========================================================
 * Module: venueServiceTime.js
 * smangipudi
 =========================================================*/
 
 App.controller('VenueServiceTimeController', ['$scope', '$state', '$stateParams',
  'RestServiceFactory', 'toaster', 'FORMATS', '$timeout','DataTableService','$compile','ngDialog',
      function($scope, $state, $stateParams, RestServiceFactory, toaster, FORMATS,
        $timeout,DataTableService, $compile, ngDialog) {


	$scope.initServiceTimeTable = function() {
	    if ( ! $.fn.dataTable || $stateParams.id === 'new') {
	      return;
	    }
	    var columnDefinitions = [
	    {
	     "sWidth" : "20%", aTargets:[0,2],
	     "sWidth" : "15%", aTargets:[1,3,4,5]

	    },
	    {
	      "targets": [5],
	      "orderable": false,
	      "createdCell": function (td, cellData, rowData, row, col) {
	        var actionHtml = ('<button title="Edit" class="btn btn-default btn-oval fa fa-edit"></button>');

	        $(td).html(actionHtml);
	        $compile(td)($scope);
	      }
	    }];
	    DataTableService.initDataTable('venue_service_time_table', columnDefinitions, false);
	    var table = $('#venue_service_time_table').DataTable();
	    var target={id: $stateParams.id};
	    RestServiceFactory.VenueService().getServiceTimings(target, function(data) {
	    	$scope.serviceTimings = data;
	    	$.each(data, function (i, d) {
        		table.row.add([d.day, d.type, d.startTime + " - " + d.endTime, d.lastCallTime, d.value, d]);
      		});
      		table.draw();
	    });

	}
	$timeout(function(){
		$scope.initServiceTimeTable();
	});
}]);