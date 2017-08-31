/**=========================================================
 * Module: userInfo.js
 * smangipudi
 =========================================================*/

App.controller('VenueEventController', ['$scope', '$timeout', '$stateParams', 'RestServiceFactory', 'toaster', 'FORMATS',
    function($scope, $timeout, $stateParams, RestServiceFactory, toaster, FORMATS) {
  'use strict';
    var n;
    n = $scope.minDate = new Date(2017,1,1);
    
    $scope.maxDate = new Date(n.getFullYear()+1, n.getMonth(), n.getDate());
    console.log($scope.maxDate);
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };
    $scope.config = {};
     $scope.config.scheduleRadio = "M";

   $scope.radioChecked = function() {
    console.log(JSON.stringify($scope.config));
   };
  // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return false;
    };
    
    $scope.eventDisplayTime = new Date();
    $scope.eventDisplayTime.setHours(0);
    $scope.eventDisplayTime.setMinutes(0);
    $scope.eventDisplayTime.setSeconds(0);
    console.log($scope.eventDisplayTime);
    if($stateParams.id !== 'new') {
	    var promise = RestServiceFactory.VenueService().getEvent({id:$stateParams.id});
	    promise.$promise.then(function(data) {
	    	$scope.data = data;

            var t = data.eventTime.split(":");
            var h = parseInt(t[0]);
            var m = parseInt(t[1]);
            var d = new Date();

            d.setHours(h);
            d.setMinutes(m);
            d.setSeconds(0);
            $scope.eventDisplayTime = d;
	    });
    } else {
    	var data = {};
    	data.enabled = false;
    	$scope.data = data;
    }
	$scope.changed = function() {

    };
    // $scope.startOpened = true;
    $('#startDtCalendarId').on('click', function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $timeout(function() {
            $scope.config.startOpened = !$scope.config.startOpened;
        }, 200);
    });
    $('#endDtCalendarId').on('click', function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $timeout(function() {
            $scope.config.endOpened = !$scope.config.endOpened;
        }, 200);
    });
    
    $scope.update = function(form, data) {
    	console.log(JSON.stringify(form.$error));
    };
}]);