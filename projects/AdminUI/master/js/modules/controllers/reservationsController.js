/**
 * smangipudi
 * ========================================================= 
 * Module:
 * reservationsController.js  for reservation manager view
 * =========================================================
 */

App.controller('ReservationsController',  ['$state', '$stateParams','$scope', '$rootScope', '$location','AUTH_EVENTS',
										'AuthService', '$cookies', 'Session', 'ContextService',
                                     function ($state, $stateParams, $scope, $rootScope, $location, AUTH_EVENTS, 
                                     	AuthService, $cookies, Session, contextService) {
    "use strict";
   
   /**
   * Invoke full calendar plugin and attach behavior
   * @param  jQuery [calElement] The calendar dom element wrapped into jQuery
   * @param  EventObject [events] An object with the event list to load when the calendar displays
   */
  	$scope.events = [];
  	$scope.getReservationSummary = function() {

  	}
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
	      editable: true,
	      droppable: true, // this allows things to be dropped onto the calendar 
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
	      // This array is the events sources
	      //events: events
	  });
	};

	$scope.setVenue = function(venueName, venueNumber) {
     
   	};
	
	$scope.initCalendar();
                                     	
}]);
