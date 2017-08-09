/**
 * =======================================================
 * Module: venuemaps.js
 * smangipudi 
 * =========================================================
 */

App.controller('VenueDealsController', ['$scope', '$state','$compile','$timeout', 'RestServiceFactory','DataTableService', 'toaster', '$stateParams','ngDialog',
                                   function($scope, $state, $compile, $timeout, RestServiceFactory, DataTableService, toaster, $stateParams, ngDialog) {
  'use strict';
  
  $timeout(function(){

    if ( ! $.fn.dataTable ) return;
	    var columnDefinitions = [
          { sWidth: "8%", aTargets: [2,3,5,6,7] }, //40
           { sWidth: "14%", aTargets: [0] }, //54
	        { sWidth: "12%", aTargets: [4] }, //66
	        { sWidth: "25%", aTargets: [1] },  //91
	        { sWidth: "9%", aTargets: [8] }, //100
          {
          "targets": [7],
          "orderable": false,
          "createdCell": function (td, cellData, rowData, row, col) {
          
              var actionHtml = '<em class="fa fa-check-square-o"></em>';
              if (cellData !== true){
                actionHtml = '<em class="fa fa-square-o"></em>';
              }
              $(td).html(actionHtml);
              $compile(td)($scope);
            }
          },
	        {
		    	"targets": [8],
		    	"orderable": false,
		    	"createdCell": function (td, cellData, rowData, row, col) {
		    		var actionHtml = '<button title="Edit Deals" class="btn btn-default btn-oval fa fa-edit"'+
              ' ng-click="editDeal('+row +"," +cellData+')"></button>&nbsp;&nbsp;';
		    		
		    		$(td).html(actionHtml);
		    		$compile(td)($scope);
		    	  }
	        }];
    
	    DataTableService.initDataTable('deals_table', columnDefinitions);
   

      var table = $('#deals_table').DataTable();
      
	    var promise = RestServiceFactory.CouponService().get({id: $stateParams.id});
	    promise.$promise.then(function(data) {
    	
      $scope.dealMap = [];
      data.map(function(deal) {
          $scope.dealMap[deal.id] = deal;
    		  table.row.add([ deal.title, deal.description, deal.couponType, deal.discountAmount, deal.actionUrl, 
              formatDate(new Date(deal.startDate)), formatDate(new Date(deal.expiryDate)), deal.enabled, deal.id]);
    	});
    	
      table.draw(); 
    });
    function formatDate(value)
    {
      return value.getMonth()+1 + "/" + value.getDate() + "/" + value.getYear();
    }
    $scope.editDeal = function(rowId, colId) {
  		var table = $('#deals_table').DataTable();
      var d = table.row(rowId).data();
      $scope.deal = $scope.dealMap[d[8]];
      
      ngDialog.openConfirm({
          template: 'app/templates/content/form-deal-info.html',
          // plain: true,
          className: 'ngdialog-theme-default',
          scope : $scope 
        }).then(function (value) {
          $('#tables_table').dataTable().fnDeleteRow(rowId);
          var t = $scope.deal;
          table.row.add([t.name, t.price, t.servingSize, t.description, t.enabled,  t.id]);
          table.draw();
          },function(error){
            
         });
  	};
    
  	$scope.deleteProduct = function(rowId, productId) {
  			
  	};
  	$scope.createNewDeal = function() {
  		$state.go('app.venueMapedit', {id: 'new'});
  	};
  });
}]);