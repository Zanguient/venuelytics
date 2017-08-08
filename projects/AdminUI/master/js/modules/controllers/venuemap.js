/**
 * ========================================================= Module: venuemap.js
 * smangipudi =========================================================
 */

App.controller('VenueMapController', ['$scope', '$state','$compile','$timeout', 'RestServiceFactory','DataTableService', 
  'toaster', '$stateParams','ngDialog', function( $scope, $state, $compile, $timeout, RestServiceFactory,
   DataTableService, toaster, $stateParams, ngDialog) {
  'use strict';
  
  $scope.img = {};
  $scope.img.picUrl = "";
  $scope.createElements = [];
  $scope.addMapsforSave = [];
  $scope.imageUrls = [];
  $timeout(function(){

    if ( ! $.fn.dataTable ) return;
  
    var image = new Image();
  image.onload = function(){
    $scope.originalWidth = this.width;
    $scope.originalHeight = this.height;
    $scope.img.picUrl = this.src;
            
  }; 
  $('#venueMapImg').bind('resize', function(){
    
    if ($scope.displayWidth !== $('#venueMapImg').width() || $scope.displayHeight !== $('#venueMapImg').height()) {
      $scope.displayWidth = $('#venueMapImg').width();
      $scope.displayHeight = $('#venueMapImg').height();
      var a = $scope.img.picUrl;
      $scope.img.picUrl = "";
      $timeout(function(){
        $scope.img.picUrl =a;
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
                            var d = rowData;
                            var splitElement ={
                              "id":d[5],
                              "productType": "VenueMap",
                              "category": "category",
                              "subCategory": null,
                              "itemCategory": null,
                              "name": d[0],
                              "brand": "brand",
                              "by": null,
                              "description": d[3],
                              "size": d[2],
                              "unit": "people",
                              "price": d[1],
                              "enabled": "Y",
                              "servingSize": d[2],
                              "imageUrls": d[6]
                            };
                            $scope.createElements.push(splitElement);
                            var actionHtml = '<button title="Edit Table" class="btn btn-default btn-oval fa fa-edit" ng-click="editTable('+row+','+cellData+')"></button>&nbsp;&nbsp;';
                            actionHtml += '<button title="Delete Table" class="btn btn-default btn-oval fa fa-trash" ng-click="deleteTable('+row+')"></button>';
                            
                            $(td).html(actionHtml);
                             $compile(td)($scope);
                            }
                          /*"render": function (data, type, row, meta ) {
                            var actionHtml = '<button title="Edit Table" class="btn btn-default btn-oval fa fa-edit" ng-click="editTable('+meta.row+','+meta.col+')"></button>&nbsp;&nbsp;';
                            actionHtml += '<button title="Delete Table" class="btn btn-default btn-oval fa fa-trash" ng-click="deleteTable('+meta.row+')"></button>';
                            
                            return actionHtml;
                          }*/                       },
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
                            if (cellData === false){
                              actionHtml = '<em class="fa fa-square-o"></em>';
                            }
                            $(td).html(actionHtml);
                            $compile(td)($scope);
                          }
                          
                     } ];
  
  
  DataTableService.initDataTable('tables_table', columnDefinitions, false);
    var promise = RestServiceFactory.VenueMapService().getAll({id: $stateParams.venueNumber});
    $scope.venueNumber = $stateParams.venueNumber;
    if($stateParams.id !== ""){
    promise.$promise.then(function(data) {
      data.map(function(venueMap) {
        if (venueMap.id === $stateParams.id) {
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
              table.row.add([t.name, t.price, t.servingSize, t.description, t.enabled,  t.id, t.imageUrls]);
            });
            table.draw();
          }        
        });      
      });
    }
    $scope.addTable = function () {
      $scope.newTable = {};
      $scope.newTable.enabled = 'Y';
      $scope.newTable.id = -1;
      $scope.newTable.imageUrls =[];
      ngDialog.openConfirm({
          template: 'app/templates/product/form-table-info.html',
           //plain: true,
          className: 'ngdialog-theme-default',
          scope : $scope 
        }).then(function (value) {
          var table = $('#tables_table').DataTable();
          table.row.add([$scope.newTable.name, $scope.newTable.price, $scope.newTable.servingSize, $scope.newTable.description,  $scope.newTable.enabled,   $scope.newTable.id, $scope.newTable.imageUrls]);
          table.page( 'last' ).draw( false );
          _addArea($scope.img);
          },function(error){
            
         });
           
        
    };
    
    function _addArea(img) {
      
        if (!img || !img.maps || !angular.isArray(img.maps)) {
            img = angular.isObject(img) ? img : {};
            img.maps = [];
        }
        img.maps.map( function(area) {
          area.editMode = false;
        });
        var calculation = img.getCalculation(),
            lastImg = img.maps.slice(-1)[0],
            lastImgLeft = lastImg ? lastImg.coords[0] : 0,
            lastImgTop = lastImg ? lastImg.coords[1] : 0,
            newImgCoords = [lastImgLeft + 30, lastImgTop + 30, lastImgLeft + 100, lastImgTop + 100];

        if (calculation) {
            img.maps.push({editMode: true, coords: calculation.checkCoords(newImgCoords)});
        } else {
            img.maps.push({editMode: true, coords: newImgCoords });
        }
    }
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
      $scope.newTable.imageUrls = d[6];
      ngDialog.openConfirm({
          template: 'app/templates/product/form-table-info.html',
          // plain: true,
          className: 'ngdialog-theme-default',
          scope : $scope 
        }).then(function (value) {
          $('#tables_table').dataTable().fnDeleteRow(rowId);
          var t = $scope.newTable;
          table.row.add([t.name, t.price, t.servingSize, t.description, t.enabled,  t.id, t.imageUrls]);
          table.draw();
          },function(error){
            
         });
    };
    
    $scope.doneEditing = function() {
      $scope.img.maps.map(function(area){
      area.editMode = true;
      });
    };    
    $scope.deleteTable = function(rowId) {
      var table = $('#tables_table').dataTable();
      table.fnDeleteRow(rowId);
    };

    $scope.createNewVenueMap = function() {
      $state.go('app.venueMapedit', {id: 'new'});
    };
    
     

  
  $scope.$watch('img', function(nVal, oVal){
      $scope.imgJson = angular.toJson(nVal, true);
  }, true);
  $scope.mapFns = {
          getCanSize: function() {
              return [$scope.displayWidth, $scope.displayHeight];
          },
          getImgSize: function(img) {
                return _getImgSize(img.picUrl) || [10, 10];
            },
            removeArea : function(area, index) {
              var table = $('#tables_table').dataTable();
              table.fnDeleteRow(index);
            }
  };
  function _getImgSize(url) {
     
    if (typeof $scope.originalHeight === 'undefined') {
      return false;
    } else {
      return [$scope.originalWidth, $scope.originalHeight];
    }
  }
  $scope.update = function(isValid, data, venueNumber) {
    for (var i = 0; i < $scope.img.maps.length; i++) {
      var coordinates = [];
      var print = ($scope.img.maps[i].coords);
      coordinates[0] = print[0];
      coordinates[1] = print[1];
      coordinates[2] = print[2];
      coordinates[3] = print[1];
      coordinates[4] = print[2];
      coordinates[5] = print[3];
      coordinates[6] = print[0];
      coordinates[7] = print[3];
      var splitCoordinates = coordinates.toString();
      var objectMappingDecoupling = { "TableName": $scope.createElements[i].name, "coordinates": splitCoordinates };
      $scope.addMapsforSave.push(objectMappingDecoupling);
    }
    data.imageMap = JSON.stringify($scope.addMapsforSave);
    data.elements = $scope.createElements;
    if($scope.imageUrls !==""){
      data.imageUrls = $scope.imageUrls;
      $scope.imageUrls = [];
    }
    angular.forEach(data.imageUrls, function(value, key) {
      var venueImageId = {
          "id" : value.id
      };
      $scope.imageUrls.push(venueImageId);
    });
    data.imageUrls = $scope.imageUrls;
    angular.forEach(data.elements, function(value2, key2) {
      var tableImageUrl = value2.imageUrls;
      value2.imageUrls = [];
      angular.forEach(tableImageUrl, function(value1, key1) {
        var tableImageId = {
        "id": value1.id
        };
        value2.imageUrls.push(tableImageId);
      });
     
    });
      /*if (!isValid) {
        return;
      }*/
      var payload = RestServiceFactory.cleansePayload('updateVenueMap', data);
      var target = {id: venueNumber};
      /*if ($stateParams.id == 'new'){
        target = {};
      }*/
      RestServiceFactory.VenueMapService().updateVenueMap(target,payload, function(success){
        $state.go('app.storeedit', {id : venueNumber});
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
      RestServiceFactory.VenueImage().uploadTableImage(payload, function(success){
        if(success !== {}){
          var splitImage = $("#bottleClear").val();
          if(splitImage === ""){
            var t = $scope.newTable;
            t.imageUrls.push(success);
            document.getElementById("clear").value = "";
          } else {
            $scope.img.picUrl = success.originalUrl;
            $scope.originalWidth = success.largeWidth;
            $scope.originalHeight = success.largeHeight;
            $scope.imageUrls.push(success);
            document.getElementById("bottleClear").value = "";
          }
          toaster.pop('success', "Image upload successfull");
        }
      },function(error){
        if (typeof error.data !== 'undefined') {
         toaster.pop('error', "Server Error", error.data.developerMessage);
        }
      });
    };
  });
}]);