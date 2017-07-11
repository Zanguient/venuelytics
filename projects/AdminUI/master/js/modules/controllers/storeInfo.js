/**=========================================================
 * Module: storeInfo.js
 * smangipudi
 =========================================================*/
 /*jshint bitwise: false*/
 App.controller('StoreController', ['$scope', '$state', '$stateParams', 'RestServiceFactory', 'toaster', 'FORMATS', '$timeout','DataTableService','$compile','ngDialog',
   function($scope, $state, $stateParams, RestServiceFactory, toaster, FORMATS, $timeout,DataTableService, $compile, ngDialog) {
    'use strict';
    $scope.init = function() {
      
    }
    $scope.init();
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
      $scope.venueImageId = [];
      $scope.VenueImageArray = [];
      $scope.imageId = []; 
      $scope.imageId = data.imageUrls;
      $scope.VenueImageArray.push($scope.getVenueImages());
      if(data.id) {
       $scope.VenueImageArray.length = 0;
       angular.forEach(data.imageUrls, function(values, key) {
          var images = {
              "id" : values.id,
              "originalUrl" : values.originalUrl,
              "uploadImage" : false, 
              "editImage" : true
          }
          $scope.VenueImageArray.push(images);
        });
      }
      data.phone = $.inputmask.format(data.phone,{ mask: FORMATS.phoneUS} );

      $scope.barType = (data.venueTypeCode & 1)  > 0 ? 'Y' : 'N';
      $scope.barNum = $scope.barType == 'Y' ? 1 : 0 ;
      $scope.clubType = (data.venueTypeCode & 2) > 0 ? 'Y' : 'N';
      $scope.clubNum = $scope.clubType == 'Y' ? 2 : 0 ;
      $scope.loungeType = (data.venueTypeCode & 4) > 0 ? 'Y' : 'N';
      $scope.loungeNum = $scope.loungeType == 'Y' ? 4 : 0 ;
      $scope.casinoType = (data.venueTypeCode & 8) >0 ? 'Y' : 'N';
      $scope.casinoNum = $scope.casinoType== 'Y' ? 8 : 0 ;
      $scope.nightClubType = (data.venueTypeCode & 32) > 0? 'Y' : 'N';
      $scope.nightClubNum = $scope.nightClubType == 'Y' ? 32 : 0 ;
      $scope.restaurantType = (data.venueTypeCode & 64) > 0 ? 'Y' : 'N';
      $scope.restaurantNum = $scope.restaurantType == 'Y' ? 64 : 0 ;
      $scope.bowlingType = (data.venueTypeCode & 128) > 0 ? 'Y' : 'N';
      $scope.bowlingNum = $scope.bowlingType == 'Y' ? 128 : 0 ;
      $scope.karaokeType = (data.venueTypeCode & 256) > 0 ? 'Y' : 'N';
      $scope.karaokeNum = $scope.karaokeType== 'Y' ? 256 : 0 ;
      $scope.venueEnabled = data.enabled;
      $scope.venueEnabled = $scope.venueEnabled == 'Y' ? 'Y' : 'N';
      $scope.cleansed =data.cleansed;
      if($scope.cleansed == true){
        $scope.cleansed =true;
      } else {
        $scope.cleansed =false;
      }
      $scope.data = data;
      $scope.initInfoTable();
    });
  } else {
    $scope.imageId = [];
    var data = {};
    data.country = "USA";
    data.venueTypeCode = 0;
    $scope.barType = (data.venueTypeCode & 1)  > 0 ? 'Y' : 'N';
    $scope.clubType = (data.venueTypeCode & 2) > 0 ? 'Y' : 'N';
    $scope.loungeType = (data.venueTypeCode & 4) > 0 ? 'Y' : 'N';
    $scope.casinoType = (data.venueTypeCode & 8) >0 ? 'Y' : 'N';
    $scope.nightClubType = (data.venueTypeCode & 32) > 0? 'Y' : 'N';
    $scope.restaurantType = (data.venueTypeCode & 64) > 0 ? 'Y' : 'N';
    $scope.bowlingType = (data.venueTypeCode & 128) > 0 ? 'Y' : 'N';
    $scope.karaokeType = (data.venueTypeCode & 256) > 0 ? 'Y' : 'N';


    $scope.data = data;
    $scope.initInfoTable();
  }
  $scope.addVenueImage = function(arrayObj) {
    arrayObj.push($scope.getVenueImages());
  }
  $scope.getVenueImages = function() {
    return { id : "", originalUrl: "", uploadImage : true, editImage : false };
  }
  $scope.removeVenueImage = function(index, arrayObj, value) {
    arrayObj.splice(index, 1);
    var id= {
      "id" : value.id
    }
    $scope.venueImageId.push(id);
    var target = {id: value.id};
    RestServiceFactory.VenueImage().delete(target,  function(success){
    },function(error){
      if (typeof error.data !== 'undefined') { 
        toaster.pop('error', "Server Error", error.data.developerMessage);
      }
    });
  }
  $scope.isVenueType = function(code) {
  	if (typeof $scope.venueType == 'undefined'){
  		return true;
  	}
  	var val = $scope.venueType[code]; 
  	return val == 1;
  }
  $scope.updateAttribute = function (rowId) {
    var table = $('#venue_info_table').DataTable();
    if(rowId == undefined){
      var rowData = '';
    } else {
      var rowData = table.row(rowId).data();
    }
    ngDialog.openConfirm({
      template: 'modalDialogId',
      className: 'ngdialog-theme-default',
      data: {key: rowData[0], value: rowData[1]}
    }).then(function (value) {
      var payload = {};
      if (rowId == undefined) {
        var values = value.value;
        var keys =value.key;
        payload[keys]= values;
      } else {
        value = value.value;
        payload[rowData[0]] = value;
      }          
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
  };
  
  $scope.enabledVenue = function(venueEnabled){
    $scope.venueEnabled = venueEnabled == 'Y' ? 'N' : 'Y';
  }
  $scope.enableCleansed = function(cleansed){
    $scope.cleansed = cleansed== true ? false : true;
  }
  $scope.update = function(isValid, data) {
    data.enabled = $scope.venueEnabled;
    data.cleansed = $scope.cleansed;
    var venueTypeCode  = 0; 
    venueTypeCode += $scope.barType == 'Y' ? 0 : 1;
    venueTypeCode += $scope.clubType == 'Y' ? 0 : 2;
    venueTypeCode += $scope.loungeType == 'Y' ? 0 : 4;
    venueTypeCode += $scope.casinoType == 'Y' ? 0 : 8;
    venueTypeCode += $scope.nightClubType == 'Y' ? 0 : 32;
    venueTypeCode += $scope.restaurantType == 'Y' ? 0 : 64;
    venueTypeCode += $scope.bowlingType == 'Y' ? 0 : 128;
    venueTypeCode += $scope.karaokeType == 'Y' ? 0 : 256;
    data.venueTypeCode = venueTypeCode;
    angular.forEach($scope.imageId, function(value, key){ 
      delete value.type;
      delete value.name;
      delete value.originalUrl;
      delete value.smallUrl;
      delete value.mediumUrl;
      delete value.originalWidth;
      delete value.originalHeight;
      delete value.smallWidth;
      delete value.smallHeight;
      delete value.mediumWidth;
      delete value.mediumHeight;
      delete value.largeUrl ;
      delete value.largeWidth;
      delete value.largeHeight;
      delete value.active;
      angular.forEach($scope.venueImageId, function(value1, key1) {
        if(value.id == value1.id) {
          delete value.id;
        }     
      });
    })
    data.imageUrls = $scope.imageId;
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
  $scope.uploadFile = function(venueImage) {
    console.dir(venueImage);
    var fd = new FormData();
    fd.append("file", venueImage[0]);
    var payload = RestServiceFactory.cleansePayload('VenueImage', fd);
    RestServiceFactory.VenueImage().uploadVenueImage(payload, function(success){
      venueImage.uploadedImage = true;
      venueImage.id = success.id;
      venueImage.originalUrl =success.originalUrl;
      venueImage.largeUrl = success.largeUrl;
      venueImage.uploadImage = false;
      venueImage.editImage = true;
      if(success != {}){
        $scope.imageId.push(success);
      }
    },function(error){
      if (typeof error.data != 'undefined') {
       toaster.pop('error', "Server Error", error.data.developerMessage);
     }
   });
  };
}]);