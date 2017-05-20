/**=========================================================
 * Module: users.js
 *smangipudi
 =========================================================*/

App.controller('AgenciesController', ['$scope', '$state','$compile','$timeout', 'RestServiceFactory','DataTableService', 'toaster',
                                   function($scope, $state, $compile, $timeout, RestServiceFactory, DataTableService, toaster) {
  'use strict';
  
  $timeout(function(){

    if ( ! $.fn.dataTable ) return;
	    var columnDefinitions = [
	        { sWidth: "15%", aTargets: [0,4] },
	        { sWidth: "10%", aTargets: [1,5] },
	        { sWidth: "10%", aTargets: [2,3] },
	        {
		    	"targets": [6],
		    	"orderable": false,
		    	"createdCell": function (td, cellData, rowData, row, col) {
		    		var actionHtml = '<button title="Edit User" class="btn btn-default btn-oval fa fa-edit" ng-click="editAgency('+cellData+')"></button>&nbsp;&nbsp;';
		    		actionHtml += '<button title="Associate Venue" class="btn btn-default btn-oval fa fa-users" ng-click="agencyUsers(' +row +','+cellData+')"></button>';
		    		if (rowData[5] != 1) {
		    			actionHtml += '<button title="Delete User" class="btn btn-default btn-oval fa fa-trash" ng-click="deleteAgency(' +row +','+cellData+')"></button>';
		    		}
		    		
		    		$(td).html(actionHtml);
		    		$compile(td)($scope);
		    	  }
	    	},
	    	{
		    	"targets": [5],
		    	"orderable": false,
		    	"createdCell": function (td, cellData, rowData, row, col) {
		    		
		    		var actionHtml = '<em class="fa fa-check-square-o"></em>';
		    		if (cellData != 'Y'){
		    			actionHtml = '<em class="fa fa-square-o"></em>';
		    		}
		    		$(td).html(actionHtml);
		    		$compile(td)($scope);
		    	}
		 } ];
    
	    DataTableService.initDataTable('agencies_table', columnDefinitions);
   
	    var promise = RestServiceFactory.AgencyService().get();
	    promise.$promise.then(function(data) {
    	 
    	var table = $('#agencies_table').DataTable();
    	
    	data.agencies.map(function(agency) {
    		table.row.add([agency.name, agency.managerName, agency.phone,  agency.mobile, agency.address, agency.enabled, agency.id]);
    	});
    	table.draw();
    });
    $scope.editAgency = function(userId) {
  		$state.go('app.agencyedit', {id: userId});
  	}
    
    $scope.agencyUsers = function(rowId, userId) {
  		$state.go('app.agencyUsers', {id: userId});
  	}
    
  	$scope.deleteAgency = function(rowId, agencyId) {
  		
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
  	$scope.createNewUser = function() {
  		$state.go('app.agencyedit', {id: 'new'});
  	}
  });
}]);