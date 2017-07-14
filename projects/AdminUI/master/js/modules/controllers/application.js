/**=========================================================
 * Module: application.js

 =========================================================*/

App.controller('ApplicationController', ['$scope','RestServiceFactory','$http', '$state','$log','$rootScope', 'ContextService',
                                         function($scope, RestServiceFactory, $http, $state, $log, $rootScope, contextService) {
    'use strict';
	$scope.appLogo = "app/img/itzfun_logo.png";
	$scope.appLogoSingle = "app/img/itzfun_logo.png";
	$scope.serverName = contextService.serverName;
	$scope.unreadMessages = 0;
	$scope.notificationSummaries = {};
	
	$scope.getNotificationIconClass = $rootScope.getNotificationIconClass;
    
	$scope.notificationSummary = function() {
		var target = {id:contextService.userVenues.selectedVenueNumber};
		var promise = RestServiceFactory.NotificationService().getNotificationSummary(target);

		promise.$promise.then(function(data) {
			$scope.unreadMessages = 0;
			$scope.notificationSummaries = data.summary;
			for(var key in $scope.notificationSummaries) {
				if ($scope.notificationSummaries.hasOwnProperty(key)){
					$scope.unreadMessages += $scope.notificationSummaries[key];
				}
			}
		});
	};
	
	$scope.notificationSummary();

	setInterval(function(){
  		$scope.notificationSummary();
	}, 30000);
	
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
