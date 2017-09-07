/**=========================================================
 * Module: userInfo.js
 * smangipudi
 =========================================================*/

App.controller('VenueEventController', ['$scope', '$timeout', '$state','$stateParams', 'RestServiceFactory', 'toaster', 'FORMATS','ngDialog',
    function($scope, $timeout, $state, $stateParams, RestServiceFactory, toaster, FORMATS, ngDialog) {
  'use strict';
    
    var n = $scope.minDate = new Date(2017,1,1);
    
    $scope.maxDate = new Date(n.getFullYear()+1, n.getMonth(), n.getDate());
    
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };
    $scope.config = {};
    $scope.config.scheduleRadio = "N";

    $scope.eventTypes = {};
    $scope.eventTypes['DJ'] = 'DJ';
    $scope.eventTypes['VJ'] = 'VJ';
    $scope.eventTypes['COUNTRY WESTERN'] = 'Country Western';
    $scope.eventTypes['LATIN NIGHT'] = 'Latin Nights';
    $scope.eventTypes['ROCK BAND'] = 'Rock Band';
    $scope.eventTypes['COMEDY'] = 'Comedy';
    $scope.eventTypes['KARAOKE'] = 'Karaoke';
    $scope.eventTypes['DANCE'] = 'Dance Night';
    $scope.eventTypes['MUSICAL'] = 'Musical Night';

   
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
            $scope.config.scheduleRadio = data.scheduleDayOfWeek.length >0 ? 'W' : data.scheduleDayOfMonth.length >0 ? 'M' : 'N';
            //$scope.changed();
	    });
    } else {
    	var data = {};
        data.venueNumber = $stateParams.venueNumber;
    	data.enabled = false;
    	$scope.data = data;
    }
	$scope.changed = function() {
        
    };
    $scope.performers = [];
    RestServiceFactory.PerformerService().get(function(data) {
        $scope.performers = data.performers;
    });

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
   
    $scope.update = function(isValid, form, data) {

        if (!isValid) {
            return;
        }

        data.venueNumber = $stateParams.venueNumber;
        var t = $scope.eventDisplayTime;
        data.eventTime = t.getHours() +":" + t.getMinutes();
    	var payload = RestServiceFactory.cleansePayload('VenueEventService', data);
        var target = {id: data.id};
        if ($stateParams.id === 'new'){
          target = {};
        }
         if($scope.config.scheduleRadio === 'N') {
            payload.scheduleDayOfWeek = '';
            payload.scheduleDayOfMonth = '';
        } else if($scope.config.scheduleRadio === 'M') {
            payload.scheduleDayOfWeek = '';
        } else {
            payload.scheduleDayOfMonth = '';
        }
        console.log(JSON.stringify(payload))
        RestServiceFactory.VenueService().saveEvent(target, payload, function(success){
         
            ngDialog.openConfirm({
              template: '<p>venue Event information  successfully saved</p>',
              plain: true,
              className: 'ngdialog-theme-default'
            });
          
          $state.go('app.venueedit', {id: $stateParams.venueNumber});
        },function(error){
          if (typeof error.data !== 'undefined') {
           toaster.pop('error', "Server Error", error.data.developerMessage);
          }
        });
        
    };
    $scope.uploadFile = function(images) {
        var payload = new FormData();
        payload.append("file", images[0]);
        var target ={objectType: 'venueEvent'};
        RestServiceFactory.VenueImage().uploadImage(target,payload, function(success){
          if(success !== {}){
            $scope.data.imageURL = success.originalUrl;
            toaster.pop('success', "Image upload successfull");
            document.getElementById("control").value = "";
          }
        },function(error){
          if (typeof error.data !== 'undefined') {
           toaster.pop('error', "Server Error", error.data.developerMessage);
            }
        });
    };
}]);