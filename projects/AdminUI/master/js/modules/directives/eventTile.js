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
  	controller : [ '$scope', 'RestServiceFactory', '$state', 'ngDialog', 
  			function($scope, RestServiceFactory, $state, ngDialog) {
		
		$scope.$watch('event', function() {
        	
    	});
		$scope.editEvent = function(eventId) {
    		$state.go('app.editVenueEvent', {venueNumber: $scope.event.venueNumber, id: eventId});
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
	          $scope.events.splice(index,1);
	        },function(error){
	          if (typeof error.data !== 'undefined') { 
	            toaster.pop('error', "Server Error", error.data.developerMessage);
	          } 
	        });
	      });
			
		};

		$scope.printEvent = function(event) {
			var mywindow = window.open('', 'PRINT', 'height=400,width=600');

		    mywindow.document.write('<html><head><title> VenueLytics - ' + event.eventName  + '</title>');
		    mywindow.document.write('<link rel="stylesheet" href="app/css/app.css">');
		    mywindow.document.write('<link rel="stylesheet" href="app/css/theme-e.css">');
		    mywindow.document.write('</head><body >');

		    mywindow.document.write('<h1>' + event.eventName  + '</h1>');

		    var elementId = 'event-id-'+event.id +'-'+event.startDate;
		    var html = document.getElementById(elementId).outerHTML;
		    mywindow.document.write('<div style="position: relative; left: 50px; width: 320px !important; height:auto">' + html + '</div>');
		    mywindow.document.write('</body></html>');

		    mywindow.document.close(); // necessary for IE >= 10
		    mywindow.focus(); // necessary for IE >= 10*/

		    mywindow.print();
		   // mywindow.close();

		    return true;
		}
  	}],
    templateUrl: 'app/templates/event-tile.html'
  };
});