/**=========================================================
 * Module: application.js

 =========================================================*/

App.controller('ApplicationController', ['$scope', 'RestServiceFactory','$http', '$state','$log','$rootScope', 
                                         function($scope, RestServiceFactory, $http, $state, $log, $rootScope) {

	$scope.appLogo = "app/img/itzfun_logo.png";
	$scope.appLogoSingle = "app/img/itzfun_logo.png";
	
	var promise = RestServiceFactory.AppSettingsService().get();
	promise.$promise.then(function(data) {
		data.settings.map(function(item){
			
			if (item.name == "companyLogoUrl") {
				$scope.appLogo = item.value;
				$rootScope.appLogo = item.value;
				return;
			}
		});
	});
	
	
	$rootScope.$on("onLogoChange",function(ev, data){
		$log.log("Logo has changed!", data);		
		$scope.appLogo = data.url;
		$rootScope.appLogo = data.url;
		
	});
	
}]);
