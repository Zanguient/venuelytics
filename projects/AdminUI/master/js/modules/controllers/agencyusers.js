/**=========================================================
 * Module: agencyusers.js
 *smangipudi
 =========================================================*/
App.controller('AgencyUserController', ['$scope', '$state', '$stateParams', '$compile', '$timeout', 'DataTableService',
  'RestServiceFactory', 'toaster', 'FORMATS', function($scope, $state, $stateParams, $compile, $timeout, DataTableService, 
    RestServiceFactory, toaster, FORMATS) {
  'use strict';
  
  $timeout(function(){

    if ( ! $.fn.dataTable ) return;
	    var columnDefinitions = [
	        { sWidth: "20%", aTargets: [0,1] },
	        { sWidth: "10%", aTargets: [2,3] },
	        { sWidth: "15%", aTargets: [3] },
	        { "targets": [0,1,2,3,4], 
	        	"orderable": false
  			},
  			{
		    	"targets": [2],
		    	"orderable": false,
		    	"createdCell": function (td, cellData, rowData, row, col) {
		    		
		    		var actionHtml = '<em class="fa fa-check-square-o"></em>';
		    		if (cellData === false){
		    			actionHtml = '<em class="fa fa-square-o"></em>';
		    		}
		    		$(td).html(actionHtml);
		    		$compile(td)($scope);
		    	}
  			},
		    {
		    	"targets": [4],
		    	"orderable": false,
		    	"createdCell": function (td, cellData, rowData, row, col) {
		    		var actionHtml = '<button title="Unlink User " class="btn btn-default btn-oval fa fa-unlink"></button>';
		    		if (rowData[3] === 'AGENT_MANAGER') {
		    			actionHtml += '<button title="Set As Manager " class="btn btn-default btn-oval fa fa-black-tie"></button>';
		    		}
		    		
		    		$(td).html(actionHtml);
		    		$compile(td)($scope);
		    	  }
	    	} ];
    
	    DataTableService.initDataTable('agency_user_table', columnDefinitions);
      var table = $('#agency_user_table').DataTable();
      $('#agency_user_table').on('click', '.fa-unlink', function() {
          $scope.removeUser(this, table);
      });

      $('#agency_user_table').on('click', '.fa-black-tie', function() {
        $scope.setAsManager(this, table);
      });

	    var promise = RestServiceFactory.AgencyService().getUsers({id:$stateParams.id});
	    promise.$promise.then(function(data) {
	    	$scope.data = data;
	    	var table = $('#agency_user_table').DataTable();
	    	data.users.map(function(user) {
	    		
	    		table.row.add([user.userName, user.loginId, user.enabled, user.role, user.id]);
	    	});
	    	table.draw();
	    });
	    
    promise = RestServiceFactory.AgencyService().get({id:$stateParams.id});
    promise.$promise.then(function(data) {
    	$scope.agencyName = data.name;
    });
 
  	$scope.removeUser = function(button, table) {
  		var targetRow = $(button).closest("tr");
      var rowData = table.row(targetRow).data();
  		var target = {id:$stateParams.id, userId: rowData[4]};
	
  		RestServiceFactory.AgencyService().deleteAgents(target, function(success){
    		table.row(targetRow).remove().draw();
    	},function(error){
    		if (typeof error.data !== 'undefined') { 
    			toaster.pop('error', "Server Error", error.data.developerMessage);
    		}
    	});
  	};
  	
  	$scope.setAsManager = function(button, table) {
  		
  	  var targetRow = $(button).closest("tr");
      var rowData = table.row(targetRow).data();
      var target = {id:$stateParams.id, userId: rowData[4]};
  		
  		RestServiceFactory.AgencyService().setAsManager(target, function(success){
    	 rowData[3] = 'AGENT_MANAGER';
    	},function(error){
    		if (typeof error.data !== 'undefined') { 
    			toaster.pop('error', "Server Error", error.data.developerMessage);
    		}
    	});
  	};
  	
  	$scope.search = function(venueName) {
  		var promise = RestServiceFactory.VenueService().get({search: venueName});
  		promise.$promise.then(function(data) {
    	
  			$scope.venues = data.venues;
	    	
  		});
  	};
  	$scope.doneAction = function() {
  		$state.go('app.uservenues', {id:$stateParams.id});
  	};
  	
  	
  	$scope.addUserVenue = function(venue) {
  		var venues = [];
  		venues[0] = venue.venueNumber;
  		var target = {id: $stateParams.id};
  		RestServiceFactory.UserVenueService().save(target, venues,  function(success){
  			var index = $scope.venues.indexOf(venue);
  			$scope.venues.splice(index, 1);
    	},function(error){
    		if (typeof error.data !== 'undefined') { 
    			toaster.pop('error', "Server Error", error.data.developerMessage);
    		}
    	});
  		
  	};
  });
}]);