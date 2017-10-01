/**
 * smangipudi
 * ========================================================= 
 * Module:
 * reservationsController.js  for reservation manager view
 * =========================================================
 */

App.controller('TicketsCalendarController',  ['$state', '$stateParams','$scope', 'toaster', 'Session','ContextService', 
  'RestServiceFactory', 'APP_EVENTS','ngDialog', function ($state, $stateParams, $scope, toaster, session, 
    contextService, RestServiceFactory, APP_EVENTS, ngDialog) {
  "use strict";

  var DAYS = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
 /**
 * Invoke full calendar plugin and attach behavior
 * @param  jQuery [calElement] The calendar dom element wrapped into jQuery
 * @param  EventObject [events] An object with the event list to load when the calendar displays
 */
  $scope.events = [];
  $scope.calEvents = [];
  $scope.isManager = session.roleId == 11 || session.roleId == 12;
  $scope.registered = false;

  $scope.colorPalattes = ["rgb(45,137,239)", "rgb(153,180,51)", "rgb(227,162,26)",  "rgb(0,171,169)","#f05050", "rgb(135,206,250)", "rgb(255,196,13)"];
  var self = $scope;
  self.enableReset = false;

  $scope.getEvents = function() {

    var promise = RestServiceFactory.VenueService().getEvents({id: contextService.userVenues.selectedVenueNumber});
    promise.$promise.then(function(data) {
      $scope.events = data['venue-events'];
      var today = new Date();
      $scope.calEvents = [];
      for(var i = 0; i < $scope.events.length; i++) {
        var event = $scope.events[i];
        if (event.enabled !== 'Y') {
          continue;
        }
        var obj = {};
        obj.title = event.eventName;  
        var sDate = new Date(event.startDate);
        var endDate = new Date(event.endDate);
        var t = event.eventTime.split(":");
        var h = parseInt(t[0]);
        var m = parseInt(t[1]);
       
        sDate.setHours(h);
        sDate.setMinutes(m);
        sDate.setSeconds(0);

        endDate.setHours(23);
        endDate.setMinutes(59);
        endDate.setSeconds(59);

        obj.start = sDate;
        obj.end = moment(sDate).add(event.durationInMinutes, 'm');
        obj.allDay = false;
        obj.backgroundColor = $scope.colorPalattes[i % $scope.colorPalattes.length];
        obj.borderColor = $scope.colorPalattes[i % $scope.colorPalattes.length];
        obj.className = '__event_id_class';
        var tempDays = event.scheduleDayOfMonth.split(",");
        var mDays = [];
        for (var md = 0; md < tempDays.length; md++) {
          mDays[tempDays[md].trim()] = 1;
        }
        for (var timeMilliSecs = sDate.getTime(); timeMilliSecs <= endDate.getTime(); timeMilliSecs = timeMilliSecs + 24*60*60*1000) {
          var cloneObj = $.extend({}, obj);
          
          if (timeMilliSecs > today.getTime() + 180 * 24 * 60 * 60 * 1000) {
            break; // show only for 6 months from today.
          }
          var d = new Date(timeMilliSecs);
          cloneObj.start = d;
          cloneObj.end = moment(cloneObj.start).add(event.durationInMinutes, 'm');
          var day = DAYS[d.getDay()];
          cloneObj.venueEvent = event;
          if (event.scheduleDayOfWeek.length > 0) {
            if (event.scheduleDayOfWeek.indexOf(day) >=0) {
              $scope.calEvents.push(cloneObj);
            }
          } else if (event.scheduleDayOfMonth.length > 0) {
            if (mDays[d.getDate()] === 1) {
              $scope.calEvents.push(cloneObj);
            }
          } else {
            $scope.calEvents.push(cloneObj);
            break;
          }
        }
      }
      $('#calendar').fullCalendar( 'removeEvents');
      $('#calendar').fullCalendar( 'addEventSource', $scope.calEvents );
      $('#calendar').fullCalendar('rerenderEvents' );
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
      dayClick: function (date, jsEvent, view) {
          $scope.selectedDate = new Date(date);
          $scope.selectCalender = true;
          $scope.event = null;
          $scope.$digest();
          $scope.getTaxNFees();
      },
      eventClick: function( event, jsEvent, view ) {
        $scope.selectCalender = false;
        $scope.event = event.venueEvent;
        $scope.selectedDate = new Date(event.start);
        $scope.getTaxNFees();
        $('.__event_id_class').css('border-color', '');
        $(this).css('border-color', 'red');
        $scope.$digest();
        $scope.getEventTickets(event.venueEvent, $scope.selectedDate);
      },
      eventDragStart: function (event, js, ui) {
        //draggingEvent = event;
      },
      eventRender: function(event, eventElement) {
      },
	      // This array is the events sourc === 'BottleService'es
	    events: $scope.calEvents
    });
    $scope.selectedDate = new Date(calElement.fullCalendar('getDate'));
     
  };
  $scope.$on(APP_EVENTS.venueSelectionChange, function(event, data) {
      $scope.getEvents();  
  
  });
  $scope.mkDate = function(d, durationInMinutes) {
    if (typeof durationInMinutes === 'undefined') {
      durationInMinutes = 0;
    }    

    if (typeof d !== 'undefined') {
      var t = d.split(":");
      var h = parseInt(t[0]);
      var m = parseInt(t[1]);
      
      var d = new Date();
      
      d.setHours(h);
      d.setMinutes(m+durationInMinutes);
      return d;
    }
    return new Date();
  };

  $scope.getAgencyInfo = function() {
    RestServiceFactory.UserService().getAgencyInfo({id: session.userId}, function(data) {
      $scope.agency = data;
      if (session.roleId === 12 && $scope.agency.managerId === session.userId) {
        self.enableReset = true;
      }
      $scope.registration = angular.fromJson($scope.$storage['computerRegistration@AID:'+$scope.agency.id]);
      $scope.isManager = session.roleId == 11 || session.roleId == 12;
      if (typeof $scope.registration === 'undefined' ) {
        $scope.registration = {};
      }
      
      $scope.checkRegistration();

      if (data.budgetType === 'NM') {
        if (data.budget <= data.budgetUsed){
          data.budget = 2*data.budgetUsed;
        }
      }
      if (data.budget === 0){
        data.budget = 1;
      }
      $scope.budgetPercent = (data.budgetUsed*100)/data.budget;
      $scope.availableBudget = data.budget - data.budgetUsed;

    });
  };

  $scope.getEventTickets = function(event, date) {
    RestServiceFactory.VenueEventService().getEventTickets({id: event.id, date: moment(date).format("YYYYMMDD")}, function(data) {
        $scope.tickets = data;
    });
  };

  $scope.getTaxNFees = function() {
    RestServiceFactory.VenueService().getTaxNFees({id: contextService.userVenues.selectedVenueNumber, 
        YYMMDD: moment($scope.selectedDate).format("YYYYMMDD")}, function(data) {
        $scope.taxNFees = data;
    });
  };

  $scope.buyTicket = function(ticket) {
    $scope.ticket = ticket;
    var t = $scope.event.eventTime.split(":");
    var h = parseInt(t[0]);
    var m = parseInt(t[1]);
    $scope.selectedDate.setMinutes(m);
    $scope.selectedDate.setHours(h);

    $scope.ticketSale = {};
    $scope.ticketSale.ticketId = ticket.id;
    $scope.ticketSale.eventDate = $scope.selectedDate;
    $scope.ticketSale.soldMacId = $scope.registration.registrationCode;
    $scope.ticketSale.quantity = 1;

    $scope.dialog = ngDialog.open({
        template: 'app/views/venue-events/buy-ticket.html',
        scope : $scope,
        className: 'ngdialog-theme-default custom-width',
        controller: ['$scope','$timeout', function($scope, $timeout) {
        //$("#eventTicketId").parsley();
        $scope.calculateTaxNFees = function(ticket) {
          var quantity = $scope.ticketSale.quantity;
          if (typeof $scope.taxNFees !== 'undefined') {
            var tnfArray = $scope.taxNFees;
            var result = [];
            var totalTaxNFees = 0;
            for (var i = 0; i < tnfArray.length; i++) {
              var tnfItem = tnfArray[i];
              if (tnfItem.serviceType === 'TICKET-AGENCY') {
                if (tnfItem.valueType === '%'){
                  var cost = Number($scope.ticket.discountedPrice*quantity*tnfItem.value*0.01).toFixed(2);
                  totalTaxNFees += Number(cost);
                  var s = tnfItem.name +' (' +tnfItem.value+ '%) = <span class="pull-right">$' + cost +'</span>';
                  result.push(s);

                } else {
                  var cost = Number(tnfItem.value).toFixed(2);
                  var s = tnfItem.name +' = <span class="pull-right">$' + cost +'</span>';
                  totalTaxNFees += Number(cost);
                  result.push(s);
                }
              }
            }
            if (result.length > 0) {
              result.push("<hr class=\"mb0\"/>");
            }
            result.push('Total Taxes and Fees ($) = <span class="pull-right">$' + Number(totalTaxNFees).toFixed(2) +'</span>');
            var retResult = {};
            retResult.textHtml = result.join("<br>");
            retResult.value = totalTaxNFees;
            return retResult;
          }
          var retResult = {text: "Total Taxes and Fees ($) = 0", value: 0};
          return retResult;
          
        };
        $scope.totalPriceWithTaxNFees = function(ticket) {
          var cal = $scope.calculateTaxNFees(ticket);
          return Number(ticket.discountedPrice*$scope.ticketSale.quantity + cal.value).toFixed(2) ;
        };

        $scope.sellTicket = function(ticketInfo) {

          if (ticketInfo.$valid && $("#sellTicketId").parsley().isValid()) {
            if (typeof ticket.contactName !== 'undefined' 
                  || typeof ticket.contactEmail !== 'undefined' 
                  || typeof ticket.contactPhone !== 'undefined') {

              if (!( typeof ticket.contactName !== 'undefined' && 
                  (typeof ticket.contactEmail !== 'undefined' || typeof ticket.contactPhone !== 'undefined'))){
                return;
              }
            }
            var target = {id: $scope.event.id, ticketId: ticket.id};
            
            RestServiceFactory.VenueEventService().buyTicket(target, $scope.ticketSale, function(data){
              $scope.dialog.close();
              self.getEventTickets(self.event, self.selectedDate);
              self.getAgencyInfo();
            }, function(error, s) {
               if (typeof error.data !== 'undefined') { 
                  toaster.pop('error', "Buy Ticket Failed", error.data.message);
               }
            });
          }
        };
      }]
    });
  };

  $scope.resetBudget = function() {
    var target = {id: $scope.agency.id};
            
    RestServiceFactory.AgencyService().resetBudget(target, function(data) {
      self.getAgencyInfo();
    });
  };
  $scope.register = function() {
    $state.go('app.registerComputer');
  }
  $scope.unregister = function() {
    //$state.go('app.registerComputer');
  }
  $scope.checkRegistration = function() {
    var target = {};
    RestServiceFactory.AgencyService().checkRegistration(target, $scope.registration, function(data) {
      if (data.status == 1) { // computer is registered, go to done screen.
        $scope.authorizationCode = 1;
        $scope.getEvents();
      } else {
        $scope.authorizationCode = -1;
      }
      
    });
  };
  $scope.authorizationCode = 0;
  $scope.initCalendar();
  $scope.getAgencyInfo();
  
}]);
