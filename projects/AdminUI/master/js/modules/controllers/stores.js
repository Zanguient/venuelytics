/**=========================================================
 * Module: stores.js
 * smangipudi
 =========================================================*/

App.controller('StoresController', ['$scope', '$state','$compile','$timeout', 'RestServiceFactory', 'DataTableService', 'toaster','ngDialog', 
                                    function($scope, $state, $compile, $timeout, RestServiceFactory, DataTableService, toaster, ngDialog) {
  'use strict';
  
  $timeout(function(){

    if ( ! $.fn.dataTable ) return;
    var columnDefinitions = [ 
        { sWidth: "10%", aTargets: [0] },
        {
        	"targets": [0,1,2,3,4,5],
        	"orderable": false
        },
        {
	    	"targets": [6],
	    	"orderable": false,
	    	"createdCell": function (td, cellData, rowData, row, col) {
	    		 $(td).html('<button class="btn btn-default btn-oval fa fa-edit" ng-click="editStore('+cellData+')"></button>&nbsp;&nbsp;'+
            '<button class="btn btn-default btn-oval fa fa-trash" ng-click="deleteStore(' +row +','+cellData+')"></button>');
	    		 $compile(td)($scope);
	    		}
        },
    	{
	    	"targets": [5],
	    	"orderable": false,
	    	"createdCell": function (td, cellData, rowData, row, col) {
	    		
	    		var actionHtml = '<em class="fa fa-check-square-o"></em>';
	    		if (cellData !== 'Y'){
	    			actionHtml = '<em class="fa fa-square-o"></em>';
	    		}
	    		$(td).html(actionHtml);
	    		$compile(td)($scope);
	    	}
    	} ];
   
    DataTableService.initDataTable('stores_table', columnDefinitions, false);
    
    $('#stores_table_filter input').unbind();
    
    $('#stores_table_filter input').bind('keyup', function(e) {
    	if(e.keyCode === 13) {
    		
    		var promise = RestServiceFactory.VenueService().get({search:  $('#stores_table_filter input').val()});
    	    
    	    promise.$promise.then(function(data) {
    	    	 var table = $('#stores_table').DataTable();
    	    	 table.clear();
    	    	 data.venues.map(function(store) {
    	    		 table.row.add([store.venueName, store.address, store.phone, store.website, store.venueType, store.enabled, store.id]);
    	    	 });
    	    	 table.draw();
    	    });
    	    
    	}
    });
    
    var promise = RestServiceFactory.VenueService().get();
    
    promise.$promise.then(function(data) {
    	 var table = $('#stores_table').DataTable();
    	 data.venues.map(function(store) {
    		 table.row.add([store.venueName, store.address, store.phone, store.website, store.venueType, store.enabled, store.id]);
    	 });
    	 table.draw();
    });
    
    $scope.editStore = function(storeId) {
  		$state.go('app.storeedit', {id: storeId});
  	};

  	$scope.deleteStore = function(rowId, storeId) {
      ngDialog.openConfirm({
      template: 'deleteVenueId',
      className: 'ngdialog-theme-default'
    }).then(function (value) {
  		var target = {id: storeId};
  		RestServiceFactory.VenueService().delete(target,  function(success){
    		var table = $('#stores_table').dataTable();
    		table.fnDeleteRow(rowId);
    	},function(error){
    		if (typeof error.data !== 'undefined') { 
    			toaster.pop('error', "Server Error", error.data.developerMessage);
    		}
    	});
      }, function (reason) {
    });
  	};

  	$scope.createNewStore = function() {
  		$state.go('app.storeedit', {id: 'new'});
  	};

  });
}]);
