/**
 * smangipudi
 * ========================================================= 
 * Module:
 * access-login.js  for login api
 * =========================================================
 */

App.controller('LoginFormController',  ['$state', '$stateParams','$scope', '$rootScope', '$location','AUTH_EVENTS','AuthService', '$cookies', 'Session', 'ContextService',
                                     function ($state, $stateParams, $scope, $rootScope, $location, AUTH_EVENTS, AuthService, $cookies, Session, ContextService) {
  // bind here all data from the form
  $scope.account = {};
  $scope.account.loginId = $rootScope.$storage.userName;
  $scope.account.remember = $rootScope.$storage.remember;
  $scope.account.loginType = 'user';

  $scope.serverName = ContextService.serverName;
  // place the message if something goes wrong
  $scope.authMsg = '';
  $scope.loginAction = true;
  $scope.userName = Session.userName;
  $scope.login = function(account) {
	  $scope.authMsg = '';
	  $rootScope.cookies = $cookies;
	  $scope.loginAction = true;
	  if(account.remember == "true") {
		  $rootScope.$storage.userName = account.loginId;
		  $rootScope.$storage.remember = account.remember;
	  } else {
		  $rootScope.$storage.userName = "";
		  $rootScope.$storage.remember = false;
	  }
	  AuthService.login(account).then(function (user) {
		  $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
		  $state.go("app.dashboard");
		  $scope.loginAction = false;
	  }, function () {
		    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
		    $scope.authMsg = "login.FAILED";
		    $scope.loginAction = false;
	  });
  };
  $scope.logout = function() {
	  
	  AuthService.logout().then(function (user) {
		  $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
		  $state.go("page.login");
	  }, function () {
		    $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
	  });
  };
}]);
