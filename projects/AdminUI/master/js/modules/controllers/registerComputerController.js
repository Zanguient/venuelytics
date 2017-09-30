/**=========================================================
 * Module: registerComputerController.js
 =========================================================*/

App.controller('RegisterComputerController', ['$scope', '$state', 'RestServiceFactory', 'toaster',
	function($scope, $state, RestServiceFactory, toaster) {
	$scope.option = {};
	$scope.option.selectedOption = 1;
	$scope.submitTitle = "Register";
	$scope.waitCursor ="";
	$scope.registration = angular.fromJson($scope.$storage['computerRegistration']);
	if (typeof $scope.registration === 'undefined' ) {
		$scope.registration = {};
	}
	$scope.registered = false;
	$scope.tabIndex = 0;
	$scope.init = function() {
		$scope.checkRegistration($scope.registration);

	};
	$scope.validate = function(event, ui) {
		var retValue = $scope.registered;
		if($scope.registered) {
			$scope.tabDone = ui.nextIndex;	
			$scope.$digest();
			return true;
		} 
		if (ui.index === 0) {
			if ($scope.option.selectedOption == '2' || $scope.option.selectedOption == '3' ) {
				var target = {medium : $scope.option.selectedOption == '2' ? 'EMAIL' : 'SMS'};
				RestServiceFactory.AgencyService().sendRegistrationCode(target,{}, function(data){
					$scope.registration.registrationCode = data.registrationCode
					$scope.$storage['computerRegistration'] = angular.toJson($scope.registration);
				}, function(error) {
					toaster.pop('error', "Registration Error", "Unexpected error occurred. Please click Previous and re-register.");
				});
			}
			$scope.tabDone = ui.nextIndex;	
			return true;
		}
		if (ui.index === 1 && ui.nextIndex === 0) { // previous clicked
			$scope.tabDone = ui.nextIndex;	
			return true;
		}
		if (ui.index === 2 && ui.nextIndex === 1) {// previous in done stage
			return false;
		}

		if (ui.index === 1 && $scope.registrationInfo.$valid) {
			$scope.waitCursor = 'csspinner double-up';
			$scope.$digest();
			
			var payload = {machineName: $scope.registration.machineName,securityCode: $scope.securityCode, registrationCode: $scope.registration.registrationCode};

			RestServiceFactory.AgencyService().completeRegistration({},payload, function(data){
				$scope.waitCursor = '';
				$scope.$storage['computerRegistration'] = angular.toJson($scope.registration);
				if (data.status <= 0) {
					toaster.pop('error', "Registration Error", "Unexpected error occurred. Please click Previous and re-register.");
				} else {
					$scope.registered = true;
					$scope.tabDone = ui.nextIndex;
					$('#wizardId').bwizard("next");
				}

			}, function(error) {
				$scope.waitCursor = '';
				toaster.pop('error', "Registration Error", "Unexpected error occurred. Please click Previous and re-register.");
			});

			return false;
		}
		$('#registionForm').submit();

		return false;
		
	};

	$scope.checkRegistration = function(registration) {
		var target = {};
		RestServiceFactory.AgencyService().checkRegistration(target, registration, function(data) {
			if (data.status == 1) { // computer is registered, go to done screen.
				$scope.registered = true;
				$('#wizardId').bwizard("play");
			} else {
				$scope.registered = false;
				$scope.maskedEmail = data.email;
				$scope.maskedPhone = data.phone;
			}
		});
	};
	
	$scope.$watch('option.selectedOption', function(value) {
   		console.log(value);
   		if (value > 1) {
   			$scope.submitTitle = "Send Security Code";
   		} else {
   			$scope.submitTitle = "Register";
   		}
	});

	$scope.registrationComplete = function() {
		$state.go("app.ticketsCalendar");
	};
	
	$scope.init();
}]);$