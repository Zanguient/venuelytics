/**
 * ===========================
 * 		Smangipudi
 * ===========================
 */

App.directive('eventTile', function() {
  "use strict";
  return {
    restrict: 'A',
    scope:{
	  event: '='
  	},
  	controller : [ '$scope', '$rootScope','RestServiceFactory', '$state', 'ngDialog', 'APP_EVENTS',
  			function($scope, $rootScope, RestServiceFactory, $state, ngDialog, APP_EVENTS) {
		
		$scope.editEvent = function(eventId) {
    		$state.go('app.editVenueEvent', {venueNumber: $scope.event.venueNumber, id: eventId});
  		};

  		$scope.previewEventUrl = function(eventId) {
  			return "v1/download/"+ $scope.event.venueNumber +"/pdf/ticket/preview/" + eventId ;
  		};
  		$scope.getPreviewFileName = function(eventId) {
  			return "event-pdf-preview-" + eventId + ".pdf"; 
  		};

  		$scope.enableDisableColor = function(enabled) {
    		return enabled === 'Y' ? 'fa fa-check' : '';
  		};	

  		$scope.UTC = function(date) {
  			if (typeof(date) === 'undefined') {
  				return new Date();
  			}
  			var startDate = date.substring(0,10);
            var from = startDate.split("-");
            return new Date(from[0], from[1] - 1, from[2]);
  		};

  		$scope.TIME = function(d) {
  			if (typeof d !== 'undefined') {
		      var t = d.split(":");
		      var h = parseInt(t[0]);
		      var m = parseInt(t[1]);
		      
		      var d = new Date();
		      
		      d.setHours(h);
		      d.setMinutes(m);
		      return d;
		    }
		    return new Date();
  		};

		$scope.deleteEvent = function(index, eventId) {

	      ngDialog.openConfirm({
	        template: 'deleteVenueEventId',
	        className: 'ngdialog-theme-default'
	      }).then(function (value) {
	        var target = {id: eventId};
	        RestServiceFactory.VenueService().deleteEvent(target,  function(success){
	          $rootScope.$broadcast(APP_EVENTS.deleteEvent, {event: $scope.event});
	        },function(error){
	          if (typeof error.data !== 'undefined') { 
	            toaster.pop('error', "Server Error", error.data.developerMessage);
	          } 
	        });
	      });
			
		};
  	}],
    templateUrl: 'app/templates/event-tile.html'
  };
});