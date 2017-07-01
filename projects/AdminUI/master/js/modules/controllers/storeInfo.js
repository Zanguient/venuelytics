/**=========================================================
 * Module: storeInfo.js
 * smangipudi
 =========================================================*/
/*jshint bitwise: false*/
App.controller('StoreController', ['$scope', '$state', '$stateParams', 'RestServiceFactory', 'toaster', 'FORMATS', '$timeout','DataTableService','$compile','ngDialog',
                                   function($scope, $state, $stateParams, RestServiceFactory, toaster, FORMATS, $timeout,DataTableService, $compile, ngDialog) {
    'use strict';
  
    $scope.initInfoTable = function() {
         if ( ! $.fn.dataTable || $stateParams.id == 'new') {
            return;
        }
        var columnDefinitions = [
           {
               "sWidth" : "50%", aTargets:[1],
               "sWidth" : "20%", aTargets:[0,2]
              
           },
           {
                "targets": [0,1,2],
                "orderable": false,
            },
            {
                "targets": [2],
                "orderable": false,
                "orderable": false,
                "createdCell": function (td, cellData, rowData, row, col) {
                    var actionHtml = '<button title="Edit" class="btn btn-default btn-oval fa fa-edit" ng-click="updateAttribute(\'' + row + '\'  )"></button>&nbsp;&nbsp;<button class="btn btn-default btn-oval fa fa-trash" ng-click="deleteAttribute(' +row +','+cellData+')"></button>';
                    
                    $(td).html(actionHtml);
                    $compile(td)($scope);
                  }
            } ];
     
        DataTableService.initDataTable('venue_info_table', columnDefinitions);
        var table = $('#venue_info_table').DataTable();
        
        $.each($scope.data.info, function (k,v) {
            table.row.add([k, v, k]);
        });
        table.draw();
    };
    
    if($stateParams.id != 'new') {
	    var promise = RestServiceFactory.VenueService().get({id:$stateParams.id});
	    promise.$promise.then(function(data) {
	    	
	    	data.phone = $.inputmask.format(data.phone,{ mask: FORMATS.phoneUS} );
	    	
	    	$scope.barType = (data.venueTypeCode & 1)  > 0 ? 'Y' : 'N';
	    	$scope.clubType = (data.venueTypeCode & 2) > 0 ? 'Y' : 'N';
	    	$scope.loungeype = (data.venueTypeCode & 4) > 0 ? 'Y' : 'N';
	    	$scope.casinoType = (data.venueTypeCode & 8) >0 ? 'Y' : 'N';
	    	$scope.nightClubType = (data.venueTypeCode & 32) > 0? 'Y' : 'N';
	    	$scope.restaurantType = (data.venueTypeCode & 64) > 0 ? 'Y' : 'N';
	    	$scope.bowlingType = (data.venueTypeCode & 128) > 0 ? 'Y' : 'N';
	    	$scope.karaokeType = (data.venueTypeCode & 256) > 0 ? 'Y' : 'N';
	    	
	    	
	    	$scope.data = data;
	    	$scope.initInfoTable();
	    });
    } else {
    	var data = {};
    	data.country = "USA";
    	data.venueTypeCode = 0;
    	$scope.barType = (data.venueTypeCode & 1)  > 0 ? 'Y' : 'N';
    	$scope.clubType = (data.venueTypeCode & 2) > 0 ? 'Y' : 'N';
    	$scope.loungeype = (data.venueTypeCode & 4) > 0 ? 'Y' : 'N';
    	$scope.casinoType = (data.venueTypeCode & 8) >0 ? 'Y' : 'N';
    	$scope.nightClubType = (data.venueTypeCode & 32) > 0? 'Y' : 'N';
    	$scope.restaurantType = (data.venueTypeCode & 64) > 0 ? 'Y' : 'N';
    	$scope.bowlingType = (data.venueTypeCode & 128) > 0 ? 'Y' : 'N';
    	$scope.karaokeType = (data.venueTypeCode & 256) > 0 ? 'Y' : 'N';
    	
    	$scope.data = data;
    	$scope.initInfoTable();
    }
	
   


    $scope.isVenueType = function(code) {
    	if (typeof $scope.venueType == 'undefined'){
    		return true;
    	}
    	var val = $scope.venueType[code]; 
    	return val == 1;
    }
    
    $scope.updateAttribute = function (rowId) {
      if(rowId == undefined){
    	var table = $('#venue_info_table').DataTable();
      var rowData = '';
        ngDialog.openConfirm({
          template: 'modalDialogId',
          className: 'ngdialog-theme-default',
          data: {key: rowData[1], value: rowData[1]}
        }).then(function (value, key) {
        	 var payload = {};
        	 payload[rowData[0]] = value;
        	 var promise = RestServiceFactory.VenueService().updateAttribute({id:$stateParams.id}, payload, function(data){
         		$scope.data.info[rowData[0]] = value;
         		table.clear();
         		$.each($scope.data.info, function (k,v) {
             		table.row.add([k, v, k]);
             	});
         		table.draw();
         	},function(error){
         		if (typeof error.data != 'undefined') { 
         			toaster.pop('error', "Server Error", error.data.developerMessage);
         		}
         	});
        	 
        }, function (reason) {
        	//mostly cancelled
        });
      } else {
      var table = $('#venue_info_table').DataTable();
      var rowData = table.row(rowId).data();
        ngDialog.openConfirm({
          template: 'modalDialogId',
          className: 'ngdialog-theme-default',
          data: {key: rowData[0], value: rowData[1]}
        }).then(function (value, key) {
           var payload = {};
           payload[rowData[0]] = value;
           var promise = RestServiceFactory.VenueService().updateAttribute({id:$stateParams.id}, payload, function(data){
            $scope.data.info[rowData[0]] = value;
            table.clear();
            $.each($scope.data.info, function (k,v) {
                table.row.add([k, v, k]);
              });
            table.draw();
          },function(error){
            if (typeof error.data != 'undefined') { 
              toaster.pop('error', "Server Error", error.data.developerMessage);
            }
          });
           
        }, function (reason) {
          //mostly cancelled
        });
      }
      };      
    $scope.update = function(isValid, data) {
    	if (!isValid) {
    		return;
    	}
    	var payload = RestServiceFactory.cleansePayload('VenueService', data);
    	var target = {id: data.id};
    	if ($stateParams.id == 'new'){
    		target = {};
    	}
    	RestServiceFactory.VenueService().save(target,payload, function(success){
    		$state.go('app.stores');
    	},function(error){
    		if (typeof error.data != 'undefined') { 
    			toaster.pop('error', "Server Error", error.data.developerMessage);
    		}
    	});
    }
}]);