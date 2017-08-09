/**=========================================================
 * Module: users.js
 *smangipudi
 =========================================================*/

App.controller('UsersController', ['$scope', '$state','$compile','$timeout', 'RestServiceFactory','DataTableService', 'toaster',
                                   function($scope, $state, $compile, $timeout, RestServiceFactory, DataTableService, toaster) {
  'use strict';

   	var userRoles = [];
	userRoles[1] = 'Basic User';
	userRoles[2] = 'Bouncer';
	userRoles[3] = 'Bartender';
	userRoles[4] = 'Waitress';
	userRoles[5] = 'DJ';
	userRoles[6] = 'Karaoke Manager';
	userRoles[7] = 'Artist';
	userRoles[8] = 'Host';
	userRoles[50] = 'Promotor';
	userRoles[50] = 'Service Manager';
	userRoles[100] = 'Manager';
	userRoles[500] = 'Owner';
	userRoles[1000] = 'Administrator';
	userRoles[10] = 'Agent';
	userRoles[11] = 'Agent Manager';
  	$timeout(function(){

    if ( ! $.fn.dataTable ) return;
	    var columnDefinitions = [
	        { sWidth: "18%", aTargets: [0,1,2] },
	        { sWidth: "10%", aTargets: [3,4] },
	        { sWidth: "20%", aTargets: [5] },
	        {
		    	"targets": [5],
		    	"orderable": false,
		    	"createdCell": function (td, cellData, rowData, row, col) {
		    		var actionHtml = '<button title="Edit User" class="btn btn-default btn-oval fa fa-edit" '+
		    			'ng-click="editUser('+cellData+')"></button>&nbsp;&nbsp;';
		    		actionHtml += '<button title="Associate Venue" class="btn btn-default btn-oval fa fa-home"'+
		    			' ng-click="associateVenue(' +row +','+cellData+')"></button>';
		    		if (rowData[5] !== 1) {
		    			actionHtml += '<button title="Delete User" class="btn btn-default btn-oval fa fa-trash"'+
		    			' ng-click="deleteUser(' +row +','+cellData+')"></button>';
		    		}
		    		
		    		$(td).html(actionHtml);
		    		$compile(td)($scope);
		    	  }
	    	},
	    	{
		    	"targets": [3],
		    	"orderable": false,
		    	"createdCell": function (td, cellData, rowData, row, col) {
		    		
		    		var actionHtml = '<em class="fa fa-check-square-o"></em>';
		    		if (cellData === false){
		    			actionHtml = '<em class="fa fa-square-o"></em>';
		    		}
		    		$(td).html(actionHtml);
		    		$compile(td)($scope);
		    	}
		 } ];
    
	    DataTableService.initDataTable('users_table', columnDefinitions);
   
	    var promise = RestServiceFactory.UserService().get();
	    promise.$promise.then(function(data) {
    	 
    	var table = $('#users_table').DataTable();
    	
    	data.users.map(function(user) {
    		var role = userRoles[user.roleId];

    		if (role == null) {
    			role = user.role;
    		}
    		if (user.businessName == null) {
    			user.businessName = "";
    		}
    		table.row.add([user.userName, user.loginId, user.businessName, user.enabled, role, user.id]);
    	});
    	table.draw();
    });
	    
  	
  });
  
  $scope.editUser = function(userId) {
		$state.go('app.useredit', {id: userId});
  };
  
  $scope.associateVenue = function(rowId, userId) {
		$state.go('app.uservenues', {id: userId});
  };
  
  
  $scope.deleteUser = function(rowId, userId) {	
		var target = {id: userId};
		RestServiceFactory.UserService().delete(target,  function(success){
  		var table = $('#users_table').dataTable();
  		table.fnDeleteRow(rowId);
  	},function(error){
  		if (typeof error.data !== 'undefined') { 
  			toaster.pop('error', "Server Error", error.data.developerMessage);
  		}
  	});
	};
  
  $scope.createNewUser = function() {
		$state.go('app.useredit', {id: 'new'});
	};
}]);