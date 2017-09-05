/**
 * @author Saravanakumar K
 * @date 05-sep-2017
 */
"use strict";
app.controller('eventListCtrl', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', 'APP_COLORS', '$rootScope',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, APP_ARRAYS, APP_COLORS, $rootScope) {
        
    var self = $scope;

    self.init = function() {
        self.tabParam = $routeParams.tabParam;
        AjaxService.getEvents($routeParams.venueid).then(function(response) {
            var obj = response.data;
            Object.keys(obj).forEach(function(key){
                var value = obj[key];
                self.venueEvents =value;
              });
              angular.forEach(self.venueEvents, function(value,key) {
                var timeString = value.eventTime;
                var hourEnd = timeString.indexOf(":");
                var compareHour = timeString.split(":");
                var H = +timeString.substr(0, hourEnd);
                var h = H % 12 || 12;
                value.endTime = (value.durationInMinutes/60);
                var endHour = Math.round(h + value.endTime);
                var endTime = endHour % 12 || 12;
                var ampm = H < 12 ? "AM" : "PM";
                var timeData = timeString.substr(hourEnd, 3);
                if(compareHour[1] === '0') {
                    timeData = ':00';
                }
                timeString = h + timeData + ampm;
                var pmam = endHour < 12 ? "PM" : "AM";
                var endTimeString = endTime +pmam;
                value.endTime = endTimeString;
                value.eventTime = timeString;
              });
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