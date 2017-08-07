/**
 * =======================================================
 * Module: venuemaps.js
 * smangipudi 
 * =========================================================
 */

App.controller('VenueProductsController', ['$scope', '$state','$compile','$timeout', 'RestServiceFactory','DataTableService', 'toaster', '$stateParams','ngDialog',
                                   function($scope, $state, $compile, $timeout, RestServiceFactory, DataTableService, toaster, $stateParams, ngDialog) {
  'use strict';
  
  $timeout(function(){

    if ( ! $.fn.dataTable ) return;
	    var columnDefinitions = [
	        { sWidth: "9%", aTargets: [0,1,2,3,5,6,7] },
	        { sWidth: "20%", aTargets: [4] },
	        { sWidth: "17%", aTargets: [8] },
	        {
		    	"targets": [8],
		    	"orderable": false,
		    	"createdCell": function (td, cellData, rowData, row, col) {
		    		var actionHtml = '<button title="Edit Product" class="btn btn-default btn-oval fa fa-edit" ng-click="editProduct('+row +"," +cellData+')"></button>&nbsp;&nbsp;';
		    		
		    		$(td).html(actionHtml);
		    		$compile(td)($scope);
		    	  }
	        }];
    
	    DataTableService.initDataTable('products_table', columnDefinitions, false, "<'row'<'col-xs-6'l<'product_type_selector'>><'col-xs-6'f>r>t<'row'<'col-xs-6'i><'col-xs-6'p>>");
   
      $('.product_type_selector').html('<label>Show Products:</label> <select id="product_type" name="products_type" '+
        'aria-controls="products_type" class="form-control input-sm">' + 
         '<option value="ALL">ALL</option>'+
         '<option value="Food">Food</option>'+
         '<option value="Drinks">Drinks</option>'+
         '<option value="Bottle">Bottle</option></select>');

      var table = $('#products_table').DataTable();
      
      $('#product_type').on( 'change', function () {
          var val = jQuery(this).val() ;//$.fn.dataTable.util.escapeRegex();
          if (val === "ALL") {
            val = "";
          }
          table.column(1).search( val ? '^'+val+'$' : '', true, false ).draw();
      });

	    var promise = RestServiceFactory.ProductService().get({id: $stateParams.id});
	    promise.$promise.then(function(data) {
    	 
    	$scope.productMap = [];

    	data.map(function(product) {
        if (product.productType !== 'VenueMap') {
          $scope.productMap[product.id] = product;
    		  table.row.add([ product.name, product.productType, product.category, product.brand, product.description, 
            product.price, product.size, product.servingSize, product.id]);
        }
    	});
    	
      table.draw(); 
    });
    
    $scope.editProduct = function(rowId, colId) {
  		var table = $('#products_table').DataTable();
      var d = table.row(rowId).data();
      $scope.product = $scope.productMap[d[8]];
      
      ngDialog.openConfirm({
          template: 'app/templates/product/form-product-info.html',
          // plain: true,
          className: 'ngdialog-theme-default',
          scope : $scope 
        }).then(function (value) {
          $('#tables_table').dataTable().fnDeleteRow(rowId);
          var t = $scope.product;
          table.row.add([t.name, t.price, t.servingSize, t.description, t.enabled,  t.id]);
          table.draw();
          },function(error){
            
         });
  	};
    
  	$scope.deleteProduct = function(rowId, productId) {
  		
  		
  	};
  	$scope.createNewVenueMap = function() {
  		$state.go('app.venueMapedit', {id: 'new'});
  	};
  });
}]);