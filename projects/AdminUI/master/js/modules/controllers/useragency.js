/**=========================================================
 * Module: useragency.js
 *smangipudi
 =========================================================*/
App.controller('UserAgencyController', ['$scope', '$state', '$stateParams', '$compile', '$timeout', 'DataTableService','RestServiceFactory', 'toaster', 'FORMATS', 
                                  function($scope, $state, $stateParams, $compile, $timeout, DataTableService, RestServiceFactory, toaster, FORMATS) {
  'use strict';
  
  var user_roles = [];
  user_roles['admin'] = 'Administrator';
  user_roles['director'] = 'Store Director';
  user_roles['manager'] = 'Manager';
  user_roles['marketing'] = 'Marketing';
  $timeout(function(){

    if ( ! $.fn.dataTable ) return;
	    var columnDefinitions = [
	        { sWidth: "15%", aTargets: [0,1,3] },
	        { sWidth: "5%", aTargets: [2] },
	        {
		    	"targets": [4],
		    	"orderable": false,
		    	"createdCell": function (td, cellData, rowData, row, col) {
		    		var actionHtml = '<button title="Edit User" class="btn btn-default btn-oval fa fa-link" ng-click="addAgencyUser(' +row +','+cellData+')"></button>&nbsp;&nbsp;';
		    		
		    		$(td).html(actionHtml);
		    		$compile(td)($scope);
		    	  }
	    	},
	    	{
		    	"targets": [2],
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
    
	    DataTableService.initDataTable('users_table', columnDefinitions);
   
	    var promise = RestServiceFactory.UserService().get();
	    promise.$promise.then(function(data) {
	    $scope.data = data;
    	var table = $('#users_table').DataTable();
    	
    	data.users.map(function(user) {
    		var role = user_roles[user.role];
    		if (role == null) {
    			role = user.role;
    		}
    		
    		table.row.add([user.userName, user.loginId, user.enabled, role, user.id]);
    	});
    	table.draw();
    });
  	
    var promise = RestServiceFactory.AgencyService().get({id:$stateParams.id});
    promise.$promise.then(function(data) {
    	$scope.data.name = data.name;
    });
  	
  });
  
  $scope.doneAction = function() {
	  $state.go('app.agencyUsers', {id:$stateParams.id});
  }
	
	
  $scope.addAgencyUser = function(rowId, userId) {
		var userIds = [];
		userIds[0] = userId;
		var target = {id: $stateParams.id};
		RestServiceFactory.AgencyService().addAgent(target, userIds,  function(success){
			var table = $('#users_table').dataTable();
			table.fnDeleteRow(rowId);
		},function(error){
			if (typeof error.data != 'undefined') { 
  			toaster.pop('error', "Server Error", error.data.developerMessage);
			}
		});
		
	}
}]);