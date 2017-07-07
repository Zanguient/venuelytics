/**=========================================================
 * Module: storeInfo.js
 * smangipudi
 =========================================================*/
/*jshint bitwise: false*/
App.controller('StoreController', ['$scope', '$state', '$stateParams', 'RestServiceFactory', 'toaster', 'FORMATS', '$timeout','DataTableService','$compile','ngDialog',
                                   function($scope, $state, $stateParams, RestServiceFactory, toaster, FORMATS, $timeout,DataTableService, $compile, ngDialog) {
    'use strict';
    //$scope.VenueImageArray = [];
    $scope.initInfoTable = function() {
      //$scope.VenueImageArray.push($scope.getVenueImages());
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
                    var actionHtml = ('<button title="Edit" class="btn btn-default btn-oval fa fa-edit" ng-click="updateAttribute(\'' + row + '\'  )"></button>&nbsp;&nbsp;'
                    +'<button class="btn btn-default btn-oval fa fa-trash" ng-click="deleteAttribute(' +row +','+cellData+')"></button>');
                    
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
        if($scope.barType == 'Y'){
        $scope.barNum =1;
      } else {
        $scope.barNum =0;
      }
	    	$scope.clubType = (data.venueTypeCode & 2) > 0 ? 'Y' : 'N';
        if($scope.clubType == 'Y'){
          $scope.clubNum =2;
        } else {
          $scope.clubNum =0;
        }       
	    	$scope.loungeType = (data.venueTypeCode & 4) > 0 ? 'Y' : 'N';
        if($scope.loungeType == 'Y'){
          $scope.loungeNum=4;
        } else {
          $scope.loungeNum =0;
        }
	    	$scope.casinoType = (data.venueTypeCode & 8) >0 ? 'Y' : 'N';
        if($scope.casinoType== 'Y'){
          $scope.casinoNum =8;
        } else {
          $scope.casinoNum =0;
        }
	    	$scope.nightClubType = (data.venueTypeCode & 32) > 0? 'Y' : 'N';
        if($scope.nightClubType == 'Y'){
          $scope.nightClubNum =32;
        } else {
          $scope.nightClubNum =0;
        }
	    	$scope.restaurantType = (data.venueTypeCode & 64) > 0 ? 'Y' : 'N';
        if($scope.restaurantType == 'Y'){
          $scope.restaurantNum =64;
        } else {
          $scope.restaurantNum =0;
        }
	    	$scope.bowlingType = (data.venueTypeCode & 128) > 0 ? 'Y' : 'N';
        if($scope.bowlingType == 'Y'){
          $scope.bowlingNum =128;
        } else {
          $scope.bowlingNum =0;
        }
	    	$scope.karaokeType = (data.venueTypeCode & 256) > 0 ? 'Y' : 'N';	
        if($scope.karaokeType== 'Y'){
          $scope.karaokeNum =256;
        } else {
          $scope.karaokeNum =0;
        }
        $scope.venueEnabled = data.enabled;
        if($scope.venueEnabled == 'Y'){
          $scope.venueEnabled ='Y';
        } else {
          $scope.venueEnabled ='N';
        }
        $scope.cleansed =data.cleansed;
        if($scope.cleansed== true){
          $scope.cleansed =true;
        } else {
          $scope.cleansed =false;
        }
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
    /*$scope.getVenueImages = function() {
         return { id : "", originalUrl: "", uploadImage : true, editImage : false };
    }
    $scope.addVenueImage = function(arrayObj) {
        arrayObj.push($scope.getVenueImages());
    }
    $scope.removeVenueImage = function(index, arrayObj, value) {
        arrayObj.splice(index, 1);
        var id= {
            "id" : value.id
        }
        var target = {id: $stateParams.id ,productId:productId};
      RestServiceFactory.ProductService().delete(target,  function(success){
        $state.go('app.stores');
      },function(error){
        if (typeof error.data !== 'undefined') { 
          toaster.pop('error', "Server Error", error.data.developerMessage);
        }
      });
    }*/
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
          //data: {key: rowData[0], value: rowData[1]}
        }).then(function (value) {
          var values = value.value;
          var keys =value.key;
        	 var payload = {};
        	 payload[keys]= values;
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
        }).then(function (value) {  
          value = value.value;
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
    $scope.bartypes = function(barType){
      if(barType == 'Y'){
        $scope.barTypes ='N';
        $scope.barNum = 0;
      } else {
        $scope.barTypes ='Y';
        $scope.barNum =1;
      }
    }
       $scope.clubtypes = function(clubType){
        if(clubType == 'Y'){
          $scope.clubType ='N';
          $scope.clubNum = 0;
        } else {
          $scope.clubType ='Y';
          $scope.clubNum =2;
        }
       }
      $scope.loungetypes = function(loungeType){
        if(loungeType == 'Y'){
          $scope.loungeType ='N';
          $scope.loungeNum=0;
        } else {
          $scope.loungeType ='Y';
          $scope.loungeNum=4;
        }
      }   
      $scope.casinotypes = function(casinoType){
        if(casinoType== 'Y'){
          $scope.casinoType ='N';
          $scope.casinoNum =0;
        } else {
          $scope.casinoType ='Y';
          $scope.casinoNum =8;
        }
      }  
      $scope.nightClubtypes = function(nightClubType){
        if(nightClubType == 'Y'){
          $scope.nightClubType ='N';
          $scope.nightClubNum =0;
        } else {
          $scope.nightClubType ='Y';
          $scope.nightClubNum =32;
        }
      }
      $scope.bowlingtypes = function(bowlingType){
        if(bowlingType == 'Y'){
          $scope.bowlingType ='N';
          $scope.bowlingNum =0;
        } else {
          $scope.bowlingType ='Y';
          $scope.bowlingNum =128;
        }
      }
      $scope.karaoketypes = function(karaokeType){
        if(karaokeType== 'Y'){
          $scope.karaokeType ='N';
          $scope.karaokeNum =0;
        } else {
          $scope.karaokeType ='Y';
          $scope.karaokeNum =256;
        }
      }
    $scope.restaurantypes = function(restaurantType){
        if(restaurantType == 'Y'){
          $scope.restaurantType ='N';
          $scope.restaurantNum =0;
        } else {
          $scope.restaurantType ='Y';
          $scope.restaurantNum =64;
      }
    }
    $scope.enabledVenue = function(venueEnabled){
      if(venueEnabled == 'Y'){
          $scope.venueEnabled ='N';
        } else {
          $scope.venueEnabled ='Y';
      }
    }
    $scope.enableCleansed = function(cleansed){
      if(cleansed== true){
          $scope.cleansed =false;
        } else {
          $scope.cleansed =true;
        }
    }
    $scope.venueUploadFile = function(venueImage) {
      var file = venueImage;
      console.dir(file);
      var fd = new FormData();
      fd.append('file', file, $scope.finalName);

      var payload = RestServiceFactory.cleansePayload('uploadVenueImage', fd);
      RestServiceFactory.VenueImage().uploadVenueImage(payload, function(success){
        $state.go('app.stores');
      },function(error){
        if (typeof error.data != 'undefined') {
          toaster.pop('error', "Server Error", error.data.developerMessage);
        }
      });
    }
    $scope.update = function(isValid, data) {
      data.enabled = $scope.venueEnabled;
      data.cleansed = $scope.cleansed;
      var venueNumber = (($scope.restaurantNum)+($scope.karaokeNum)+($scope.nightClubNum)+($scope.bowlingNum)+($scope.casinoNum)+($scope.loungeNum)+($scope.clubNum)+($scope.barNum));
      data.venueTypeCode = venueNumber;
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
    /*$scope.deleteAttribute = function(rowId, rowData) {
      var target = {id: $stateParams.id, rowId: rowData};
      RestServiceFactory.VenueService().deleteAttribute(target,  function(success){
        $state.go('app.stores');
      },function(error){
        if (typeof error.data !== 'undefined') { 
          toaster.pop('error', "Server Error", error.data.developerMessage);
        }
      });
    };*/
}]);