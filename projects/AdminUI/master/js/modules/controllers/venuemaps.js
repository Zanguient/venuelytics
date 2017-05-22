/**
 * =======================================================
 * Module: venuemaps.js
 * smangipudi 
 * =========================================================
 */

App.controller('VenueMapsController', ['$scope', '$state','$compile','$timeout', 'RestServiceFactory','DataTableService', 'toaster', '$stateParams',
                                   function($scope, $state, $compile, $timeout, RestServiceFactory, DataTableService, toaster, $stateParams) {
  'use strict';
  
  $timeout(function(){

    if ( ! $.fn.dataTable ) return;
	    var columnDefinitions = [
	        { sWidth: "10%", aTargets: [0] },
	        { sWidth: "30%", aTargets: [1] },
	        { sWidth: "10%", aTargets: [2] },
	        {
		    	"targets": [3],
		    	"orderable": false,
		    	"createdCell": function (td, cellData, rowData, row, col) {
		    		var actionHtml = '<button title="Edit User" class="btn btn-default btn-oval fa fa-edit" ng-click="editVenueMap('+cellData+')"></button>&nbsp;&nbsp;';
		    		
		    		$(td).html(actionHtml);
		    		$compile(td)($scope);
		    	  }
	        }];
    
	    DataTableService.initDataTable('venue_map_table', columnDefinitions);
   
	    var promise = RestServiceFactory.VenueMapService().getAll({id: $stateParams.id});
	    promise.$promise.then(function(data) {
    	 
    	var table = $('#venue_map_table').DataTable();
    	
    	data.map(function(venueMap) {
    		table.row.add([venueMap.section, venueMap.days, venueMap.elements.length, venueMap.id]);
    	});
    	table.draw();
    });
    
    $scope.editVenueMap = function(venueMapId) {
  		$state.go('app.editVenueMap', {venueNumber: $stateParams.id, id: venueMapId});
  	}
    
   
    
  	$scope.deleteVenueMap = function(rowId, agencyId) {
  		
  		var target = {id: userId};
  		RestServiceFactory.AgencyService().delete(target,  function(success){
    		var table = $('#agencies_table').dataTable();
    		table.fnDeleteRow(rowId);
    	},function(error){
    		if (typeof error.data != 'undefined') { 
    			toaster.pop('error', "Server Error", error.data.developerMessage);
    		}
    	});
  	}
  	$scope.createNewVenueMap = function() {
  		$state.go('app.venueMapedit', {id: 'new'});
  	}
  });
}]);