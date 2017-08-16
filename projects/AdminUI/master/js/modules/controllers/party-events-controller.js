/**=========================================================
 * Module: party-event-controller.js
 *smangipudi
 =========================================================*/
App.controller('partyEventsController', ['$scope', '$state', '$stateParams', '$compile', '$timeout',
 'DataTableService','RestServiceFactory', 'toaster', 'FORMATS','ngDialog','$rootScope', 
            function($scope, $state, $stateParams, $compile, $timeout,
                DataTableService, RestServiceFactory, toaster, FORMATS, ngDialog, $rootScope) {
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
		    		var actionHtml = '<button title="Edit" class="btn btn-default btn-oval fa fa-edit" ng-click="editPartyEvent(' +row +','+cellData+')">' + 
		    		'</button>&nbsp;&nbsp;<button title="Delete" class="btn btn-default btn-oval fa fa-trash" '+
		    		'ng-click="deletePartyEvent(' +row +','+cellData+')"></button>';
		    		
		    		$(td).html(actionHtml);
		    		$compile(td)($scope);
		    	  }
	    	},
	    	{
		    	"targets": [5],
		    	"orderable": false,
		    	"createdCell": function (td, cellData, rowData, row, col) {
		    		
		    		var actionHtml = '<em class="fa fa-check-square-o"></em>';
		    		if (cellData === false || cellData === 'N' || cellData === "false"){
		    			actionHtml = '<em class="fa fa-square-o"></em>';
		    		}
		    		$(td).html(actionHtml);
		    		$compile(td)($scope);
		    	}
		 } ];
    
	    DataTableService.initDataTable('party_events_table', columnDefinitions, false);
   
	    var promise = RestServiceFactory.ProductService().getPartyEvents({id:$stateParams.id, role: 'admin'});
	    promise.$promise.then(function(data) {
	    $scope.data = data;
    	var table = $('#party_events_table').DataTable();

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
  	};
		
  	$scope.editPartyEvent = function(rowId, productId) {
  		$rootScope.createPartySplit = "party";
	  	$state.go('app.editPartyHall', {venueNumber: $stateParams.id, id:productId});
	};
	$scope.createPartyEvent = function(rowId, productId){
		$rootScope.createPartySplit = "party";
		$state.go('app.editPartyHall', {venueNumber: $stateParams.id, id:'new'});
	};
  	$scope.deletePartyEvent = function (rowId, productId) {
    ngDialog.openConfirm({
      template: 'deletePartyId',
      className: 'ngdialog-theme-default'
    }).then(function (value) {
      var target = {id: $stateParams.id ,productId:productId};
  		RestServiceFactory.ProductService().delete(target,  function(success){
  			$state.go('app.stores');
    	},function(error){
    		if (typeof error.data !== 'undefined') { 
    			toaster.pop('error', "Server Error", error.data.developerMessage);
    		}
    	});
    }, function (reason) {
    });
  };
}]);