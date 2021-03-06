/**=========================================================
 * Module: uservenues.js
 *smangipudi
 =========================================================*/
App.controller('AddVenueUsersController', ['$scope', '$state', '$stateParams', '$compile', '$timeout',
  'DataTableService','RestServiceFactory', 'toaster', 'FORMATS', 'UserRoleService',
          function($scope, $state, $stateParams, $compile, $timeout, DataTableService, RestServiceFactory, toaster, FORMATS, UserRoleService) {
  'use strict';
  var userRoles = UserRoleService.getRoles();
  $scope.data = {};
  var promise = RestServiceFactory.VenueService().get({id:$stateParams.id});
  promise.$promise.then(function(data) {
      $scope.data = data; 
  });
  $timeout(function(){

    if ( ! $.fn.dataTable ) return;
	    var columnDefinitions = [
	      { sWidth: "5%", aTargets: [0] },
        { sWidth: "15%", aTargets: [1, 2, 3, 4, 5] },
        { sWidth: "20%", aTargets: [6] },
        {
		    	"targets": [6],
		    	"orderable": false,
		    	"createdCell": function (td, cellData, rowData, row, col) {
		    		var actionHtml = '<button type="button" class="btn btn-default btn-oval fa fa-link"></button>';
		    		
		    		$(td).html(actionHtml);
		    		$compile(td)($scope);
		    	  }
	    	},
        {
          "targets": [5],
          "orderable": false,
          "createdCell": function (td, cellData, rowData, row, col) {

            var actionHtml = '<em class="fa fa-check-square-o"></em>';
            if (cellData === false) {
              actionHtml = '<em class="fa fa-square-o"></em>';
            }
            $(td).html(actionHtml);
            $compile(td)($scope);
          }
        },
        {
          "targets": [0],
          "orderable": false,
          "createdCell": function (td, cellData, rowData, row, col) {
            var imgHtml = '<div class="media text-center">';

            if (cellData !== null && cellData !== '') {
              imgHtml += '<img src="' + cellData + '" alt="Image" class="img-responsive img-circle">';
            } else {
              imgHtml += '<em class="fa fa-2x fa-user-o"></em>';
            }

            imgHtml += '</div>';
            $(td).html(imgHtml);
            $compile(td)($scope);
          }
        }

      ];
    

	    DataTableService.initDataTable('search_user_table', columnDefinitions);
   
	    var promise = RestServiceFactory.VenueService().getNonVenueUsers({id:$stateParams.id});
	    promise.$promise.then(function(data) {
    	  $scope.data = data;
    	  var table = $('#search_user_table').DataTable();
    	  data.users.map(function(user) {	
          var role = userRoles[user.roleId];

          if (role == null) {
            role = user.role;
          }
          var img = user.profileImageThumbnail;
          if (typeof img === 'undefined') {
            img = '';
          }
    		  table.row.add([img, user.userName, user.loginId, user.email, role,  user.enabled, user]);
    	  });
    	 table.draw();
      
    });

  });
  
  $('#search_user_table').on('click', '.fa-link',function() {
      var table = $('#search_user_table').DataTable();
      $scope.addUserVenue(this, table);
  });
  
  $scope.addUserVenue = function(button, tableAPI) {
    var venues = [];
    venues[0] = $stateParams.id;
    
    var targetRow = $(button).closest("tr");
    var rowData = tableAPI.row( targetRow).data();   
    var target = {id: rowData[6].id};   
    RestServiceFactory.UserVenueService().save(target, venues,  function(success){
      tableAPI.row(targetRow).remove().draw();
    },function(error){
      if (typeof error.data !== 'undefined') { 
        toaster.pop('error', "Server Error", error.data.developerMessage);
      }
    });
  };

  $scope.doneAdding = function() {
    $state.go('app.venueedit', {id:$stateParams.id});
  };

}]);