/**
 * smangipudi
 * ========================================================= 
 * Module:
 * reset-password.js  for password reset
 * =========================================================
 */

App.controller('PasswordResetController',  ['$state','$scope',  '$location', 'RestServiceFactory','toaster', '$timeout',
                                     function ($state, $scope,  $location, RestServiceFactory, toaster, $timeout) {
  // bind here all data from the form
  'use strict';
  $scope.account = {};
 
  // place the message if something goes wrong
  
  $scope.resetPassword = function(account) {

  	  if(account.password == '' || account.password !== account.newpassword) {
  	  	return;
  	  }

	  RestServiceFactory.UserService().resetPassword(account, function (response) {
		if (response.statusCode < 0 ) {
			toaster.pop('error', "Reset Password", response.reason);
		} else {
			toaster.pop('success', "Reset Password", "Congratulatons! You have successfully changed your password.");
			$timeout(function() {
				$state.go('page.login');
			}, 3000);
		}
	  }, function () {

	  });
  };
  
}]);
