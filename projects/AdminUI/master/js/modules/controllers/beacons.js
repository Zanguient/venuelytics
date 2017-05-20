/**
 * ========================================================= 
 * Module: beacons.js 
 * smangipudi
 * =========================================================
 */

App.controller('BeaconsController', ['$scope', '$state','$compile', '$timeout', 'RestServiceFactory', 'DataTableService', 'toaster',  
                                     function($scope, $state, $compile, $timeout, RestServiceFactory, DataTableService, toaster) {
  'use strict';

  $timeout(function(){

    if ( ! $.fn.dataTable ) return;
    var columnDefinitions = [ 
       { sWidth: "25%", aTargets: [0,1] },
       { sWidth: "7%", aTargets: [2] },
       { sWidth: "10%", aTargets: [3,4] },
       {
    	"targets": [5],
    	"orderable": false,
    	"createdCell": function (td, cellData, rowData, row, col) {
    		$(td).html('<button class="btn btn-default btn-oval fa fa-edit" ng-click="editBeacon('+cellData+')"></button>&nbsp;&nbsp;<button class="btn btn-default btn-oval fa fa-trash" ng-click="deleteBeacon(' +row +','+cellData+')"></button>');
   		 	$compile(td)($scope);
    	}
	 },{
	    	"targets": [3],
	    	"orderable": false,
	    	"createdCell": function (td, cellData, rowData, row, col) {
	    		
	    		var actionHtml = '<em class="fa fa-check-square-o"></em>';
	    		if (cellData == "N"){
	    			actionHtml = '<em class="fa fa-square-o"></em>';
	    		}
	    		$(td).html(actionHtml);
	    		$compile(td)($scope);
	    	}
	 } ];
   
    DataTableService.initDataTable('beacons_table', columnDefinitions);
    
    var promise = RestServiceFactory.BeaconService().get();
    
     promise.$promise.then(function(data) {
		 var table = $('#beacons_table').DataTable();
		 data.beacons.map(function(beacon) {
			 table.row.add([beacon.beaconName, beacon.description, beacon.storeNumber, beacon.enabled, beacon.aisleName, beacon.id]);
		 });
		 table.draw();
    });
    $scope.editBeacon = function(beaconId) {
   		$state.go('app.beaconedit', {id: beaconId});
   	}
   	$scope.deleteBeacon = function(rowId, beaconId) {

   		if(!window.confirm('Do you want to delete this beacon!')){
   			$log.log("confirmation has been called!");
   			return;
   		}
   		
   		var target = {id: beaconId};
   		RestServiceFactory.BeaconService().delete(target,  function(success){
     		var table = $('#beacons_table').dataTable();
     		table.fnDeleteRow(rowId);
     	},function(error){
     		if (typeof error.data != 'undefined') { 
     			toaster.pop('error', "Server Error", error.data.developerMessage);
     		}
     	});
   	}
   	$scope.createNewBeacon = function() {
   		$state.go('app.beaconedit', {id: 'new'});
   	}
  });
}]);