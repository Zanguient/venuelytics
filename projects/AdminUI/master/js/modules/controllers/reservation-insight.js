'use strict';
App.controller('ReservationDashBoardController',['$log','$scope','$window', '$http', '$timeout','ContextService', 'APP_EVENTS', 'RestServiceFactory','$translate','Session','$state',
                                      function($log, $scope, $window, $http, $timeout, contextService, APP_EVENTS, RestServiceFactory, $translate, session, $state) {
	
    
    $scope.PERIODS = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];
    var monthNames = [];
    monthNames["Jan"] = 0;
    monthNames["Feb"] = 1;
    monthNames["Mar"] = 2;
    monthNames["Apr"] = 3;
    monthNames["May"] = 4;
    monthNames["Jun"] = 5;
    monthNames["Jul"] = 6;
    monthNames["Aug"] = 7;
    monthNames["Sep"] = 8;
    monthNames["Oct"] = 9;
    monthNames["Nov"] = 10;
    monthNames["Dec"] = 11;
    var colors = ["#51bff2", "#4a8ef1", "#3cb44b","#0082c8", "#911eb4", "#e6194b","#f0693a", "#f032e6 ", "#f58231","#d2f53c", "#ffe119","#a869f2", "#008080","#aaffc3", "#e6beff", "#aa6e28", "#fffac8","#800000","#808000 ","#ffd8b1","#808080","#808080"];
    $scope.barTicks =[];

    $scope.selectedPeriod = 'WEEKLY';
    $scope.xAxisMode = 'categories';
    $scope.yPos = $scope.app.layout.isRTL ? 'right' : 'left';
    $scope.effectiveVenueId = contextService.userVenues.selectedVenueNumber;
    
    $scope.reservationRequestUrl = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId,  'ReservedBookingsCount', 'Weekly', 'scodes=BPK');
    $scope.reservationRequestByServiceType = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId,  'ReservedBookingsByServiceType', 'Weekly', 'scodes=BPK');
    $scope.reservationRequestByValue = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId,  'ServiceTypeByReason', 'Weekly', 'scodes=BPK');

    $scope.canceledRequestUrl = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId,  'CanceledBookingsCount', 'Weekly', 'scodes=BPK');
    $scope.canceledRequestByServiceType = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId,  'CanceledBookingsByServiceType', 'Weekly', 'scodes=BPK');
    $scope.canceledRequestByValue = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId,  'CanceledByOccasion', 'Weekly', 'scodes=BPK');

    $scope.cityRequestByServiceType = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId,  'CityByServiceType', 'Weekly', 'scodes=BPK');
    $scope.cityRequestByValue = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId,  'CityByOccasion', 'Weekly', 'scodes=BPK');


    $scope.init = function() {
        $scope.effectiveVenueId = contextService.userVenues.selectedVenueNumber;
        $scope.reservationStatsChart();
       
    };

    

    
    $scope.setPeriod = function(period) {
        if ($scope.selectedPeriod !== period){
            $scope.selectedPeriod = period;
            $scope.reservationStatsChart();
             
        }
    };
    
    $scope.formatStackData = function(data) {
        return formatStackDataImpl(data, 'name');
    };

    $scope.formatStackDataForSubName = function(data) {
        return formatStackDataImpl(data, 'subName');
    };

    $scope.formatBarData = function(data) {
        return formatBarDataImpl(data, 'name');
    };

    $scope.formatBarDataForSubName = function(data) {
        return formatBarDataImpl(data, 'subName');
    };
    
    $scope.formatDataAggBysubName = function(data) {
         return formatDataAggBysubNameImpl(data, 'subName');
    }

    $scope.formatBarDataBy12 = function(data) {
        
       var retData = [];
       
        var colorIndex = 0;
        if (data.length > 0){
            var ticks = [];
            var ticksMapIndex = {};
            var currentTickIndex = 0;
            var seriesMap = [];
            for (var index in data[0].series) {
                var d = data[0].series[index];
                
                var elem = seriesMap[d['name']];
                if (!elem) {
                    elem = {};
                    elem.data = [];
                    elem.label = d['name'];
                    elem.color = colors[colorIndex % colors.length];
                    colorIndex++;
                    elem.bars= {
                        show: true,
                        barWidth: 0.25,
                        fill: true,
                        lineWidth: 1,
                        align: 'center',
                        order: colorIndex,
                        fillColor:  elem.color
                    };
                    seriesMap[d['name']]  = elem;
                     retData.push(elem);
                }
                var total = 0;
                for (var i =0; i < d.data.length; i++){
                      total += d.data[i][1];
                }
                var tickIndex = ticksMapIndex[d['subName']];
                if (!tickIndex) {
                    tickIndex = currentTickIndex;
                    ticksMapIndex[d['subName']] = tickIndex;
                    currentTickIndex++;
                    ticks.push([tickIndex, d['subName']]);
                }
                elem.data.push([tickIndex, total]);
               
            }
        }
        return {data: retData, ticks: ticks};

    }
    function formatDataAggBysubNameImpl(data, propertyName) {

        var retData = [];
        
        var colorIndex = 0;
        var elem = {};
        elem.data = [];
        elem.label = "";
        elem.color = colors[colorIndex % colors.length];
        colorIndex++;
        var errorCount = 0;
        if (data.length > 0){
            for (var index in data[0].series) {
                var series = data[0].series[index];

                var total = 0;
                for (var i =0; i < series.data.length; i++){
                    total += series.data[i][1];
                    
                }
                /*if (series[propertyName].length !== 5) {   
                    errorCount += total;
                } else {*/
                    elem.data.push([series[propertyName], total]);
                //}
            }
            retData.push(elem);
        }
        return retData;

    }
    function formatBarDataImpl(data, propertyName) {
      
        var retData = [];
       
        var colorIndex = 0;
        if (data.length > 0){
            var ticks = [];

            for (var idx in data[0].ticks){
                ticks[data[0].ticks[idx][1]] = parseInt(idx);
                data[0].ticks[idx][0] = parseInt(idx);
            }
            $scope.barTicks = data[0].ticks;
            for (var index in data[0].series) {
                var d = data[0].series[index];
                var elem = {};
                elem.label = $translate.instant(d[propertyName]);
                elem.color = colors[colorIndex % colors.length];
                colorIndex++;
                elem.bars= {
                    show: true,
                    barWidth: 0.25,
                    fill: true,
                    lineWidth: 1,
                    align: 'center',
                    order: colorIndex,
                    fillColor:  elem.color
                };
                 elem.data = [];
                if ($scope.selectedPeriod !== 'DAILY') {
                    
                    for (var i =0; i < d.data.length; i++){
                     
                        var dataElem = [ticks[d.data[i][0]], d.data[i][1]];
                        elem.data.push(dataElem);
                    }

                }
                else{
                   
                    for (var i =0; i < d.data.length; i++){
                        var from = d.data[i][0].split("-");
                        var f = new Date(from[0], from[1] - 1, from[2]);
                        var dataElem = [f.getTime(), d.data[i][1]];
                        elem.data.push(dataElem);
                    }
                }
                retData.push(elem);
            }
        }
        return {data: retData, ticks: $scope.barTicks};
    };
    function formatStackDataImpl(data, propertyName) {
        var retData = [];
        
        var colorIndex = 0;
        if (data.length > 0){
            for (var index in data[0].series) {
                var d = data[0].series[index];
                var elem = {};
                elem.label = $translate.instant(d[propertyName]);
                elem.color = colors[colorIndex % colors.length];
                colorIndex++;

                if ($scope.selectedPeriod !== 'DAILY') {
                    elem.data = d.data;
                }
                else {
                    elem.data = [];
                    for (var i =0; i < d.data.length; i++){
                        var from = d.data[i][0].split("-");
                        var f = new Date(from[0], from[1] - 1, from[2]);
                        var dataElem = [f.getTime(), d.data[i][1]];
                        elem.data.push(dataElem);
                    }
                }
                retData.push(elem);
            }
        }
        return retData;
    }
    $scope.$on(APP_EVENTS.venueSelectionChange, function(event, data) {
        // register on venue change;
       $scope.init();
    });  


    $scope.reservationStatsChart = function() {
           
        var temp = $scope.selectedPeriod.toLowerCase();
        var aggPeriodType = temp.charAt(0).toUpperCase() + temp.slice(1);
        
        $scope.reservationRequestUrl = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId,  'ReservedBookingsCount', aggPeriodType, 'scodes=BPK');
        $scope.reservationRequestByServiceType = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId,  'ReservedBookingsByServiceType', aggPeriodType, 'scodes=BPK');
        $scope.reservationRequestByValue = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId,  'ServiceTypeByReason', aggPeriodType, 'scodes=BPK');

        $scope.canceledRequestUrl = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId,  'CanceledBookingsCount', aggPeriodType, 'scodes=BPK');
        $scope.canceledRequestByServiceType = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId,  'CanceledBookingsByServiceType', aggPeriodType, 'scodes=BPK');
        $scope.canceledRequestByValue = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId,  'CanceledByOccasion', aggPeriodType, 'scodes=BPK');

        $scope.cityRequestByServiceType = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId,  'CityByServiceType', aggPeriodType, 'scodes=BPK');
        $scope.cityRequestByValue = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId,  'CityByOccasion', aggPeriodType, 'scodes=BPK');


        $scope.xAxisMode = 'categories'; 
        if ($scope.selectedPeriod === 'DAILY') {
            $scope.xAxisMode = 'time';
        } else {
            $scope.xAxisMode = 'categories';               
        }
    };
    
    
    
    
    


}]);