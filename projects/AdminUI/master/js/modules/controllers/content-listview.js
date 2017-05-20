/**
 * ========================================================= Module: beacons.js
 * smangipudi =========================================================
 */

App.controller('ContentListViewController', ['$scope', '$state', '$compile', '$timeout', 'RestServiceFactory', 'DataTableService',
                                       'toaster', '$location', '$log', 'ContextService', '$http',
  function($scope, $state, $compile, $timeout, RestServiceFactory, DataTableService, toaster, $location, $log,
		ContextService, $http) {
	'use strict';

	/**
	 * edit function
	 */
	$scope.editContent=function(contentId){
		$log.log("edit is called!", contentId);
		$state.go('app.createcontent', {id: contentId});
	}
	$scope.deleteContent = function(rowId, contentId) {

   		var target = {id: contentId};
   		RestServiceFactory.ContentService().delete(target,  function(success){
     		var table = $('#content_table').dataTable();
     		table.fnDeleteRow(rowId);
     	},function(error){
     		if (typeof error.data != 'undefined') { 
     			toaster.pop('error', "Server Error", error.data.developerMessage);
     		}
     	});
   	}
	$scope.promotion = [];
	$scope.promotions = [];
	$timeout(function() {

		if (!$.fn.dataTable)
			return;
		var columnDefinitions = [ 
		    { sWidth: "25%", aTargets: [0,1] },
		    { sWidth: "10%", aTargets: [2,3,4] },
		    { sWidth: "20%", aTargets: [2,3,4] },
		    {
			"targets" : [ 5 ],
			"orderable" : false,
			"createdCell" : function(td, cellData, rowData, row, col) {
				$(td).html('<button class="btn btn-default btn-oval fa fa-edit" ng-click="editContent(' + cellData+ ')">'
						  +'</button>&nbsp;&nbsp;<button class="btn btn-default btn-oval fa fa-trash" ng-click="deleteContent(' + row + ','
								+ cellData + ')"></button>');
				$compile(td)($scope);
			}
		} ];

		DataTableService.initDataTable('content_table', columnDefinitions);

		var table = $('#content_table').DataTable();
		$scope.promotions = [];
		$scope.obj = {};

		var CHANNEL =[];
		CHANNEL[1] = "SMS";
		CHANNEL[2] = "Email";
		CHANNEL[4] = "In App";
		CHANNEL[8] = "Notification";
		CHANNEL[16] = "Passbook";
		
		var baseUrl = ContextService.contextName + "/v1/content";
		$log.log("baseUrl: ", baseUrl);
	
		$http.get(baseUrl).success(
			function(data) {
	
				if (data.contents && data.contents.length > 0) {
	
					for (var idx = 0; idx < data.contents.length; idx++) {
						$scope.promotions.push(data.contents[idx]);
					}
				}
				;
				$scope.promotions.map(function(promotion) {
					table.row.add([ promotion.text, promotion.description, promotion.contentType,
					                CHANNEL[promotion.targetChannels], promotion.state, promotion.id ]);
				});
				table.draw();
	
			}).error(function(data) {
				$log.log("error data:", data);
			});

	});
} ]);