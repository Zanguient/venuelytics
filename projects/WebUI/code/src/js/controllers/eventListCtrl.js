/**
 * @author Saravanakumar K
 * @date 05-sep-2017
 */
"use strict";
app.controller('eventListCtrl', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', 'APP_COLORS', '$rootScope',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, APP_ARRAYS, APP_COLORS, $rootScope) {
        
    var self = $scope;

    var DAYS = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
    /**
    * Invoke full calendar plugin and attach behavior
    * @param  jQuery [calElement] The calendar dom element wrapped into jQuery
    * @param  EventObject [events] An object with the event list to load when the calendar displays
    */
    self.events = [];
    self.calEvents = [];
     self.colorPalattes = ["rgb(45,137,239)", "rgb(153,180,51)", "rgb(227,162,26)",  "rgb(0,171,169)","#f05050", "rgb(135,206,250)", "rgb(255,196,13)"];

    self.init = function() {
        self.tabParam = $routeParams.tabParam;
        AjaxService.getEvents($routeParams.venueid).then(function(response) {
          self.events = response.data['venue-events'];
          self.events.endtimes = '';
            var today = new Date();
            self.calEvents = [];
            for(var i = 0; i < self.events.length; i++) {
              var event = self.events[i];
              if (event.enabled !== 'Y') {
                continue;
              }
              var obj = {};
              obj.title = event.eventType  + ':' +  event.eventName;  
              var sDate = new Date(event.startDate);
              var endDate = new Date(event.endDate);
              var t = event.eventTime.split(":");
              var h = parseInt(t[0]);
              var m = parseInt(t[1]);
             
              sDate.setHours(h);
              sDate.setMinutes(m);
              sDate.setSeconds(0);
      
              obj.start = sDate;
              obj.end = moment(sDate).add(event.durationInMinutes, 'm');
              obj.allDay = false;
              event.eventTime = obj.start;
              var dateValue = moment(obj.end).format("H:mm a");
              var H = +dateValue.substr(0, 2);
              var h = (H % 12) || 12;
              var ampm = H < 12 ? " AM" : " PM";
              dateValue = h + dateValue.substr(2, 3) + ampm;
              if(dateValue.indexOf(":")) {
              } else {
                dateValue = h + ':'+ dateValue.substr(2, 3) + ampm;
              }
              event.endtimes = dateValue;
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
                    self.calEvents.push(cloneObj);
                  }
                } else if (event.scheduleDayOfMonth.length > 0) {
                  if (mDays[d.getDate()] === 1) {
                    self.calEvents.push(cloneObj);
                  }
                } else {
                  self.calEvents.push(cloneObj);
                  break;
                }
              }
            }
            $('#calendar').fullCalendar( 'removeEvents');
            $('#calendar').fullCalendar( 'addEventSource', self.calEvents );
            $('#calendar').fullCalendar('rerenderEvents' );
        });
    }

    self.calenderEventView = function() {
        self.eventListData = false;
        self.calenderData = true;
    }
    self.listEventView = function() {
        self.eventListData = true;
        self.calenderData = false;
    }

    self.init();

}]);