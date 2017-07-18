/**
 * smangipudi
 * ========================================================= 
 * Module:
 * reservationsController.js  for reservation manager view
 * =========================================================
 */

App.controller('ReservationsController',  ['$state', '$stateParams','$scope', '$rootScope', '$location','AUTH_EVENTS',
										'AuthService', '$cookies', 'Session', 'ContextService', 'RestServiceFactory',
                                     function ($state, $stateParams, $scope, $rootScope, $location, AUTH_EVENTS, 
                                     	AuthService, $cookies, Session, contextService, RestServiceFactory) {
    "use strict";
   
   /**
   * Invoke full calendar plugin and attach behavior
   * @param  jQuery [calElement] The calendar dom element wrapped into jQuery
   * @param  EventObject [events] An object with the event list to load when the calendar displays
   */
  	$scope.events = [];
  	$scope.getReservationSummary = function() {
  		RestServiceFactory.AnalyticsService().get({id: contextService.userVenues.selectedVenueNumber, 
  			anaType: 'ReservedBookings', aggPeriodType: 'Yearly', filter: 'scodes=BPK&aggTypeFilter=2017'}, function(data){
        	$scope.reservedBookings = data;
        	$scope.events = [];
        	var bottleCount = $scope.reservedBookings['Bottle.count'];
        	var banquetCount = $scope.reservedBookings['BanquetHall.count'];

        	for( var dateKey in $scope.reservedBookings.calendar){
        		 if ($scope.reservedBookings.calendar.hasOwnProperty(dateKey)) {
        		 	if (typeof bottleCount !== 'undefined' && bottleCount > 0) {
        		 		var reservedBottle = $scope.reservedBookings.calendar[dateKey].VenueMap;
        		 		if (typeof reservedBottle === 'undefined') {
        		 			reservedBottle = 0;
        		 		}
        		 		var from = dateKey.split("-");
						var f = new Date(from[0], from[1] - 1, from[2]);

        		 		
        		 		var remaining = (bottleCount - reservedBottle);
        		 		if (remaining < 0) {
        		 			remaining = 0	
        		 		}
        		 		var obj = {};
       		 			obj.title = 'Available: ' + remaining;	
       		 			obj.serviceType = 'BottleService';
       		 			obj.start = f;
	        		 	if (remaining == 0) 	{
        		 			obj.title = 'Fully Booked';	
        		 			obj.backgroundColor = '#f56954'; //red 
                  			obj.borderColor = '#f56954'; //red
                  		} else if (remaining >= bottleCount/2 ) {
        		 			obj.backgroundColor = '#00a65a'; //red 
                  			obj.borderColor = '#00a65a'; //red
                  		} else {
                  			obj.backgroundColor = '#f39c12'; //red 
                  			obj.borderColor = '#f39c12'; //red
                  		}
                  		obj.allDay = true;
                  		$scope.events.push(obj);		
        		 	}
        		 	
        		 }
             }
             $scope.initCalendar();
        },function(error){
            if (typeof error.data !== 'undefined') { 
                toaster.pop('error', "Server Error", error.data.developerMessage);
            }
        });
  	};

 	$scope.initCalendar = function () {
		 var calElement = $('#calendar');
	  	// check to remove elements from the list 
	  	calElement.fullCalendar({
	      isRTL: $scope.app.layout.isRTL,
	      header: {
	          left:   'prev,next today',
	          center: 'title',
	          right:  'month,agendaWeek,agendaDay'
	      },
	      buttonIcons: { // note the space at the beginning
	          prev:    ' fa fa-caret-left',
	          next:    ' fa fa-caret-right'
	      },
	      buttonText: {
	          today: 'today',
	          month: 'month',
	          week:  'week',
	          day:   'day'
	      },
	      editable: false,
	      selectable: true,
	      droppable: false, // this allows things to be dropped onto the calendar 
	      drop: function(date, allDay) { // this function is called when something is dropped
	          
	          var $this = $(this),
	              // retrieve the dropped element's stored Event Object
	          originalEventObject = $this.data('calendarEventObject');

	          // if something went wrong, abort
	          if(!originalEventObject) return;

	          // clone the object to avoid multiple events with reference to the same object
	          var clonedEventObject = $.extend({}, originalEventObject);

	          // assign the reported date
	          clonedEventObject.start = date;
	          clonedEventObject.allDay = allDay;
	          clonedEventObject.backgroundColor = $this.css('background-color');
	          clonedEventObject.borderColor = $this.css('border-color');

	          // render the event on the calendar
	          // the last `true` argument determines if the event "sticks" 
	          // (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
	          //calElement.fullCalendar('renderEvent', clonedEventObject, true);
	          
	      },
	      eventDragStart: function (event, js, ui) {
	        //draggingEvent = event;
	      },
	      eventRender: function(event, eventElement) {
    		if (event.serviceType === 'BottleService') {
        		eventElement.find("span.fc-event-title").prepend('<em class="fa fa-glass">');
    		}
		  },
	      // This array is the events sourc === 'BottleService'es
	      events: $scope.events
	  });
	};

	$scope.setVenue = function(venueName, venueNumber) {
     
   	};
	$scope.getReservationSummary();
                                     	
}]);
