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
	        /*var actionHtml = ('<button title="Edit" class="btn btn-default btn-oval fa fa-edit"></button>');*/

              var actionHtml = ('<button title="Edit" class="btn btn-default btn-oval fa fa-edit" ng-click="editServiceTimings(' +row +','+cellData+')" ></button>');
              /*var actionHtml =  '<button title="Edit" class="btn btn-default btn-oval fa fa-edit" ng-click="editServiceTimings(' +row +','+cellData+')">' +
              '</button>&nbsp;&nbsp;<button title="Delete" class="btn btn-default btn-oval fa fa-trash" '+
              'ng-click="deleteServiceTimings(' +row +','+cellData+')"></button>';*/

	        $(td).html(actionHtml);
	        $compile(td)($scope);
	      }
	    }];
	    DataTableService.initDataTable('venue_service_time_table', columnDefinitions, false);
	    var table = $('#venue_service_time_table').DataTable();
	    var target={id: $stateParams.id};
	    RestServiceFactory.VenueService().getServiceTimings(target, function(data) {
            //$scope.serviceTimings = data;
	    	$scope.data = data;
	    	$.each(data, function (i, d) {
        		table.row.add([d.day, d.type, d.startTime + " - " + d.endTime, d.lastCallTime, d.value, d]);
      		});
      		table.draw();
	    });



        /*var promise = RestServiceFactory.VenueService().getServiceTimings({id: $stateParams.id});
        promise.$promise.then(function(data) {

            $scope.serviceTimings = [];
            data.map(function(service) {
                $scope.serviceTimings[service.id] = service;
                // table.row.add([ service.venueNumber, service.type, service.day, service.startTime, service.endTime, service.lastCallTime, service.valueUnit, service.value, service.valueText]);
                table.row.add([ service.day, service.type, service.startTime, service.endTime, service.lastCallTime, service.value, service.venueNumber, service.valueUnit,service.valueText]);
            });

            table.draw();
        });*/
       /* $scope.editService = function(rowId, colId) {
            var table = $('#venue_service_time_table').DataTable();
            var d = table.row(rowId).data();
            $scope.service = $scope.serviceTimings[d[8]];

            ngDialog.openConfirm({
                template: 'app/templates/content/service-time-info.html',
                // plain: true,
                className: 'ngdialog-theme-default',
                scope : $scope
            }).then(function (value) {
                $('#tables_table').dataTable().fnDeleteRow(rowId);
                var t = $scope.service;
                table.row.add([t.day, t.type, t.startTime + " - " + t.endTime, t.lastCallTime, t.value, t]);
                table.draw();
            },function(error){

            });
        };*/

	};
          $scope.editServiceTimings = function(rowId, productId) {
              $state.go('app.editServiceHours', {venueNumber: $stateParams.id, id:productId});
          };

          $scope.createServiceTimings = function() {
              $state.go('app.editServiceHours', {venueNumber: $stateParams.id, id: 'new'});
          };

          $scope.deleteServiceTimings = function(rowId, productId) {
             //
          };
	$timeout(function(){
		$scope.initServiceTimeTable();
	});
}]);