/**=========================================================
 * Module: loyalty.js
 * smangipudi
 =========================================================*/

App.controller('LoyaltyController', ['$scope', '$state','$compile', '$timeout', 'RestServiceFactory','DataTableService', 'toaster',
                                      function($scope, $state,$compile, $timeout, RestServiceFactory, DataTableService, toaster) {
  'use strict';

  $timeout(function(){

    if ( ! $.fn.dataTable ) return;
    var columnDefinitions = [ {
    	"targets": [5],
    	"orderable": false,
    	"createdCell": function (td, cellData, rowData, row, col) {
    		 $(td).html('<button class="btn btn-default btn-oval fa fa-edit" ng-click="editLevel('+cellData+')"></button>&nbsp;&nbsp;<button class="btn btn-default btn-oval fa fa-trash" ng-click="deleteLevel(' +row +','+cellData+')"></button>');
    		 $compile(td)($scope);
    		}
	 	}, {
		 	"targets": [0],
	    	"orderable": false,
	    	"createdCell": function (td, cellData, rowData, row, col) {
	    		$(td).html('<div style="width:30px;height:30px;background-color:'+cellData+'"></div>');
	    		}
		 	}
    	];
	    
	    var conditionFormat = function(condition, conditionType) {
	    	if (conditionType == "V") {
	    		return condition + " Visits";
	    	} else {
	    		return "$" + condition + " spend";
	    	}
	    }
	    
	    DataTableService.initDataTable('loyalty_table', columnDefinitions, false);
   
	    var promise = RestServiceFactory.LoyaltyService().get();
	    
	    promise.$promise.then(function(data) {
    	 
    	var table = $('#loyalty_table').DataTable();
    	data.levels.map(function(level) {
    		 table.row.add([level.displayAttributes.BG_COLOR,level.name, level.discount, level.rewardText, conditionFormat(level.condition, level.conditionType), level.id]);
    	});
    	table.draw();
    });
	    
    $scope.editLevel = function(levelId) {
  		$state.go('app.loyaltyedit', {id: levelId});
  	}
  	$scope.deleteLevel = function(rowId, levelId) {

  		var target = {id: levelId};
  		RestServiceFactory.LoyaltyService().delete(target,  function(success){
    		var table = $('#loyalty_table').dataTable();
    		table.fnDeleteRow(rowId);
    	},function(error){
    		if (typeof error.data != 'undefined') { 
    			toaster.pop('error', "Server Error", error.data.developerMessage);
    		}
    	});
  	}
  	$scope.createNewLevel = function() {
  		$state.go('app.loyaltyedit', {id: 'new'});
  	}
  });
}]);