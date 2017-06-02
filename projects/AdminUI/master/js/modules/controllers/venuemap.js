/**
 * ========================================================= Module: venuemap.js
 * smangipudi =========================================================
 */

App.controller('VenueMapController', ['$scope', '$state','$compile','$timeout', 'RestServiceFactory','DataTableService', 'toaster', '$stateParams','ngDialog',
                                   function($scope, $state, $compile, $timeout, RestServiceFactory, DataTableService, toaster, $stateParams, ngDialog) {
  'use strict';
  
  $scope.img = {};
  $scope.img.pic_url = "";

  $timeout(function(){

    if ( ! $.fn.dataTable ) return;
  
    var image = new Image();
	image.onload = function(){
		$scope.originalWidth = this.width;
		$scope.originalHeight = this.height;
		$scope.img.pic_url = this.src;
		      
	}; 
	$('#venueMapImg').bind('resize', function(){
		
		if ($scope.displayWidth != $('#venueMapImg').width() || $scope.displayHeight != $('#venueMapImg').height()) {
			$scope.displayWidth = $('#venueMapImg').width();
			$scope.displayHeight = $('#venueMapImg').height();
			var a = $scope.img.pic_url;
			$scope.img.pic_url = "";
			$timeout(function(){
				$scope.img.pic_url =a;
			}, 200);
		}
    });
	
	var columnDefinitions = [
	              	        { sWidth: "15%", aTargets: [0,2] },
	              	        { sWidth: "8%", aTargets: [1,4] },
	              	        { sWidth: "30%", aTargets: [5] },
	              	        { sWidth: "34%", aTargets: [3] },
	              	       
	              	        {
	              		    	"targets": [5],
	              		    	"orderable": false,
	              		    	"createdCell": function (td, cellData, rowData, row, col) {
	              		    		var actionHtml = '<button title="Edit Table" class="btn btn-default btn-oval fa fa-edit" ng-click="editTable('+row+','+cellData+')"></button>&nbsp;&nbsp;';
	              		    		actionHtml += '<button title="Delete Table" class="btn btn-default btn-oval fa fa-trash" ng-click="deleteTable('+row+')"></button>';
	              		    		
	              		    		$(td).html(actionHtml);
	              		    		 $compile(td)($scope);
	              		    	  }
	              		    	/*"render": function (data, type, row, meta ) {
	              		    		var actionHtml = '<button title="Edit Table" class="btn btn-default btn-oval fa fa-edit" ng-click="editTable('+meta.row+','+meta.col+')"></button>&nbsp;&nbsp;';
	              		    		actionHtml += '<button title="Delete Table" class="btn btn-default btn-oval fa fa-trash" ng-click="deleteTable('+meta.row+')"></button>';
	              		    		
	              		    		return actionHtml;
              		    	  }*/	              	    	},
	              	    	{
	              		    	"targets": [4],
	              		    	"orderable": false,
	              		    	/*"render": function ( data, type, row ) {
	              		    		var actionHtml = '<em class="fa fa-check-square-o"></em>';
	              		    		if (data == 'N'){
	              		    			actionHtml = '<em class="fa fa-square-o"></em>';
	              		    		}
	                                return actionHtml;
	                            }*/
	              		    	"createdCell": function (td, cellData, rowData, row, col) {
	              		    		
	              		    		var actionHtml = '<em class="fa fa-check-square-o"></em>';
	              		    		if (cellData == false){
	              		    			actionHtml = '<em class="fa fa-square-o"></em>';
	              		    		}
	              		    		$(td).html(actionHtml);
	              		    		$compile(td)($scope);
	              		    	}
	              		    	
	              		 } ];
	
	
	DataTableService.initDataTable('tables_table', columnDefinitions, false);
	
    var promise = RestServiceFactory.VenueMapService().getAll({id: $stateParams.venueNumber});
    promise.$promise.then(function(data) {
    	data.map(function(venueMap) {
    		if (venueMap.id == $stateParams.id) {
    			$scope.data = venueMap;
    			image.src = venueMap.imageUrls[0].originalUrl;
    			$scope.img.maps = [];
    			
    			var tableMaps = JSON.parse(venueMap.imageMap);
    			tableMaps.map(function(t){
    				var arc = JSON.parse("["+t.coordinates+"]");
    				var coords = [];
    				coords[0] = arc[0];
    				coords[1] = arc[1];
    				coords[2] = arc[4];
    				coords[3] = arc[5];
    				
    				$scope.img.maps.push({
    					"editMode" : true,
    					"coords": coords,
    					"description": t.TableName,
    					"link_url": "javascript:void(0)"
    				});
    			});
    			var table = $('#tables_table').DataTable();
    			venueMap.elements.map(function(t) {
    	    		table.row.add([t.name, t.price, t.servingSize, t.description, t.enabled,  t.id]);
    	    	});
    	    	table.draw();
    		}
    	});
	});
    $scope.addTable = function () {
    	$scope.newTable = {};
    	$scope.newTable.enabled = 'Y';
    	$scope.newTable.id = -1;
    	ngDialog.openConfirm({
    	    template: 'app/templates/form-table-info.html',
    	     //plain: true,
    	    className: 'ngdialog-theme-default',
    	    scope : $scope 
    	  }).then(function (value) {
    		  var table = $('#tables_table').DataTable();
    		  table.row.add([$scope.newTable.name, $scope.newTable.price, $scope.newTable.servingSize, $scope.newTable.description,  $scope.newTable.enabled,   $scope.newTable.id]);
    		  table.page( 'last' ).draw( false );
    		  _addArea($scope.img);
         	},function(error){
         		
         });
        	 
        
    }
    
    function _addArea(img) {
    	
        if (!img || !img.maps || !angular.isArray(img.maps)) {
            img = angular.isObject(img) ? img : {};
            img.maps = [];
        };
        img.maps.map( function(area) {
        	area.editMode = false;
        });
        var calculation = img.getCalculation(),
            lastImg = img.maps.slice(-1)[0],
            lastImgLeft = lastImg ? lastImg.coords[0] : 0,
            lastImgTop = lastImg ? lastImg.coords[1] : 0,
            newImgCoords = [lastImgLeft + 30, lastImgTop + 30, lastImgLeft + 100, lastImgTop + 100];

        if (calculation) {
            img.maps.push({editMode: true, coords: calculation.checkCoords(newImgCoords) });
        } else {
            img.maps.push({editMode: true, coords: newImgCoords });
        }
    };
    //name, price, capacity, description, enabled, action
    $scope.editTable = function(rowId, colId) {
    	var table = $('#tables_table').DataTable();
    	var d = table.row(rowId).data();
    	$scope.newTable = {};
    	$scope.newTable.name = d[0];
    	$scope.newTable.price = d[1];
    	$scope.newTable.servingSize = d[2];
    	$scope.newTable.description = d[3];
    	$scope.newTable.enabled = d[4];
    	$scope.newTable.id = d[5];
    	ngDialog.openConfirm({
    	    template: 'app/templates/form-table-info.html',
    	    // plain: true,
    	    className: 'ngdialog-theme-default',
    	    scope : $scope 
    	  }).then(function (value) {
    		  $('#tables_table').dataTable().fnDeleteRow(rowId);
    		  var t = $scope.newTable;
    		  table.row.add([t.name, t.price, t.servingSize, t.description, t.enabled,  t.id]);
    		  table.draw();
         	},function(error){
         		
         });
  	}
    
    $scope.doneEditing = function() {
  		$scope.img.maps.map(function(area){
  			area.editMode = true;
  		});
  	}
    
  	$scope.deleteTable = function(rowId) {
  		var table = $('#tables_table').dataTable();
    	table.fnDeleteRow(rowId);
  	}
  	$scope.createNewVenueMap = function() {
  		$state.go('app.venueMapedit', {id: 'new'});
  	}
  	
  	 

  });
  $scope.$watch('img', function(nVal, oVal){
      $scope.imgJson = angular.toJson(nVal, true);
  }, true);
  $scope.mapFns = {
	        getCanSize: function() {
	            return [$scope.displayWidth, $scope.displayHeight];
	        },
	        getImgSize: function(img) {
                return _getImgSize(img.pic_url) || [10, 10];
            },
            removeArea : function(area, index) {
            	var table = $('#tables_table').dataTable();
            	table.fnDeleteRow(index);
            }
  };
  function _getImgSize(url) {
     
	  if (typeof $scope.originalHeight == 'undefined') {
		  return false;
	  } else {
		  return [$scope.originalWidth, $scope.originalHeight];
	  }
  }
}]);