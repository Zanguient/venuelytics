/**
 * =======================================================
 * Module: venuemaps.js
 * smangipudi 
 * =========================================================
 */

App.controller('VenueMapsController', ['$scope', '$state','$compile','$timeout', 'RestServiceFactory','DataTableService', 'toaster', '$stateParams','ngDialog',
                                   function( $scope, $state, $compile, $timeout, RestServiceFactory, DataTableService, toaster, $stateParams, ngDialog) {
  'use strict';
  
  $timeout(function(){

    if ( ! $.fn.dataTable ) return;
    var columnDefinitions = [
        { sWidth: "10%", aTargets: [0] },
        { sWidth: "30%", aTargets: [1] },
        { sWidth: "20%", aTargets: [2] },
        { sWidth: "10%", aTargets: [3] },
        {
	    	"targets": [4],
	    	"orderable": false,
	    	"createdCell": function (td, cellData, rowData, row, col) {
	    		var actionHtml = '<button title="Edit User" class="btn btn-default btn-oval fa fa-edit" '+
            'ng-click="editVenueMap('+cellData+')"></button>&nbsp;&nbsp;</button>&nbsp;&nbsp;'+
            '<button class="btn btn-default btn-oval fa fa-trash" ng-click="deleteBottle(' +row +','+cellData+')"></button>';
	    		
	    		$(td).html(actionHtml);
	    		$compile(td)($scope);
	    	  }
    }];
    
	  DataTableService.initDataTable('venue_map_table', columnDefinitions);
   
    var promise = RestServiceFactory.VenueMapService().getAll({id: $stateParams.id, type: 'ALL'});
    promise.$promise.then(function(data) {
  	 
    	var table = $('#venue_map_table').DataTable();
    	
    	data.map(function(venueMap) {
    		table.row.add([venueMap.section, venueMap.days, venueMap.type, venueMap.elements.length, venueMap.id]);
    	});
    	table.draw();
    });
    
  });  

  $scope.editVenueMap = function(venueMapId) {
    $state.go('app.editVenueMap', {venueNumber: $stateParams.id, id: venueMapId});
  };

  $scope.createBottle = function(venueMapId) {
    $state.go('app.editVenueMap', {venueNumber: $stateParams.id, id: 'new'});
  };
  $scope.deleteVenueMap = function(rowId, mapId) {
    
  };

  $scope.createNewVenueMap = function() {
    $state.go('app.venueMapedit', {id: 'new'});
  };
    
  $scope.deleteBottle = function(rowId, cellData){
    ngDialog.openConfirm({
      template: 'deleteBottleId',
      className: 'ngdialog-theme-default'
    }).then(function (value) {
      var target = {id: $stateParams.id ,tableId:cellData};
      RestServiceFactory.VenueMapService().delete(target,  function(success){
        var table = $('#venue_map_table').dataTable();
        table.fnDeleteRow(rowId);
      },function(error){
        if (typeof error.data !== 'undefined') { 
          toaster.pop('error', "Server Error", error.data.developerMessage);
        } 
      });
    });
  };
}]);