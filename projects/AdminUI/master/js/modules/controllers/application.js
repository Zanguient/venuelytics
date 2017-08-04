/**=========================================================
 * Module: application.js

 =========================================================*/

App.controller('ApplicationController', ['$scope','RestServiceFactory','AuthService','$http', '$state','$log','$rootScope', 'ContextService', 'AUTH_EVENTS',
                                         function($scope, RestServiceFactory, AuthService, $http, $state, $log, $rootScope, contextService, AUTH_EVENTS) {
    'use strict';
	$scope.appLogo = "app/img/itzfun_logo.png";
	$scope.appLogoSingle = "app/img/itzfun_logo.png";
	$scope.serverName = contextService.serverName;
	$scope.notificationSummaries = {};
	$scope.totalTypes = 0;
	$rootScope.unreadMessages = 0;
	$rootScope.requestCount = 0;
    $rootScope.comfirmedCount = 0;
	$scope.getNotificationIconClass = $rootScope.getNotificationIconClass;
    var statusArray = ['REQUEST', 'COMPLETED', 'ASSIGNED', 'CANCELED', 'REJECTED'];
	$scope.notificationSummary = function() {
		var target = {id:contextService.userVenues.selectedVenueNumber};
		
		var promise = RestServiceFactory.NotificationService().getNotificationSummary(target);

		promise.$promise.then(function(data) {
			$scope.notificationSummaries = data.summary;
			$scope.totalTypes = 0;
			$rootScope.unreadMessages = 0;
			for(var key in $scope.notificationSummaries) {
				if ($scope.notificationSummaries.hasOwnProperty(key)){
					if($.inArray(key, statusArray) === -1) {
						$rootScope.unreadMessages += $scope.notificationSummaries[key];
						$scope.totalTypes++;
					}
				}
			}
			$rootScope.banquetHallCount = data.summary["BanquetHall"];
			$rootScope.bottleCount = data.summary["Bottle"];
			
		});
	};
	
	$scope.notificationSummary();

	setInterval(function(){
  		$scope.notificationSummary();
	}, 300000);
	
	$rootScope.$on("onLogoChange",function(ev, data){
		$log.log("Logo has changed!", data);		
		$scope.appLogo = data.url;
		$rootScope.appLogo = data.url;
		
	});
	
	$scope.logout = function() {
	  
	  AuthService.logout().then(function (user) {
		  $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
		  $state.go("page.login");
	  }, function () {
		    $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
	  });
  };
}]);
