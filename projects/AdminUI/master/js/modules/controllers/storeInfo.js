/**=========================================================
 * Module: storeInfo.js
 * smangipudi
 =========================================================*/
 /*jshint bitwise: false*/
 App.controller('StoreController', ['$translate','$scope', '$state', '$stateParams', 'RestServiceFactory', 'toaster', 'FORMATS', '$timeout','DataTableService','$compile','ngDialog',
   function($translate, $scope, $state, $stateParams, RestServiceFactory, toaster, FORMATS, $timeout,DataTableService, $compile, ngDialog) {
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
        var actionHtml = ('<button title="Edit" class="btn btn-default btn-oval fa fa-edit" ng-click="updateAttribute(\'' + row + '\'  )"></button>&nbsp;&nbsp;');

        $(td).html(actionHtml);
        $compile(td)($scope);
      }
    }];
    DataTableService.initDataTable('venue_info_table', columnDefinitions);
    var table = $('#venue_info_table').DataTable();

    $.each($scope.data.info, function (k,v) {
      table.row.add([$translate.instant(k), v, k]);
    });
    table.draw();
  };
  $scope.venueTypeCodes = function(data){
    $scope.barType = (data.venueTypeCode & 1)  > 0 ? 'Y' : 'N';
    $scope.clubType = (data.venueTypeCode & 2) > 0 ? 'Y' : 'N';
    $scope.loungeType = (data.venueTypeCode & 4) > 0 ? 'Y' : 'N';
    $scope.casinoType = (data.venueTypeCode & 8) >0 ? 'Y' : 'N';
    $scope.nightClubType = (data.venueTypeCode & 32) > 0? 'Y' : 'N';
    $scope.restaurantType = (data.venueTypeCode & 64) > 0 ? 'Y' : 'N';
    $scope.bowlingType = (data.venueTypeCode & 128) > 0 ? 'Y' : 'N';
    $scope.karaokeType = (data.venueTypeCode & 256) > 0 ? 'Y' : 'N';
  }
  if($stateParams.id != 'new') {
    var promise = RestServiceFactory.VenueService().get({id:$stateParams.id});
    promise.$promise.then(function(data) {
      data.phone = $.inputmask.format(data.phone,{ mask: FORMATS.phoneUS} );
      $scope.imageUrl = data.imageUrls;
      $scope.venueTypeCodes(data);
      $scope.data = data; 
      $scope.initInfoTable();
    });
  } else {
    var data = {};
    $scope.imageUrl = [];
    data.country = "USA";
    data.venueTypeCode = 0;
    $scope.venueTypeCodes(data);
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
    var table = $('#venue_info_table').DataTable();
    var createTitle;
    if(rowId == undefined){
      var rowData = '';
      createTitle = "Create Venue Attribute";
    } else {
      var rowData = table.row(rowId).data();
      createTitle = "Update Venue Attribute";
      var hideKeyText = true;
    }
    ngDialog.openConfirm({
      template: 'modalDialogId',
      className: 'ngdialog-theme-default',
      data: {key: rowData[0], value: rowData[1], title: createTitle, text:hideKeyText},
    }).then(function (value) {
      var payload = {};
      if (rowId == undefined) {
        var attributeValue = value.value;
        var attributeKey =value.key;
        payload[attributeKey]= attributeValue;
        $scope.updateServices(payload);
        $scope.data.info[attributeKey] = attributeValue;
      } else {
        value = value.value;
        payload[rowData[0]] = value;
        $scope.updateServices(payload)
        $scope.data.info[rowData[0]] = value;
      }
      table.clear();
      $.each($scope.data.info, function (k,v) {
        table.row.add([k, v, k]);
      });
      table.draw();    
    }, function (reason) {
  	//mostly cancelled  
    });
  };
  $scope.updateServices = function(payload){
    var promise = RestServiceFactory.VenueService().updateAttribute({id:$stateParams.id}, payload, function(data){
      toaster.pop('data', "Attribute updated successfull");
    },function(error){
      if (typeof error.data != 'undefined') {
        toaster.pop('error', "Server Error", error.data.developerMessage);
      }
    });
  }
  $scope.update = function(isValid, data) {
    if (!isValid) {
      return;
    }
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
    $scope.imageId = [];
    angular.forEach($scope.imageUrl, function(value, key){ 
      var venueImageId = {
        "id" : value.id
      }
      $scope.imageId.push(venueImageId);
    });
    data.imageUrls = $scope.imageId;
    var payload = RestServiceFactory.cleansePayload('VenueService', data);
    var target = {id: data.id};
    if ($stateParams.id == 'new'){
      target = {};
    }
    RestServiceFactory.VenueService().save(target,payload, function(success){
      ngDialog.openConfirm({
        template: '<p>venue information update successfull</p>',
        plain: true,
        className: 'ngdialog-theme-default'
      });
      $state.go('app.stores');
    },function(error){
      if (typeof error.data != 'undefined') {
       toaster.pop('error', "Server Error", error.data.developerMessage);
      }
    });
  }
  $scope.uploadFile = function(venueImage) {
    var fd = new FormData();
    fd.append("file", venueImage[0]);
    var payload = RestServiceFactory.cleansePayload('venueImage', fd);
    RestServiceFactory.VenueImage().uploadVenueImage(payload, function(success){
      if(success != {}){
        $scope.imageUrl.push(success);
        toaster.pop('success', "Image upload successfull");
        document.getElementById("control").value = "";
      }
    },function(error){
      if (typeof error.data != 'undefined') {
       toaster.pop('error', "Server Error", error.data.developerMessage);
      }
    });
  };
}]);