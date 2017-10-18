/**=========================================================
 * Module: storeInfo.js
 * smangipudi
 =========================================================*/
 /*jshint bitwise: false*/
 App.controller('StoreController', ['$translate','$scope', '$state', '$stateParams',
  'RestServiceFactory', 'toaster', 'FORMATS', '$timeout','DataTableService','$compile','ngDialog',
      function($translate, $scope, $state, $stateParams, RestServiceFactory, toaster, FORMATS,
        $timeout,DataTableService, $compile, ngDialog) {
  'use strict';
  $scope.deletedVenueImage = [];
  $scope.advanceSwitches = {
    "Advance.BottleService.enable" : false,
    "Advance.BookBanqetHall.enable": false,
    "Advance.tableService.enable": false,
    "Advance.DrinksService.enable": false,
     "Advance.FoodRequest.enable": false,
    "Advance.BookKaroakeRoom.enable": false,
    "Advance.Bowling.enable": false,
    "Advance.ClickerOption.enable": false,
    "Advance.deals.enable": false,
    "Advance.DJRequest.enable": false,
    "Advance.enabledPayment": false,
    "Advance.FastPass.enable": false,
    "Advance.game.enable": false,
    "Advance.LostFacus.enable": false,
    "Advanced.tournaments.enable": false,
    "Advance.GuestList.enable": false,
    "Advance.KarokeRequest.enable": false 
  };
  
  $scope.tabs = [
    {name: 'Venue Information', content: 'app/views/venue/form-venue.html', icon: 'fa-home'},
    {name: 'Attributes', content: 'app/views/venue/venue-attributes.html', icon: 'fa-list-ul'},
    {name: 'Private Events', content: 'app/views/venue/private-events.html', icon: 'fa-birthday-cake'},
    {name: 'Bottle', content: 'app/views/venue/venue-bottle.html', icon: 'fa-beer'},
    {name: 'Party Packages', content: 'app/views/venue/party-events.html', icon: 'fa-trophy'},
    {name: 'Products', content: 'app/views/venue/venue-products.html', icon: 'fa-shopping-basket'},
    {name: 'Offers/Deals', content: 'app/views/venue/venue-deals.html', icon: 'fa-money'},
    {name: 'Events', content: 'app/views/venue-events/venue-events.html', icon: 'fa-calendar-o'},
    {name: 'Outlets', content: 'app/views/venue/venue-stores.html', icon: 'fa-building-o'},
    {name: 'Portal', content: 'app/views/venue/venue-portal.html', icon: 'fa-home'},
  ];
  
  $scope.onUpdate = function() {
    var payload = {};
    angular.forEach($scope.advanceSwitches, function(v, k, o) {
      $scope.data.info[k] = v ? 'Y' : 'N';
      payload[k] = v ? 'Y' : 'N';
    });
    $scope.updateServices(payload);
  };

  $scope.initInfoTable = function() {
    if ( ! $.fn.dataTable || $stateParams.id === 'new') {
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
      "createdCell": function (td, cellData, rowData, row, col) {
        var actionHtml = ('<button title="Edit" class="btn btn-default btn-oval fa fa-edit" '+
            'ng-click="updateAttribute(\'' + row + '\'  )"></button>&nbsp;&nbsp;');

        $(td).html(actionHtml);
        $compile(td)($scope);
      }
    }];
    DataTableService.initDataTable('venue_info_table', columnDefinitions);
    var table = $('#venue_info_table').DataTable();

    $.each($scope.data.info, function (k,v) {
      if ($scope.advanceSwitches.hasOwnProperty(k)) {
        $scope.advanceSwitches[k] = (v === 'Y' ? true : false);
      } else {
        table.row.add([$translate.instant(k), v, k]);
      }
    });
    table.draw();
  };
  function addType(typeName, typeValue, displayName, venueTypeCode) {

    var obj = {
      typeName : typeName,
      typeValue: typeValue,
      value: (venueTypeCode & typeValue)  > 0,
      displayName: displayName,
    };

    $scope.venueTypes.push(obj);

  }
  $scope.venueTypeCodes = function(data){
    $scope.venueTypes = [];
    addType("barType", 1, "Bar", data.venueTypeCode);
    addType("clubType", 2, "Club", data.venueTypeCode);
    addType("loungeType", 4, "Lounge", data.venueTypeCode);
    addType("casinoType", 8, "Casino", data.venueTypeCode);
    addType("nightClubType", 32, "Night Club", data.venueTypeCode);
    addType("restaurantType", 64, "Restaurant", data.venueTypeCode);
    addType("bowlingType", 128, "Bowling", data.venueTypeCode);
    addType("karaokeType", 256, "Karaoke", data.venueTypeCode);
  };
  $scope.deleteImage = function(index, deletedImage) {
      var id= {
          "id" : deletedImage.id
      }
      RestServiceFactory.VenueImage().deleteVenueImage(id, function(data){
        deletedImage.status = "DELETED";
        toaster.pop('data', "Deleted the selected Image successfull");
      },function(error){
        if (typeof error.data !== 'undefined') {
          toaster.pop('error', "Server Error", error.data.developerMessage);
        }
      });
  };
  $scope.isVenueType = function(code) {
  	if (typeof $scope.venueType === 'undefined'){
  		return true;
  	}
  	var val = $scope.venueType[code]; 
  	return val === 1;
  };
  $scope.updateAttribute = function (rowId) {
    var table = $('#venue_info_table').DataTable();
    var createTitle;
    var rowData = '';
    if(rowId === undefined){
      createTitle = "Create Venue Attribute";
    } else {
      rowData = table.row(rowId).data();
      createTitle = "Update Venue Attribute";
      var hideKeyText = true;
    }
    ngDialog.openConfirm({
      template: 'modalDialogId',
      className: 'ngdialog-theme-default',
      data: {key: rowData[0], value: rowData[1], title: createTitle, text:hideKeyText},
    }).then(function (value) {
      var payload = {};
      if (rowId === undefined) {
        var attributeValue = value.value;
        var attributeKey =value.key;
        payload[attributeKey]= attributeValue;
        $scope.updateServices(payload);
        $scope.data.info[attributeKey] = attributeValue;
      } else {
        value = value.value;
        payload[rowData[2]] = value;
        $scope.updateServices(payload);
        $scope.data.info[rowData[2]] = value;
      }
      table.clear();
      $.each($scope.data.info, function (k,v) {
        table.row.add([$translate.instant(k), v, k]);
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
      if (typeof error.data !== 'undefined') {
        toaster.pop('error', "Server Error", error.data.developerMessage);
      }
    });
  };
  $scope.update = function(isValid, data) {
    if (!isValid) {
      return;
    }
    var venueTypeCode  = 0; 
    for (var tIndex = 0; tIndex < $scope.venueTypes.length; tIndex++) {
      if ($scope.venueTypes[tIndex].value) {
        venueTypeCode += $scope.venueTypes[tIndex].typeValue;
      }
    }    
    data.venueTypeCode = venueTypeCode;
    $scope.imageId = [];
    angular.forEach($scope.imageUrl, function(value, key){
      var venueImageId = {
        "id" : value.id
      };
      angular.forEach($scope.deletedVenueImage, function(value1, key1) {
        if(venueImageId.id == value1.id) {
            delete venueImageId.id;
            }
        });
      $scope.imageId.push(venueImageId);
    });
    data.imageUrls = $scope.imageId;
    var payload = RestServiceFactory.cleansePayload('VenueService', data);
    var target = {id: data.id};
    if ($stateParams.id === 'new'){
      target = {};
    }
    RestServiceFactory.VenueService().save(target,payload, function(success){
     
        ngDialog.openConfirm({
          template: '<p>venue information saved successfully</p>',
          plain: true,
          className: 'ngdialog-theme-default'
        });
      
      $state.go('app.venues');
    },function(error){
      if (typeof error.data !== 'undefined') {
       toaster.pop('error', "Server Error", error.data.developerMessage);
      }
    });
  };
  $scope.uploadFile = function(venueImage) {
    var fd = new FormData();
    fd.append("file", venueImage[0]);
    var payload = RestServiceFactory.cleansePayload('venueImage', fd);
    RestServiceFactory.VenueImage().uploadVenueImage(payload, function(success){
      if(success !== {}){
        $scope.imageUrl.push(success);
        toaster.pop('success', "Image upload successfull");
        document.getElementById("control").value = "";
      }
    },function(error){
      if (typeof error.data !== 'undefined') {
       toaster.pop('error', "Server Error", error.data.developerMessage);
      }
    });
  };


  $timeout(function () {
    if($stateParams.id !== 'new') {
      var promise = RestServiceFactory.VenueService().get({id:$stateParams.id});
      promise.$promise.then(function(data) {
        data.phone = $.inputmask.format(data.phone,{ mask: FORMATS.phoneUS} );
        $scope.imageUrl = [];
        for (var imgIndex = 0; imgIndex < data.imageUrls.length; imgIndex++) {
          if ( data.imageUrls[imgIndex].id !== null) {
            $scope.imageUrl.push(data.imageUrls[imgIndex]);
          }
        }
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
  });
}]);