/**=========================================================
 * Module: private-event-controller.js
 *smangipudi
 =========================================================*/
App.controller('PrivateEventsController', ['$scope', '$state', '$stateParams', '$compile', '$timeout', 'DataTableService','RestServiceFactory', 'toaster', 'FORMATS', 
                                  function($scope, $state, $stateParams, $compile, $timeout, DataTableService, RestServiceFactory, toaster, FORMATS) {
  'use strict';
  
 
  $timeout(function(){

    if ( ! $.fn.dataTable ) return;
	    var columnDefinitions = [
	        { "sWidth": "15%", aTargets: [0] },
	        { "sWidth": "8%", aTargets: [1] },
	        { "sWidth": "10%", aTargets: [2,3,6] },
	        { "width": "40%", aTargets: [4] },
	        { "sWidth": "7%", aTargets: [5] },
	        {"bAutoWidth" : false},
	        {
		    	"targets": [6],
		    	"orderable": false,
		    	"createdCell": function (td, cellData, rowData, row, col) {
		    		var actionHtml = '<button title="Edit User" class="btn btn-default btn-oval fa fa-link" ng-click="editPE(' +row +','+cellData+')"></button>&nbsp;&nbsp;';
		    		
		    		$(td).html(actionHtml);
		    		$compile(td)($scope);
		    	  }
	    	},
	    	{
		    	"targets": [5],
		    	"orderable": false,
		    	"createdCell": function (td, cellData, rowData, row, col) {
		    		
		    		var actionHtml = '<em class="fa fa-check-square-o"></em>';
		    		if (cellData == false || cellData === 'N' || cellData === "false"){
		    			actionHtml = '<em class="fa fa-square-o"></em>';
		    		}
		    		$(td).html(actionHtml);
		    		$compile(td)($scope);
		    	}
		 } ];
    
	    DataTableService.initDataTable('events_table', columnDefinitions, false);
   
	    var promise = RestServiceFactory.ProductService().getPrivateEvents({id:$stateParams.id});
	    promise.$promise.then(function(data) {
	    $scope.data = data;
    	var table = $('#events_table').DataTable();
  
    	data.map(function(room) {
    		var d = room.description;
    		if (d.length > 150) {
    			d = d.substring(0, 147) + " ...";
    		}
    		table.row.add([room.name,  room.price, room.size, room.servingSize, d, room.enabled, room.id]);
    	});
    	table.draw();
    });
  	
  });
  
  $scope.doneAction = function() {
	  $state.go('app.agencyUsers', {id:$stateParams.id});
  }
	
	
  $scope.editPE = function(rowId, productId) {
	  $state.go('app.editBanquetHall', {venueNumber: $stateParams.id, id:productId});
	}
}]);